import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  buildWhatsAppUrl,
  type GarmentSize,
  type ProductItem,
} from '../data/storeData';
import { MediaFrame } from './MediaFrame';

export interface CartEntry {
  product: ProductItem;
  size: GarmentSize;
  quantity: number;
}

interface OrderConfirmation {
  orderNumber: string;
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    lineTotalUsd: number;
  }>;
}

interface LookupOrderResult {
  orderNumber: string;
  customerName: string;
  deliveryAddress: string;
  deliveryCity: string | null;
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  status: string;
  createdAt: string;
  items: Array<{
    product_name: string;
    size: string;
    quantity: number;
    line_total_usd: number;
  }>;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartEntry[];
  onUpdateQuantity: (productId: string, size: GarmentSize, delta: number) => void;
  onRemoveItem: (productId: string, size: GarmentSize) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [notes, setNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupResult, setLookupResult] = useState<LookupOrderResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 12;
  const total = subtotal + shippingCost;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const buildOrderWhatsAppLink = (orderRef?: OrderConfirmation) => {
    if (orderRef) {
      const lines = orderRef.items.map(
        (i) => `• ${i.quantity}x ${i.name} (Talla ${i.size}) — $${i.lineTotalUsd} USD`
      );
      return buildWhatsAppUrl(
        `Hola Monte & Lino, acabo de registrar mi pedido ${orderRef.orderNumber}:\n${lines.join(
          '\n'
        )}\nTotal: $${orderRef.totalUsd} USD\nDirección: ${orderRef.deliveryAddress}`
      );
    }

    const lines = items.map(
      (i) =>
        `• ${i.quantity}x ${i.product.name} (Talla ${i.size}) — $${i.product.price * i.quantity} USD`
    );
    const msg = `Hola Monte & Lino, quiero confirmar este pedido:\n${lines.join(
      '\n'
    )}\nSubtotal: $${subtotal} USD\nEnvío: ${
      shippingCost === 0 ? 'Gratis' : `$${shippingCost} USD`
    }\nTotal: $${total} USD${
      customerName ? `\nNombre: ${customerName}` : ''
    }${deliveryAddress ? `\nDirección: ${deliveryAddress}` : ''}`;
    return buildWhatsAppUrl(msg);
  };

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      customerName.trim().length < 2 ||
      customerPhone.trim().length < 6 ||
      deliveryAddress.trim().length < 6
    ) {
      setCheckoutError('Completa nombre, teléfono y dirección para generar la orden.');
      return;
    }

    setCheckoutError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          deliveryAddress: deliveryAddress.trim(),
          deliveryCity: deliveryCity.trim() || undefined,
          notes: notes.trim() || undefined,
          channel: 'web',
          items: items.map((entry) => ({
            productId: entry.product.id,
            size: entry.size,
            quantity: entry.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setCheckoutError(data.error || 'No pudimos completar el pedido.');
        return;
      }

      setConfirmation({
        orderNumber: data.orderNumber,
        subtotalUsd: data.subtotalUsd,
        shippingUsd: data.shippingUsd,
        totalUsd: data.totalUsd,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        items: data.items,
      });
      onClearCart();
    } catch {
      setCheckoutError('Error de conexión al registrar el pedido. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupOrder = async (e: FormEvent) => {
    e.preventDefault();
    const code = lookupCode.trim().toUpperCase();
    if (!code) return;

    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(code)}`);
      const data = await response.json();
      if (!response.ok) {
        setLookupError(data.error || 'No encontramos esa orden.');
        return;
      }
      setLookupResult(data.order);
    } catch {
      setLookupError('No fue posible consultar el pedido en este momento.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bolsa de compras"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#111113]/60 backdrop-blur-xs flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full border-l border-[#E4E4E7] flex flex-col justify-between overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E4E4E7] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#111113]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#111113]">
              Tu bolsa ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar bolsa de compras"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E4E4E7] text-[#111113] hover:bg-[#F4F4F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {confirmation ? (
            <div role="status" aria-live="polite" className="py-4 space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#1D4ED8] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-mono text-xs text-[#1D4ED8] font-medium">
                    Orden #{confirmation.orderNumber} confirmada
                  </p>
                  <h3 className="font-display text-xl font-bold text-[#111113] mt-1">
                    Pedido registrado correctamente
                  </h3>
                  <p className="mt-2 text-sm text-[#52525B]">
                    Enviaremos la guía de despacho a{' '}
                    <span className="font-medium text-[#111113]">{confirmation.customerPhone}</span>{' '}
                    para entrega en{' '}
                    <span className="font-medium text-[#111113]">
                      {confirmation.deliveryAddress}
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl space-y-2 text-xs">
                {confirmation.items.map((line, i) => (
                  <div key={`${line.name}-${line.size}-${i}`} className="flex justify-between gap-2">
                    <span className="text-[#111113]">
                      {line.quantity}x {line.name} ({line.size})
                    </span>
                    <span className="font-mono tabular-nums font-medium text-[#111113]">
                      ${line.lineTotalUsd} USD
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#E4E4E7] flex justify-between text-sm font-bold text-[#111113]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">${confirmation.totalUsd} USD</span>
                </div>
              </div>

              <a
                href={buildOrderWhatsAppLink(confirmation)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Enviar comprobante por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setConfirmation(null);
                  onClose();
                }}
                className="w-full min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#111113] bg-[#F4F4F5] hover:bg-[#E4E4E7] rounded-lg transition-colors"
              >
                Seguir explorando la colección
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 space-y-8">
              <div className="text-center space-y-3">
                <ShoppingBag
                  className="w-8 h-8 text-[#52525B] mx-auto"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="font-display text-lg font-bold text-[#111113]">
                  Tu bolsa está vacía
                </p>
                <p className="text-sm text-[#52525B] max-w-xs mx-auto">
                  Elige una prenda de la colección y selecciona tu talla para añadirla aquí.
                </p>
                <a
                  href="#coleccion"
                  onClick={onClose}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors mt-2"
                >
                  Ver colección
                </a>
              </div>

              {/* Order Status Lookup */}
              <div className="pt-6 border-t border-[#E4E4E7] space-y-3">
                <p className="text-xs font-semibold text-[#111113]">
                  ¿Ya hiciste un pedido? Consulta su estado
                </p>
                <form onSubmit={handleLookupOrder} className="flex gap-2">
                  <input
                    type="text"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value)}
                    placeholder="Código ej. ML-2026-1042"
                    aria-label="Código de orden"
                    className="flex-1 min-h-[42px] px-3 py-2 text-xs font-mono uppercase bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    aria-label="Buscar orden"
                    className="inline-flex items-center justify-center min-w-[42px] min-h-[42px] px-3 bg-[#111113] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-60"
                  >
                    {lookupLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </form>

                {lookupError && (
                  <p className="text-xs text-red-700 font-medium">{lookupError}</p>
                )}

                {lookupResult && (
                  <div className="p-4 bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-[#111113]">
                        #{lookupResult.orderNumber}
                      </span>
                      <span className="font-medium text-[#1D4ED8]">Confirmado</span>
                    </div>
                    <p className="text-[#52525B]">
                      Cliente: <span className="text-[#111113]">{lookupResult.customerName}</span>
                    </p>
                    <p className="text-[#52525B]">
                      Entrega: <span className="text-[#111113]">{lookupResult.deliveryAddress}</span>
                    </p>
                    <ul className="pt-2 border-t border-[#E4E4E7] space-y-1">
                      {lookupResult.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between text-[#111113]">
                          <span>
                            {it.quantity}x {it.product_name} ({it.size})
                          </span>
                          <span className="font-mono tabular-nums">${it.line_total_usd} USD</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-[#E4E4E7] flex justify-between font-bold text-[#111113]">
                      <span>Total</span>
                      <span className="font-mono tabular-nums">${lookupResult.totalUsd} USD</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl text-xs text-[#111113]">
                {remainingForFreeShipping === 0 ? (
                  <span>Tienes envío gratuito asegurado en este pedido.</span>
                ) : (
                  <span>
                    Te faltan{' '}
                    <span className="font-mono tabular-nums font-semibold text-[#1D4ED8]">
                      ${remainingForFreeShipping} USD
                    </span>{' '}
                    para envío nacional gratuito.
                  </span>
                )}
              </div>

              <ul className="divide-y divide-[#E4E4E7]">
                {items.map((entry) => (
                  <li
                    key={`${entry.product.id}-${entry.size}`}
                    className="py-4 flex items-start gap-4"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#E4E4E7] shrink-0">
                      <MediaFrame
                        src={entry.product.image}
                        alt={entry.product.name}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#111113] leading-snug">
                          {entry.product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(entry.product.id, entry.size)}
                          aria-label={`Eliminar ${entry.product.name} talla ${entry.size}`}
                          className="text-[#52525B] hover:text-red-700 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-xs text-[#52525B]">
                        Talla{' '}
                        <span className="font-mono font-medium text-[#111113]">{entry.size}</span>
                        <span aria-hidden="true"> · </span>
                        <span className="font-mono tabular-nums">${entry.product.price} USD</span>
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#E4E4E7] rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.product.id, entry.size, -1)}
                            aria-label="Reducir cantidad"
                            className="w-8 h-8 flex items-center justify-center text-[#111113] hover:bg-[#F4F4F5] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-mono tabular-nums text-xs font-medium text-[#111113]">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.product.id, entry.size, 1)}
                            aria-label="Aumentar cantidad"
                            className="w-8 h-8 flex items-center justify-center text-[#111113] hover:bg-[#F4F4F5] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono tabular-nums text-sm font-semibold text-[#111113]">
                          ${entry.product.price * entry.quantity} USD
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Checkout Form */}
              <form
                id="cart-checkout-form"
                onSubmit={handleCheckoutSubmit}
                className="pt-4 border-t border-[#E4E4E7] space-y-3"
              >
                <p className="text-xs font-semibold text-[#111113]">
                  Datos para envío o contraentrega
                </p>
                <input
                  type="text"
                  required
                  placeholder="Nombre completo *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp / Teléfono *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <input
                    type="email"
                    placeholder="Correo (opcional)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Dirección de entrega *"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Notas de entrega (ej. portería, horario)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8]"
                />
                {checkoutError && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{checkoutError}</span>
                  </p>
                )}
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && !confirmation && (
          <div className="px-6 py-5 border-t border-[#E4E4E7] bg-[#FAFAFA] space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#52525B]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal} USD</span>
              </div>
              <div className="flex justify-between text-[#52525B]">
                <span>Envío</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'Gratis' : `$${shippingCost} USD`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111113] pt-2 border-t border-[#E4E4E7]">
                <span>Total</span>
                <span className="font-mono tabular-nums">${total} USD</span>
              </div>
            </div>

            <button
              type="submit"
              form="cart-checkout-form"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors disabled:opacity-65"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Registrando pedido...</span>
                </>
              ) : (
                <span>Confirmar pedido (${total} USD)</span>
              )}
            </button>

            <a
              href={buildOrderWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-medium text-[#111113] bg-white border border-[#E4E4E7] hover:bg-[#F4F4F5] rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>Pedir por WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
