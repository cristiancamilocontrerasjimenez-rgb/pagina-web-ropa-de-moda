import { motion } from 'motion/react';
import { TESTIMONIALS_DATA } from '../data/storeData';

export function TestimonialsSection() {
  return (
    <section
      id="testimonios"
      className="scroll-mt-20 py-20 md:py-28 bg-[#FAFAFA] border-b border-[#E4E4E7]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-medium text-[#52525B] tracking-wide mb-3">
              Opiniones verificadas · Experiencia de uso
            </p>
            <h2 className="font-display font-bold tracking-[-0.025em] leading-[1.12] text-[#111113] text-3xl md:text-4xl max-w-2xl">
              Clientes que visten nuestras prendas semana tras semana.
            </h2>
          </div>
          <p className="text-sm text-[#52525B] max-w-sm">
            Reseñas de compradores reales con referencia de talla, tejido y experiencia de despacho.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="p-7 md:p-8 bg-white border border-[#E4E4E7] rounded-2xl flex flex-col justify-between gap-6"
            >
              <div>
                <blockquote className="text-base leading-[1.68] text-[#111113] font-medium">
                  “{item.quote}”
                </blockquote>

                <div className="mt-6 pt-5 border-t border-[#E4E4E7] space-y-2 text-xs">
                  <div>
                    <span className="text-[#52525B]">Prenda: </span>
                    <span className="text-[#111113] font-medium">{item.garment}</span>
                  </div>
                  <div>
                    <span className="text-[#52525B]">Asesoría: </span>
                    <span className="text-[#111113]">{item.fitNote}</span>
                  </div>
                  <div>
                    <span className="text-[#52525B]">Resultado: </span>
                    <span className="font-semibold text-[#1D4ED8]">{item.outcome}</span>
                  </div>
                </div>
              </div>

              <footer className="pt-4 border-t border-[#E4E4E7]">
                <p className="text-sm font-semibold text-[#111113]">{item.author}</p>
                <p className="text-xs text-[#52525B]">Cliente verificado · {item.city}</p>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
