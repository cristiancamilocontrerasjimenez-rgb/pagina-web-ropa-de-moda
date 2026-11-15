import { useEffect, useState } from 'react';
import { Check, Eye, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  PRODUCTS_DATA,
  buildWhatsAppUrl,
  type GarmentSize,
  type ProductCategory,
  type ProductItem,
} from '../data/storeData';
import { MediaFrame } from './MediaFrame';

interface ProductsSectionProps {
  onAddToCart: (product: ProductItem, size: GarmentSize) => void;
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Todos',
  'Abrigos y Chaquetas',
  'Tejido de Punto',
  'Pantalones',
];

export function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const [catalog, setCatalog] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, GarmentSize>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !Array.isArray(data.products) || cancelled) return;
        const dbMap = new Map<string, any>(data.products.map((p: any) => [p.id, p]));
        setCatalog(
          PRODUCTS_DATA.map((localItem) => {
            const remote = dbMap.get(localItem.id);
            if (!remote) return localItem;
            return {
              ...localItem,
              name: remote.name ?? localItem.name,
              fabric: remote.fabric ?? localItem.fabric,
              price: typeof remote.price_usd === 'number' ? remote.price_usd : localItem.price,
              summary: remote.summary ?? localItem.summary,
              details: Array.isArray(remote.details) ? remote.details : localItem.details,
              sizes: Array.isArray(remote.sizes) ? remote.sizes : localItem.sizes,
              stockNote: remote.stock_note ?? localItem.stockNote,
            };
          })
        );
      })
      .catch(() => {
        // Keep local catalog fallback if offline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!detailProduct) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailProduct(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailProduct]);

  const filteredProducts = catalog.filter((product) => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.fabric.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const getSizeFor = (product: ProductItem): GarmentSize => {
    return selectedSizes[product.id] || product.sizes[1] || product.sizes[0];
  };

  const handleAdd = (product: ProductItem) => {
    const size = getSizeFor(product);
    onAddToCart(product, size);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  return (
    <section
      id="coleccion"
      className="scroll-mt-20 py-20 md:py-28 bg-[#FAFAFA] border-b border-[#E4E4E7]"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header & Filter Controls */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium text-[#52525B] tracking-wide mb-3">
                Colección permanente · Precios transparentes
              </p>
              <h2 className="font-display font-bold tracking-[-0.025em] leading-[1.12] text-[#111113] text-3xl md:text-4xl max-w-2xl">
                Prendas esenciales confeccionadas en lotes pequeños.
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search
                className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar prenda o material"
                placeholder="Buscar prenda o tejido..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm text-[#111113] bg-white border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
              />
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar prendas por categoría"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F4F4F5] border border-[#E4E4E7] rounded-lg self-start"
          >
            {PRODUCT_CATEGORIES.map((category) => {
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

        {/* 3-Column Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 px-6 bg-white border border-[#E4E4E7] rounded-2xl text-center">
            <p className="font-display text-xl font-bold text-[#111113]">
              No encontramos prendas con “{searchQuery}”
            </p>
            <p className="mt-2 text-sm text-[#52525B]">
              Prueba otra categoría o limpia el filtro de búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('Todos');
              }}
              className="mt-5 inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors"
            >
              Ver toda la colección
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product, idx) => {
              const currentSize = getSizeFor(product);
              const isAdded = recentlyAddedId === product.id;

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col justify-between bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-[#F4F4F5] border-b border-[#E4E4E7] overflow-hidden">
                      <MediaFrame
                        src={product.image}
                        alt={product.imageAlt}
                        className="w-full h-full"
                        imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                        fallbackTitle={product.name}
                      />

                      <button
                        type="button"
                        onClick={() => setDetailProduct(product)}
                        aria-label={`Ver ficha técnica de ${product.name}`}
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-medium bg-white/95 text-[#111113] border border-[#E4E4E7] rounded-lg hover:bg-[#111113] hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Detalle</span>
                      </button>
                    </div>

                    <div className="p-6">
                      {/* Clean unboxed metadata */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] mb-2">
                        <span className="truncate">{product.category}</span>
                        <span className="shrink-0 font-medium text-[#111113]">
                          {product.stockNote}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-lg font-bold tracking-tight text-[#111113]">
                          {product.name}
                        </h3>
                        <span className="font-mono tabular-nums text-[15px] font-semibold text-[#111113] whitespace-nowrap shrink-0">
                          ${product.price} USD
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs font-medium text-[#52525B]">{product.fabric}</p>

                      <p className="mt-3 text-sm leading-[1.6] text-[#52525B]">
                        {product.summary}
                      </p>
                    </div>
                  </div>

                  {/* Size Selector & Add to Cart */}
                  <div className="px-6 pb-6 pt-2 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#52525B]">Talla:</span>
                      <div className="flex items-center gap-1.5" role="group" aria-label={`Talla para ${product.name}`}>
                        {product.sizes.map((size) => {
                          const active = currentSize === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))
                              }
                              aria-pressed={active}
                              className={`min-w-[36px] min-h-[36px] px-2 text-xs font-mono font-medium rounded-md border transition-colors ${
                                active
                                  ? 'bg-[#111113] text-white border-[#111113]'
                                  : 'bg-[#FAFAFA] text-[#111113] border-[#E4E4E7] hover:border-[#111113]'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className={`w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        isAdded
                          ? 'bg-[#111113] text-white'
                          : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>Agregado · Talla {currentSize}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                          <span>Agregar a la bolsa</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal (PDP) */}
      {detailProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-title"
          onClick={() => setDetailProduct(null)}
          className="fixed inset-0 z-50 bg-[#111113]/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
          >
            <div className="md:col-span-6 aspect-[4/3] md:aspect-auto bg-[#F4F4F5] border-b md:border-b-0 md:border-r border-[#E4E4E7]">
              <MediaFrame
                src={detailProduct.image}
                alt={detailProduct.imageAlt}
                className="w-full h-full"
                fallbackTitle={detailProduct.name}
              />
            </div>

            <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#52525B]">
                    {detailProduct.category} · <span className="font-mono">{detailProduct.sku}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetailProduct(null)}
                    aria-label="Cerrar ficha de producto"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#E4E4E7] text-[#111113] hover:bg-[#F4F4F5]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3
                  id="pdp-title"
                  className="mt-3 font-display text-2xl font-bold text-[#111113]"
                >
                  {detailProduct.name}
                </h3>

                <p className="mt-2 font-mono tabular-nums text-xl font-semibold text-[#1D4ED8]">
                  ${detailProduct.price} USD
                </p>

                <p className="mt-3 text-sm leading-[1.65] text-[#52525B]">
                  {detailProduct.summary}
                </p>

                <ul className="mt-5 pt-4 border-t border-[#E4E4E7] space-y-2">
                  {detailProduct.details.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-xs text-[#111113]">
                      <Check className="w-3.5 h-3.5 mt-0.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E4E4E7]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#111113]">Elige tu talla</span>
                  <div className="flex items-center gap-1.5">
                    {detailProduct.sizes.map((size) => {
                      const active = getSizeFor(detailProduct) === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSizes((prev) => ({ ...prev, [detailProduct.id]: size }))
                          }
                          className={`min-w-[38px] min-h-[38px] text-xs font-mono font-medium rounded-md border transition-colors ${
                            active
                              ? 'bg-[#111113] text-white border-[#111113]'
                              : 'bg-white text-[#111113] border-[#E4E4E7] hover:border-[#111113]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleAdd(detailProduct);
                    setDetailProduct(null);
                  }}
                  className="w-full min-h-[46px] px-5 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors"
                >
                  Agregar talla {getSizeFor(detailProduct)} a la bolsa — ${detailProduct.price} USD
                </button>

                <a
                  href={buildWhatsAppUrl(
                    `Hola Monte & Lino, necesito asesoría de talla para "${detailProduct.name}" (${detailProduct.sku}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 text-xs font-medium text-[#111113] bg-[#F4F4F5] hover:bg-[#E4E4E7] rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Consultar medidas por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
