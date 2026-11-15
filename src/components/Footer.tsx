import { ArrowUpRight } from 'lucide-react';
import { STORE_EMAIL, STORE_PHONE_DISPLAY, buildWhatsAppUrl } from '../data/storeData';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111113] text-zinc-300 border-t border-zinc-800">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          <div className="md:col-span-5">
            <a
              href="#inicio"
              className="font-display text-xl font-bold tracking-tight text-white inline-block"
            >
              Monte &amp; Lino
            </a>
            <p className="mt-3 text-sm leading-[1.65] text-zinc-400 max-w-sm">
              Vestuario contemporáneo confeccionado en lino belga, algodón orgánico y lana merino
              en lotes pequeños. Despachos desde Bogotá y Madrid.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-white tracking-wide mb-4">Tienda</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#nosotros" className="hover:text-white transition-colors">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#coleccion" className="hover:text-white transition-colors">
                  Colección de prendas
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white transition-colors">
                  Beneficios textiles
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">
                  Lookbook 2026
                </a>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-white transition-colors">
                  Opiniones de clientes
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-white tracking-wide mb-4">
              Atención y redes
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-white transition-colors">
                  {STORE_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors font-mono tabular-nums text-xs"
                >
                  <span>WhatsApp: {STORE_PHONE_DISPLAY}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
              >
                Instagram
              </a>
              <a
                href="https://www.pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
              >
                Pinterest
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {currentYear} Monte &amp; Lino Atelier S.A.S. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#contacto" className="hover:text-white transition-colors">
              Política de cambios y envíos
            </a>
            <span aria-hidden="true">·</span>
            <a href="#inicio" className="hover:text-white transition-colors">
              Volver arriba
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
