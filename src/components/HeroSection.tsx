import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_IMAGE, STORE_METRICS, buildWhatsAppUrl } from '../data/storeData';
import { MediaFrame } from './MediaFrame';

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="pt-10 pb-16 md:pt-14 md:pb-24 border-b border-[#E4E4E7] bg-[#FAFAFA]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between py-2"
          >
            <div>
              <p className="text-xs font-medium text-[#52525B] tracking-wide mb-5">
                Colección Otoño / Invierno 2026 · Confección en fibras naturales
              </p>

              <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.05] text-[#111113] text-[clamp(2.35rem,4.5vw,3.85rem)] max-w-2xl">
                Prendas esenciales diseñadas para durar más allá de la temporada.
              </h1>

              <p className="mt-6 text-base md:text-lg leading-[1.65] text-[#52525B] max-w-[58ch]">
                Abrigos estructurados, tejidos en lana merino y pantalones en lino belga producidos
                en lotes numerados con ajuste preciso y envío asegurado.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#coleccion"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <span>Explorar colección</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 text-sm font-medium text-[#111113] bg-white border border-[#E4E4E7] hover:bg-[#F4F4F5] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <MessageCircle className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
                <span>Asesoría por WhatsApp</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="h-full min-h-[280px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#E4E4E7]">
              <MediaFrame
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                eager
                className="w-full h-full aspect-[16/10] lg:aspect-auto"
                fallbackTitle="Monte & Lino — Colección 2026"
              />
            </div>
          </motion.div>
        </div>

        {/* Full-width 4-column retail trust & logistics strip */}
        <div className="mt-14 pt-10 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STORE_METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1.5">
              <span className="font-mono tabular-nums text-3xl md:text-[2.15rem] font-medium tracking-tight text-[#111113]">
                {metric.value}
              </span>
              <span className="text-sm font-semibold text-[#111113]">{metric.label}</span>
              <span className="text-xs text-[#52525B]">{metric.context}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
