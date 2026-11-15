import { getPool } from './pool.ts';

export const SEED_PRODUCTS = [
  {
    id: 'sobrecamisa-grafito',
    sku: 'ML-OB-01',
    category: 'Abrigos y Chaquetas',
    name: 'Sobrecamisa Estructurada Grafito',
    fabric: 'Sarga de algodón orgánico 420 gsm',
    price_usd: 145,
    summary:
      'Corte recto con doble bolsillo frontal con solapa, botones de corozo teñidos al tono y costuras reforzadas.',
    details: [
      '100% algodón orgánico peinado de alto gramaje',
      'Botones naturales de tagua (corozo)',
      'Lavado enzimático previo para evitar encogimiento',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock_note: 'Disponible',
  },
  {
    id: 'sueter-merino-cobalto',
    sku: 'ML-TP-04',
    category: 'Tejido de Punto',
    name: 'Suéter Cuello Redondo Cobalto',
    fabric: 'Lana merino extrafina 19.5 micras',
    price_usd: 118,
    summary:
      'Tejido en galga fina sin costuras laterales para una caída limpia, térmica y respirable durante todo el año.',
    details: [
      '100% lana merino certificada sin tratamiento acrílico',
      'Puños y pretina en canalé elástico de alta recuperación',
      'Tacto suave apto para uso directo sobre la piel',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock_note: 'Edición limitada',
  },
  {
    id: 'pantalon-pliegues-arena',
    sku: 'ML-PT-02',
    category: 'Pantalones',
    name: 'Pantalón Sastre Pinza Arena',
    fabric: 'Lino belga y algodón 310 gsm',
    price_usd: 128,
    summary:
      'Tiro medio-alto con doble pinza frontal, caída amplia y cintura interna forrada en popelina de algodón.',
    details: [
      '65% lino europeo / 35% algodón orgánico de fibra larga',
      'Cremallera metálica YKK Excella y botón oculto',
      'Bolsillos traseros ribeteados con presilla reforzada',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock_note: 'Disponible',
  },
  {
    id: 'abrigo-urbano-obsidiana',
    sku: 'ML-AB-07',
    category: 'Abrigos y Chaquetas',
    name: 'Abrigo Largo Sastrería Obsidiana',
    fabric: 'Paño de lana virgen 580 gsm',
    price_usd: 215,
    summary:
      'Silueta arquitectónica con solapa limpia, forro completo en cupro respirable y bolsillos interiores con cierre.',
    details: [
      '100% paño de lana virgen italiana con acabado cepillado',
      'Forro interior en cupro Bemberg antiestático',
      'Hombro natural ligeramente caído para superponer capas',
    ],
    sizes: ['S', 'M', 'L'],
    stock_note: 'Últimas unidades',
  },
  {
    id: 'gabardina-pizarra-taller',
    sku: 'ML-AB-09',
    category: 'Abrigos y Chaquetas',
    name: 'Gabardina Amplia Pizarra',
    fabric: 'Gabardina de algodón repelente al agua',
    price_usd: 195,
    summary:
      'Abrigo cruzado de corte amplio pensado para lluvia ligera y entretiempo, con puños ajustables y caída fluida.',
    details: [
      'Tejido de doble torsión resistente al viento y llovizna',
      'Cinturón desmontable y abertura trasera abotonada',
      'Confección artesanal en lotes numerados',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock_note: 'Disponible',
  },
  {
    id: 'sueter-tejido-crudo',
    sku: 'ML-TP-08',
    category: 'Tejido de Punto',
    name: 'Suéter Acanalado Algodón Crudo',
    fabric: 'Algodón orgánico hilado grueso',
    price_usd: 108,
    summary:
      'Punto inglés con textura marcada y volumen equilibrado, ideal como capa principal en días frescos.',
    details: [
      '100% algodón orgánico sin blanqueadores ópticos',
      'Hombro montado con remallado a mano en cuello',
      'Mantiene su estructura tras múltiples lavados',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock_note: 'Disponible',
  },
];

let schemaInitPromise: Promise<void> | null = null;

export async function ensureDatabaseSchema(): Promise<void> {
  if (schemaInitPromise) return schemaInitPromise;

  schemaInitPromise = (async () => {
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        sku TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        fabric TEXT NOT NULL,
        price_usd INTEGER NOT NULL,
        summary TEXT NOT NULL,
        details JSONB NOT NULL,
        sizes JSONB NOT NULL,
        stock_note TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        delivery_address TEXT NOT NULL,
        delivery_city TEXT,
        notes TEXT,
        subtotal_usd INTEGER NOT NULL,
        shipping_usd INTEGER NOT NULL,
        total_usd INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'confirmed',
        channel TEXT NOT NULL DEFAULT 'web',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL REFERENCES products(id),
        product_sku TEXT NOT NULL,
        product_name TEXT NOT NULL,
        size TEXT NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        unit_price_usd INTEGER NOT NULL,
        line_total_usd INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        inquiry_type TEXT NOT NULL,
        garment_name TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    for (const product of SEED_PRODUCTS) {
      await pool.query(
        `
        INSERT INTO products (id, sku, category, name, fabric, price_usd, summary, details, sizes, stock_note)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10)
        ON CONFLICT (id) DO UPDATE SET
          sku = EXCLUDED.sku,
          category = EXCLUDED.category,
          name = EXCLUDED.name,
          fabric = EXCLUDED.fabric,
          price_usd = EXCLUDED.price_usd,
          summary = EXCLUDED.summary,
          details = EXCLUDED.details,
          sizes = EXCLUDED.sizes,
          stock_note = EXCLUDED.stock_note
        `,
        [
          product.id,
          product.sku,
          product.category,
          product.name,
          product.fabric,
          product.price_usd,
          product.summary,
          JSON.stringify(product.details),
          JSON.stringify(product.sizes),
          product.stock_note,
        ]
      );
    }
  })().catch((err) => {
    schemaInitPromise = null;
    throw err;
  });

  return schemaInitPromise;
}

// Allow direct CLI execution: `npx tsx src/db/init.ts`
const isDirectRun = process.argv[1]?.endsWith('init.ts');
if (isDirectRun) {
  ensureDatabaseSchema()
    .then(async () => {
      const pool = getPool();
      const { rows } = await pool.query('SELECT count(*)::int AS total FROM products');
      console.log(`Neon PostgreSQL schema ready. Seeded products: ${rows[0].total}`);
      await pool.end();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to initialize Neon PostgreSQL schema:', error);
      process.exit(1);
    });
}
