import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { motion } from 'motion/react';
import { LOOKBOOK_DATA, type GalleryCategory, type LookbookItem } from '../data/storeData';
import { MediaFrame } from './MediaFrame';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Todos',
  'Colección Otoño',
  'Sastrería Urbana',
  'Atelier',
];

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('Todos');
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);

  const filteredItems =
    activeCategory === 'Todos'
      ? LOOKBOOK_DATA
      : LOOKBOOK_DATA.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
        return;
      }
      const currentIdx = filteredItems.findIndex((i) => i.id === selectedItem.id);
      if (currentIdx === -1) return;

      if (event.key === 'ArrowRight') {
        setSelectedItem(filteredItems[(currentIdx + 1) % filteredItems.length]);
      } else if (event.key === 'ArrowLeft') {
        setSelectedItem(
          filteredItems[(currentIdx - 1 + filteredItems.length) % filteredItems.length]
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, filteredItems]);

  const navigateModal = (direction: 'prev' | 'next') => {
    if (!selectedItem) return;
    const currentIdx = filteredItems.findIndex((i) => i.id === selectedItem.id);
    if (currentIdx === -1) return;
    const nextIdx =
      direction === 'next'
        ? (currentIdx + 1) % filteredItems.length
        : (currentIdx - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[nextIdx]);
  };

  return (
    <section
      id="galeria"
      className="scroll-mt-20 py-20 md:py-28 bg-white border-b border-[#E4E4E7]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <p className="text-xs font-medium text-[#52525B] tracking-wide mb-3">
              Galería y Lookbook · Estilismo en uso real
            </p>
            <h2 className="font-display font-bold tracking-[-0.025em] leading-[1.12] text-[#111113] text-3xl md:text-4xl max-w-2xl">
              Combinaciones pensadas para el ritmo urbano y de estudio.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar lookbook por serie"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F4F4F5] border border-[#E4E4E7] rounded-lg self-start lg:self-auto"
          >
            {GALLERY_CATEGORIES.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                    isSelected
                      ? 'bg-white text-[#111113] border border-[#E4E4E7]'
                      : 'text-[#52525B] hover:text-[#111113]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {filteredItems.map((item, idx) => {
            const gridSpan =
              activeCategory === 'Todos' ? item.aspectClass : 'md:col-span-6';
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`${gridSpan} group flex flex-col bg-[#FAFAFA] border border-[#E4E4E7] rounded-2xl overflow-hidden`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  aria-label={`Ampliar fotografía ${item.title}`}
                  className="relative aspect-[4/3] w-full overflow-hidden border-b border-[#E4E4E7] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                >
                  <MediaFrame
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full"
                    imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                    fallbackTitle={item.title}
                  />
                  <span className="absolute bottom-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#111113]/85 text-white opacity-90 group-hover:opacity-100 transition-opacity duration-150">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>

                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#52525B]">
                    <span>{item.collection}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.year}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold tracking-tight text-[#111113]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-[1.6] text-[#52525B]">{item.summary}</p>

                  <p className="mt-2 pt-3 border-t border-[#E4E4E7] text-xs font-medium text-[#1D4ED8]">
                    Prendas destacadas: {item.garments}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Lookbook Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lookbook-modal-title"
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-[#111113]/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2 text-xs text-[#52525B] truncate">
                <span className="font-semibold text-[#111113]">{selectedItem.collection}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedItem.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{selectedItem.year}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigateModal('prev')}
                  aria-label="Look anterior"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E4E4E7] text-[#111113] hover:bg-[#F4F4F5] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateModal('next')}
                  aria-label="Siguiente look"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E4E4E7] text-[#111113] hover:bg-[#F4F4F5] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  aria-label="Cerrar lookbook"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#111113] text-white hover:bg-[#1D4ED8] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="aspect-[16/10] w-full bg-[#F4F4F5] border-b border-[#E4E4E7]">
              <MediaFrame
                src={selectedItem.image}
                alt={selectedItem.imageAlt}
                className="w-full h-full"
                fallbackTitle={selectedItem.title}
              />
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3
                  id="lookbook-modal-title"
                  className="font-display text-2xl font-bold tracking-tight text-[#111113]"
                >
                  {selectedItem.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-[#52525B] max-w-2xl">
                  {selectedItem.summary}
                </p>
              </div>
              <a
                href="#coleccion"
                onClick={() => setSelectedItem(null)}
                className="shrink-0 inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors"
              >
                Ver prendas en tienda
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
