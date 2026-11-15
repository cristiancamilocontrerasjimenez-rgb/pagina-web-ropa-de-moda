import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getPool } from './src/db/pool.ts';
import { ensureDatabaseSchema } from './src/db/init.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const FREE_SHIPPING_THRESHOLD = 180;
const FLAT_SHIPPING_USD = 12;

interface OrderItemInput {
  productId: string;
  size: string;
  quantity: number;
}

interface OrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity?: string;
  notes?: string;
  channel?: 'web' | 'whatsapp';
  items: OrderItemInput[];
}

interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  garment: string;
  message: string;
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      await ensureDatabaseSchema();
      const pool = getPool();
      await pool.query('SELECT 1');
      res.json({ ok: true });
    } catch (error) {
      console.error('Database health check failed:', error);
      res.status(503).json({ ok: false, error: 'Database unavailable' });
    }
  });

  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      await ensureDatabaseSchema();
      const pool = getPool();
      const { rows } = await pool.query(
        `SELECT id, sku, category, name, fabric, price_usd, summary, details, sizes, stock_note
         FROM products
         WHERE active = TRUE
         ORDER BY created_at ASC`
      );
      res.json({ products: rows });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      res.status(500).json({ error: 'No pudimos cargar el catálogo en este momento.' });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    const body = req.body as Partial<OrderPayload>;

    if (
      !body ||
      typeof body.customerName !== 'string' ||
      body.customerName.trim().length < 2 ||
      typeof body.customerPhone !== 'string' ||
      body.customerPhone.trim().length < 6 ||
      typeof body.deliveryAddress !== 'string' ||
      body.deliveryAddress.trim().length < 6 ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return res.status(400).json({
        error: 'Completa nombre, teléfono, dirección de entrega y al menos una prenda.',
      });
    }

    const sanitizedItems: OrderItemInput[] = [];
    for (const rawItem of body.items) {
      if (
        !rawItem ||
        typeof rawItem.productId !== 'string' ||
        typeof rawItem.size !== 'string' ||
        typeof rawItem.quantity !== 'number' ||
        !Number.isInteger(rawItem.quantity) ||
        rawItem.quantity <= 0 ||
        rawItem.quantity > 50
      ) {
        return res.status(400).json({ error: 'Artículo o cantidad inválida en el pedido.' });
      }
      sanitizedItems.push({
        productId: rawItem.productId.trim(),
        size: rawItem.size.trim().toUpperCase(),
        quantity: rawItem.quantity,
      });
    }

    const channel = body.channel === 'whatsapp' ? 'whatsapp' : 'web';

    try {
      await ensureDatabaseSchema();
      const pool = getPool();
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        const productIds = Array.from(new Set(sanitizedItems.map((i) => i.productId)));
        const { rows: productRows } = await client.query<{
          id: string;
          sku: string;
          name: string;
          price_usd: number;
        }>(
          'SELECT id, sku, name, price_usd FROM products WHERE id = ANY($1::text[]) AND active = TRUE',
          [productIds]
        );

        const productMap = new Map(productRows.map((row) => [row.id, row]));

        let subtotalUsd = 0;
        const resolvedItems: Array<{
          productId: string;
          sku: string;
          name: string;
          size: string;
          quantity: number;
          unitPriceUsd: number;
          lineTotalUsd: number;
        }> = [];

        for (const item of sanitizedItems) {
          const catalogProduct = productMap.get(item.productId);
          if (!catalogProduct) {
            await client.query('ROLLBACK');
            return res.status(400).json({
              error: `La prenda "${item.productId}" ya no está disponible.`,
            });
          }
          const lineTotalUsd = catalogProduct.price_usd * item.quantity;
          subtotalUsd += lineTotalUsd;
          resolvedItems.push({
            productId: catalogProduct.id,
            sku: catalogProduct.sku,
            name: catalogProduct.name,
            size: item.size,
            quantity: item.quantity,
            unitPriceUsd: catalogProduct.price_usd,
            lineTotalUsd,
          });
        }

        const shippingUsd = subtotalUsd >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_USD;
        const totalUsd = subtotalUsd + shippingUsd;
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ML-${new Date().getFullYear()}-${randomSuffix}`;

        const { rows: insertedOrders } = await client.query<{
          id: number;
          order_number: string;
          status: string;
          created_at: string;
        }>(
          `INSERT INTO orders (
            order_number, customer_name, customer_phone, customer_email,
            delivery_address, delivery_city, notes,
            subtotal_usd, shipping_usd, total_usd, status, channel
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'confirmed', $11)
          RETURNING id, order_number, status, created_at`,
          [
            orderNumber,
            body.customerName.trim(),
            body.customerPhone.trim(),
            body.customerEmail?.trim() || null,
            body.deliveryAddress.trim(),
            body.deliveryCity?.trim() || null,
            body.notes?.trim() || null,
            subtotalUsd,
            shippingUsd,
            totalUsd,
            channel,
          ]
        );

        const orderRecord = insertedOrders[0];

        for (const line of resolvedItems) {
          await client.query(
            `INSERT INTO order_items (
              order_id, product_id, product_sku, product_name,
              size, quantity, unit_price_usd, line_total_usd
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              orderRecord.id,
              line.productId,
              line.sku,
              line.name,
              line.size,
              line.quantity,
              line.unitPriceUsd,
              line.lineTotalUsd,
            ]
          );
        }

        await client.query('COMMIT');

        return res.status(201).json({
          orderNumber: orderRecord.order_number,
          status: orderRecord.status,
          subtotalUsd,
          shippingUsd,
          totalUsd,
          items: resolvedItems,
          createdAt: orderRecord.created_at,
        });
      } catch (txError) {
        await client.query('ROLLBACK');
        throw txError;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      return res.status(500).json({
        error: 'No pudimos registrar el pedido en la base de datos. Intenta de nuevo.',
      });
    }
  });

  app.get('/api/orders/:orderNumber', async (req: Request, res: Response) => {
    const orderNumber = String(req.params.orderNumber || '').trim().toUpperCase();
    if (!orderNumber) {
      return res.status(400).json({ error: 'Número de orden requerido.' });
    }

    try {
      await ensureDatabaseSchema();
      const pool = getPool();
      const { rows: orderRows } = await pool.query(
        `SELECT id, order_number, customer_name, delivery_address, delivery_city,
                subtotal_usd, shipping_usd, total_usd, status, channel, created_at
         FROM orders
         WHERE order_number = $1`,
        [orderNumber]
      );

      if (orderRows.length === 0) {
        return res.status(404).json({ error: 'No encontramos una orden con ese código.' });
      }

      const order = orderRows[0];
      const { rows: itemRows } = await pool.query(
        `SELECT product_id, product_sku, product_name, size, quantity, unit_price_usd, line_total_usd
         FROM order_items
         WHERE order_id = $1
         ORDER BY id ASC`,
        [order.id]
      );

      return res.json({
        order: {
          orderNumber: order.order_number,
          customerName: order.customer_name,
          deliveryAddress: order.delivery_address,
          deliveryCity: order.delivery_city,
          subtotalUsd: order.subtotal_usd,
          shippingUsd: order.shipping_usd,
          totalUsd: order.total_usd,
          status: order.status,
          channel: order.channel,
          createdAt: order.created_at,
          items: itemRows,
        },
      });
    } catch (error) {
      console.error('Failed to retrieve order:', error);
      return res.status(500).json({ error: 'Error al consultar la orden.' });
    }
  });

  app.post('/api/inquiries', async (req: Request, res: Response) => {
    const body = req.body as Partial<InquiryPayload>;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !body ||
      typeof body.name !== 'string' ||
      body.name.trim().length < 2 ||
      typeof body.email !== 'string' ||
      !emailPattern.test(body.email.trim()) ||
      typeof body.message !== 'string' ||
      body.message.trim().length < 10
    ) {
      return res.status(400).json({
        error: 'Verifica tu nombre, correo electrónico y mensaje antes de enviar.',
      });
    }

    try {
      await ensureDatabaseSchema();
      const pool = getPool();
      const { rows } = await pool.query<{ id: number; status: string; created_at: string }>(
        `INSERT INTO contact_inquiries (
          customer_name, customer_email, customer_phone, inquiry_type, garment_name, message
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, status, created_at`,
        [
          body.name.trim(),
          body.email.trim(),
          body.phone?.trim() || null,
          body.inquiryType?.trim() || 'Consulta general',
          body.garment?.trim() || 'Colección general',
          body.message.trim(),
        ]
      );

      return res.status(201).json({
        inquiryId: rows[0].id,
        status: rows[0].status,
        createdAt: rows[0].created_at,
      });
    } catch (error) {
      console.error('Failed to save inquiry:', error);
      return res.status(500).json({
        error: 'No pudimos guardar tu consulta en este momento. Intenta nuevamente.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Monte & Lino server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
