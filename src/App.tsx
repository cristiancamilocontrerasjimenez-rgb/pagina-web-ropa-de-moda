/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { AboutSection } from './components/AboutSection';
import { BenefitsSection } from './components/BenefitsSection';
import { CartDrawer, type CartEntry } from './components/CartDrawer';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductsSection } from './components/ProductsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { buildWhatsAppUrl, type GarmentSize, type ProductItem } from './data/storeData';

export default function App() {
  const [cartItems, setCartItems] = useState<CartEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: ProductItem, size: GarmentSize) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, size: GarmentSize, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, size: GarmentSize) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111113]">
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1D4ED8] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Ir al contenido principal
        </a>

        <Header cartCount={totalItems} onOpenCart={() => setIsCartOpen(true)} />

        <main id="contenido-principal" className="flex-1">
          <HeroSection />
          <AboutSection />
          <ProductsSection onAddToCart={handleAddToCart} />
          <BenefitsSection />
          <GallerySection />
          <TestimonialsSection />
          <ContactSection />
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => setCartItems([])}
        />

        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Asesoría de tallas por WhatsApp"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#111113] text-white border border-zinc-700 shadow-lg hover:bg-[#1D4ED8] hover:border-[#1D4ED8] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </MotionConfig>
  );
}
