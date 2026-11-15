import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import {
  PRODUCTS_DATA,
  STORE_EMAIL,
  STORE_PHONE_DISPLAY,
  buildWhatsAppUrl,
} from '../data/storeData';

interface FormState {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  garment: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const INQUIRY_TYPES = [
  'Asesoría de talla personalizada',
  'Consulta sobre pedido o envío',
  'Compra corporativa o al por mayor',
  'Cambios y devoluciones',
];

export function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    inquiryType: INQUIRY_TYPES[0],
    garment: PRODUCTS_DATA[0].name,
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<(FormState & { inquiryId: number }) | null>(
    null
  );
  const [copiedEmail, setCopiedEmail] = useState(false);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Ingresa tu nombre completo.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (form.message.trim().length < 10) {
      nextErrors.message =
        'Cuéntanos tu consulta o tus medidas aproximadas (mínimo 10 caracteres).';
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          inquiryType: form.inquiryType,
          garment: form.garment,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.error || 'No pudimos registrar tu consulta.');
        return;
      }

      setSubmittedRecord({ ...form, inquiryId: data.inquiryId });
    } catch {
      setSubmitError('Error de conexión al enviar tu mensaje. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(STORE_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      setCopiedEmail(false);
    }
  };

  const buildPersonalizedWhatsApp = (data: FormState) => {
    const text = `Hola Monte & Lino, soy ${data.name || 'un cliente'}. Motivo: ${
      data.inquiryType
    } sobre "${data.garment}". ${data.message ? `Detalle: ${data.message}` : ''}`;
    return buildWhatsAppUrl(text);
  };

  return (
    <section id="contacto" className="scroll-mt-20 py-20 md:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Direct Channels */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-[#52525B] tracking-wide mb-3">
              Atención al cliente · Taller y showroom
            </p>
            <h2 className="font-display font-bold tracking-[-0.025em] leading-[1.12] text-[#111113] text-3xl md:text-4xl">
              ¿Dudas con tu talla, envíos o pedidos especiales?
            </h2>
            <p className="mt-4 text-base leading-[1.68] text-[#52525B] max-w-[52ch]">
              Nuestro equipo de taller te responde directamente para ayudarte a elegir la talla
              ideal, coordinar envíos internacionales o gestionar pedidos corporativos.
            </p>

            <div className="mt-10 space-y-4">
              <div className="p-5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#52525B]">Correo de atención</p>
                    <a
                      href={`mailto:${STORE_EMAIL}`}
                      className="text-sm font-semibold text-[#111113] hover:text-[#1D4ED8] transition-colors truncate block"
                    >
                      {STORE_EMAIL}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-medium text-[#111113] bg-white border border-[#E4E4E7] hover:bg-[#F4F4F5] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 bg-[#111113] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#18181B] border border-zinc-800 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Asesoría inmediata por WhatsApp</p>
                    <p className="font-mono tabular-nums text-sm font-medium text-white">
                      {STORE_PHONE_DISPLAY}
                    </p>
                  </div>
                </div>

                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 text-xs font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Abrir chat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Validated Form */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-9 bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl">
              {submittedRecord ? (
                <div role="status" aria-live="polite" className="py-4 space-y-6">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2
                      className="w-6 h-6 text-[#1D4ED8] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-mono text-xs text-[#1D4ED8] font-medium">
                        Ticket #{submittedRecord.inquiryId}
                      </p>
                      <h3 className="font-display text-2xl font-bold text-[#111113] mt-1">
                        Mensaje enviado al equipo de Monte &amp; Lino
                      </h3>
                      <p className="mt-2 text-sm md:text-base text-[#52525B]">
                        Gracias,{' '}
                        <span className="font-semibold text-[#111113]">{submittedRecord.name}</span>
                        . Te responderemos a{' '}
                        <span className="font-mono text-xs text-[#111113]">
                          {submittedRecord.email}
                        </span>{' '}
                        con las recomendaciones para{' '}
                        <span className="font-medium text-[#111113]">
                          {submittedRecord.garment}
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={buildPersonalizedWhatsApp(submittedRecord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Continuar por WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedRecord(null);
                        setForm((prev) => ({ ...prev, message: '' }));
                      }}
                      className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-medium text-[#111113] bg-white border border-[#E4E4E7] hover:bg-[#F4F4F5] rounded-lg transition-colors"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-[#111113] mb-2"
                      >
                        Nombre completo *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'error-name' : undefined}
                        placeholder="Ej. Laura Gómez"
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#111113] bg-white border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                      />
                      {errors.name && (
                        <p
                          id="error-name"
                          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-[#111113] mb-2"
                      >
                        Correo electrónico *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'error-email' : undefined}
                        placeholder="tu@correo.com"
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#111113] bg-white border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                      />
                      {errors.email && (
                        <p
                          id="error-email"
                          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-medium text-[#111113] mb-2"
                      >
                        WhatsApp o teléfono (opcional)
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+57 300 000 0000"
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#111113] bg-white border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-type"
                        className="block text-xs font-medium text-[#111113] mb-2"
                      >
                        Tipo de consulta
                      </label>
                      <select
                        id="contact-type"
                        name="inquiryType"
                        value={form.inquiryType}
                        onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#111113] bg-white border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                      >
                        {INQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-garment"
                      className="block text-xs font-medium text-[#111113] mb-2"
                    >
                      Prenda de interés
                    </label>
                    <select
                      id="contact-garment"
                      name="garment"
                      value={form.garment}
                      onChange={(e) => setForm({ ...form, garment: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#111113] bg-white border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
                    >
                      {PRODUCTS_DATA.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} — ${p.price} USD
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-[#111113] mb-2"
                    >
                      Tu mensaje o medidas aproximadas *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'error-message' : undefined}
                      placeholder="Ej. Mido 1.76 m, peso 72 kg y quiero saber si me conviene talla M o L en la sobrecamisa."
                      className="w-full px-3.5 py-2.5 text-sm text-[#111113] bg-white border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 resize-y"
                    />
                    {errors.message && (
                      <p
                        id="error-message"
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-700">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{submitError}</span>
                    </p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 disabled:opacity-65"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>Enviar consulta</span>
                        </>
                      )}
                    </button>

                    <a
                      href={buildPersonalizedWhatsApp(form)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#52525B] hover:text-[#111113] underline underline-offset-4 transition-colors"
                    >
                      Consultar directamente por WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
