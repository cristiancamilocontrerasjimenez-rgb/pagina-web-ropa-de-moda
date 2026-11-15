import { motion } from 'motion/react';
import { ABOUT_IMAGE } from '../data/storeData';
import { MediaFrame } from './MediaFrame';

export function AboutSection() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-20 py-20 md:py-28 bg-white border-b border-[#E4E4E7]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="h-full min-h-[300px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-[#E4E4E7]">
              <MediaFrame
                src={ABOUT_IMAGE.src}
                alt={ABOUT_IMAGE.alt}
                className="w-full h-full aspect-[4/3] lg:aspect-auto"
                fallbackTitle="Taller Textil Monte & Lino"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between py-1"
          >
            <div>
              <p className="text-xs font-medium text-[#52525B] tracking-wide mb-3">
                Sobre nosotros · Origen textil y confección ética
              </p>

              <h2 className="font-display font-bold tracking-[-0.025em] leading-[1.12] text-[#111113] text-3xl md:text-4xl max-w-2xl">
                Vestuario arquitectónico hecho en talleres propios, sin intermediarios.
              </h2>

              <p className="mt-6 text-base leading-[1.7] text-[#52525B] max-w-[65ch]">
                Monte &amp; Lino nació en 2021 con una convicción simple: la ropa cotidiana merece la
                misma precisión en tela, costura y caída que la sastrería clásica, sin precios
                inflados por cadenas de distribución.
              </p>

              <p className="mt-4 text-base leading-[1.7] text-[#52525B] max-w-[65ch]">
                Seleccionamos rollos de algodón orgánico, lino europeo y lana merino en origen y
                cortamos lotes numerados de máximo 150 unidades por referencia. Así evitamos
                desperdicios textiles y aseguramos acabados consistentes en cada puntada.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-mono tabular-nums text-lg font-medium text-[#111113]">
                  420 gsm
                </p>
                <p className="mt-1 text-sm text-[#52525B]">Densidad en sargas de algodón pesado</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-lg font-medium text-[#111113]">
                  12 puntadas
                </p>
                <p className="mt-1 text-sm text-[#52525B]">Por pulgada en costuras principales</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-lg font-medium text-[#111113]">
                  96%
                </p>
                <p className="mt-1 text-sm text-[#52525B]">Satisfacción de calce en primera entrega</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
