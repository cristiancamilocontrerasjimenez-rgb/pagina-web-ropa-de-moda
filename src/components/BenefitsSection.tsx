import { motion } from 'motion/react';
import { BENEFITS_DATA } from '../data/storeData';

export function BenefitsSection() {
  return (
    <section
      id="beneficios"
      className="scroll-mt-20 py-20 md:py-28 bg-[#111113] text-[#FAFAFA]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium text-zinc-400 tracking-wide mb-3">
              Por qué elegir Monte &amp; Lino · Garantía de prenda
            </p>
            <h2 className="font-display font-bold tracking-[-0.025em] leading-[1.12] text-white text-3xl md:text-4xl max-w-xl">
              Calidad textil verificable frente a la moda rápida convencional.
            </h2>
          </div>

          <div className="lg:col-span-6 flex items-end">
            <p className="text-base leading-[1.68] text-zinc-300 max-w-[60ch]">
              Diseñamos cada pieza para resistir años de uso real, manteniendo su caída original,
              transpirabilidad natural y respaldo directo de taller ante cualquier ajuste.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFITS_DATA.map((benefit, idx) => (
            <motion.div
              key={benefit.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-7 md:p-9 bg-[#18181B] border border-zinc-800 rounded-2xl flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="font-mono tabular-nums text-sm font-medium text-[#60A5FA]">
                    {benefit.index}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">
                    {benefit.benchmark}
                  </span>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm md:text-base leading-[1.68] text-zinc-300">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
