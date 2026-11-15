import heroEditorialImg from '../assets/images/fashion_hero_editorial_1794763609753.jpg';
import atelierCraftImg from '../assets/images/fashion_atelier_craft_1794763610641.jpg';
import jacketProductImg from '../assets/images/fashion_product_jacket_1794763610029.jpg';
import knitwearProductImg from '../assets/images/fashion_product_knitwear_1794763610404.jpg';
import trousersProductImg from '../assets/images/fashion_product_trousers_1794763610736.jpg';
import lookbookStreetImg from '../assets/images/fashion_lookbook_street_1794763611662.jpg';

export type ProductCategory = 'Todos' | 'Abrigos y Chaquetas' | 'Tejido de Punto' | 'Pantalones';
export type GalleryCategory = 'Todos' | 'Colección Otoño' | 'Sastrería Urbana' | 'Atelier';
export type GarmentSize = 'S' | 'M' | 'L' | 'XL';

export interface StoreMetric {
  value: string;
  label: string;
  context: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  category: Exclude<ProductCategory, 'Todos'>;
  name: string;
  fabric: string;
  price: number;
  summary: string;
  details: string[];
  sizes: GarmentSize[];
  stockNote: string;
  image: string;
  imageAlt: string;
}

export interface BenefitItem {
  index: string;
  title: string;
  description: string;
  benchmark: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  collection: string;
  year: string;
  category: Exclude<GalleryCategory, 'Todos'>;
  summary: string;
  garments: string;
  image: string;
  imageAlt: string;
  aspectClass: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  city: string;
  garment: string;
  fitNote: string;
  outcome: string;
}

export const WHATSAPP_NUMBER = '573104829150';
export const STORE_EMAIL = 'hola@monteylino.com';
export const STORE_PHONE_DISPLAY = '+57 310 482 9150';
export const FREE_SHIPPING_THRESHOLD = 180;

export const HERO_IMAGE = {
  src: heroEditorialImg,
  alt: 'Editorial de temporada Monte & Lino con abrigo en lana pizarra, tejido crudo y pantalón sastre',
};

export const ABOUT_IMAGE = {
  src: atelierCraftImg,
  alt: 'Mesa de taller textil Monte & Lino con rollos de lino natural, mezclilla japonesa y patrones en papel',
};

export const STORE_METRICS: StoreMetric[] = [
  {
    value: '100%',
    label: 'Fibras naturales certificadas',
    context: 'Lino belga, lana merino y algodón orgánico',
  },
  {
    value: '24–48 h',
    label: 'Despacho nacional asegurado',
    context: 'Envío gratis desde $180 USD',
  },
  {
    value: '30 días',
    label: 'Cambios de talla sin costo',
    context: 'Recolección directa en tu domicilio',
  },
  {
    value: '150 u.',
    label: 'Lotes numerados por prenda',
    context: 'Sin sobreproducción ni saldos masivos',
  },
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'sobrecamisa-grafito',
    sku: 'ML-OB-01',
    category: 'Abrigos y Chaquetas',
    name: 'Sobrecamisa Estructurada Grafito',
    fabric: 'Sarga de algodón orgánico 420 gsm',
    price: 145,
    summary:
      'Corte recto con doble bolsillo frontal con solapa, botones de corozo teñidos al tono y costuras reforzadas.',
    details: [
      '100% algodón orgánico peinado de alto gramaje',
      'Botones naturales de tagua (corozo)',
      'Lavado enzimático previo para evitar encogimiento',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stockNote: 'Disponible',
    image: jacketProductImg,
    imageAlt: 'Sobrecamisa estructurada en sarga de algodón color grafito sobre fondo neutro',
  },
  {
    id: 'sueter-merino-cobalto',
    sku: 'ML-TP-04',
    category: 'Tejido de Punto',
    name: 'Suéter Cuello Redondo Cobalto',
    fabric: 'Lana merino extrafina 19.5 micras',
    price: 118,
    summary:
      'Tejido en galga fina sin costuras laterales para una caída limpia, térmica y respirable durante todo el año.',
    details: [
      '100% lana merino certificada sin tratamiento acrílico',
      'Puños y pretina en canalé elástico de alta recuperación',
      'Tacto suave apto para uso directo sobre la piel',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stockNote: 'Edición limitada',
    image: knitwearProductImg,
    imageAlt: 'Suéter de lana merino azul cobalto de cuello redondo sobre superficie mineral',
  },
  {
    id: 'pantalon-pliegues-arena',
    sku: 'ML-PT-02',
    category: 'Pantalones',
    name: 'Pantalón Sastre Pinza Arena',
    fabric: 'Lino belga y algodón 310 gsm',
    price: 128,
    summary:
      'Tiro medio-alto con doble pinza frontal, caída amplia y cintura interna forrada en popelina de algodón.',
    details: [
      '65% lino europeo / 35% algodón orgánico de fibra larga',
      'Cremallera metálica YKK Excella y botón oculto',
      'Bolsillos traseros ribeteados con presilla reforzada',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stockNote: 'Disponible',
    image: trousersProductImg,
    imageAlt: 'Pantalón sastre con pinzas color arena en lino y algodón sobre fondo neutro',
  },
  {
    id: 'abrigo-urbano-obsidiana',
    sku: 'ML-AB-07',
    category: 'Abrigos y Chaquetas',
    name: 'Abrigo Largo Sastrería Obsidiana',
    fabric: 'Paño de lana virgen 580 gsm',
    price: 215,
    summary:
      'Silueta arquitectónica con solapa limpia, forro completo en cupro respirable y bolsillos interiores con cierre.',
    details: [
      '100% paño de lana virgen italiana con acabado cepillado',
      'Forro interior en cupro Bemberg antiestático',
      'Hombro natural ligeramente caído para superponer capas',
    ],
    sizes: ['S', 'M', 'L'],
    stockNote: 'Últimas unidades',
    image: lookbookStreetImg,
    imageAlt: 'Abrigo largo negro en paño de lana sobre camiseta blanca y denim crudo',
  },
  {
    id: 'gabardina-pizarra-taller',
    sku: 'ML-AB-09',
    category: 'Abrigos y Chaquetas',
    name: 'Gabardina Amplia Pizarra',
    fabric: 'Gabardina de algodón repelente al agua',
    price: 195,
    summary:
      'Abrigo cruzado de corte amplio pensado para lluvia ligera y entretiempo, con puños ajustables y caída fluida.',
    details: [
      'Tejido de doble torsión resistente al viento y llovizna',
      'Cinturón desmontable y abertura trasera abotonada',
      'Confección artesanal en lotes numerados',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stockNote: 'Disponible',
    image: heroEditorialImg,
    imageAlt: 'Gabardina gris pizarra de corte amplio en ambiente arquitectónico',
  },
  {
    id: 'sueter-tejido-crudo',
    sku: 'ML-TP-08',
    category: 'Tejido de Punto',
    name: 'Suéter Acanalado Algodón Crudo',
    fabric: 'Algodón orgánico hilado grueso',
    price: 108,
    summary:
      'Punto inglés con textura marcada y volumen equilibrado, ideal como capa principal en días frescos.',
    details: [
      '100% algodón orgánico sin blanqueadores ópticos',
      'Hombro montado con remallado a mano en cuello',
      'Mantiene su estructura tras múltiples lavados',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stockNote: 'Disponible',
    image: heroEditorialImg,
    imageAlt: 'Suéter tejido grueso color hueso combinado con pantalón oscuro',
  },
];

export const BENEFITS_DATA: BenefitItem[] = [
  {
    index: '01.',
    title: 'Fibras nobles sin mezclas plásticas',
    description:
      'Evitamos poliéster y acrílicos en nuestras telas principales. Trabajamos únicamente con lino europeo, algodón peinado y lana merino que envejecen con carácter.',
    benchmark: '0% poliéster en telas',
  },
  {
    index: '02.',
    title: 'Patronaje probado en cuerpos reales',
    description:
      'Cada prenda pasa por cuatro rondas de ajuste en taller antes de entrar a producción, logrando hombros limpios y proporciones equilibradas en todas las tallas.',
    benchmark: 'Tallas S a XL calibradas',
  },
  {
    index: '03.',
    title: 'Compra protegida y cambio en casa',
    description:
      'Si la talla no te queda exacta, coordinamos la recolección gratuita en tu domicilio y enviamos la nueva talla en menos de 48 horas hábiles.',
    benchmark: '30 días sin fricción',
  },
  {
    index: '04.',
    title: 'Asesoría de talla real por WhatsApp',
    description:
      'Antes de comprar puedes enviarnos tu estatura y peso aproximado; nuestro equipo de taller te recomienda la talla exacta según la caída de cada molde.',
    benchmark: 'Respuesta en < 15 min',
  },
];

export const LOOKBOOK_DATA: LookbookItem[] = [
  {
    id: 'look-galeria-01',
    title: 'Capas de Entretiempo en Concreto',
    collection: 'Colección Otoño / Invierno',
    year: '2026',
    category: 'Colección Otoño',
    summary:
      'Superposición de paño pizarra sobre punto grueso de algodón crudo y pantalón recto de lana fría.',
    garments: 'Gabardina Pizarra + Suéter Crudo',
    image: heroEditorialImg,
    imageAlt: 'Editorial de moda contemporánea en galería de concreto con abrigos y tejidos',
    aspectClass: 'md:col-span-7',
  },
  {
    id: 'look-urbano-02',
    title: 'Sastrería Nocturna y Denim Crudo',
    collection: 'Cápsula Urbana',
    year: '2026',
    category: 'Sastrería Urbana',
    summary:
      'Equilibrio entre abrigo largo de lana virgen obsidiana, camiseta pesada y denim índigo sin lavado agresivo.',
    garments: 'Abrigo Obsidiana + Denim ÍNDIGO',
    image: lookbookStreetImg,
    imageAlt: 'Modelo caminando frente a edificio de piedra caliza con abrigo largo negro',
    aspectClass: 'md:col-span-5',
  },
  {
    id: 'look-atelier-03',
    title: 'Mesa de Cortes y Lino Belga',
    collection: 'Proceso de Taller',
    year: '2026',
    category: 'Atelier',
    summary:
      'Selección de rollos en lino arena, verde salvia y sarga índigo previo al trazado manual de moldes.',
    garments: 'Archivo textil de temporada',
    image: atelierCraftImg,
    imageAlt: 'Rollos de tela de lino y mezclilla junto a tijeras de sastre y moldes',
    aspectClass: 'md:col-span-5',
  },
  {
    id: 'look-estudio-04',
    title: 'Estudio de Textura Grafito & Cobalto',
    collection: 'Esenciales Permanentes',
    year: '2026',
    category: 'Sastrería Urbana',
    summary:
      'Contraste táctil entre sarga de algodón 420 gsm y punto merino extrafino teñido en inmersión.',
    garments: 'Sobrecamisa Grafito + Suéter Cobalto',
    image: jacketProductImg,
    imageAlt: 'Detalle de confección de sobrecamisa grafito en algodón pesado',
    aspectClass: 'md:col-span-7',
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'c1',
    quote:
      'El gramaje de la sobrecamisa grafito supera cualquier marca comercial del mismo rango. Se siente armada desde el primer uso y no pierde forma al lavarla.',
    author: 'Sebastián Mora Quiroga',
    city: 'Bogotá',
    garment: 'Sobrecamisa Estructurada Grafito · Talla M',
    fitNote: 'Dudaba entre M y L; por WhatsApp me sugirieron M según mi estatura',
    outcome: 'Calce exacto en hombros y segunda compra al mes siguiente',
  },
  {
    id: 'c2',
    quote:
      'Buscaba un pantalón de lino que no se transparentara ni se arrugara de forma descuidada en oficina. La mezcla con algodón tiene una caída impecable.',
    author: 'Elena Domínguez Vidal',
    city: 'Madrid',
    garment: 'Pantalón Sastre Pinza Arena · Talla S',
    fitNote: 'Necesitaba ajuste de largo sin esperar semanas',
    outcome: 'Entrega en 36 horas y uso semanal continuo',
  },
  {
    id: 'c3',
    quote:
      'El suéter cobalto conserva el color intacto y abriga sin resultar pesado en espacios cerrados. El empaque llegó sin plásticos innecesarios.',
    author: 'Andrés Felipe Tovar',
    city: 'Ciudad de México',
    garment: 'Suéter Cuello Redondo Cobalto · Talla L',
    fitNote: 'Primera compra en línea sin probar en tienda física',
    outcome: 'Cambio de talla S a M resuelto en 48 h para un regalo adicional',
  },
];

export function buildWhatsAppUrl(customMessage?: string): string {
  const defaultMsg =
    'Hola equipo de Monte & Lino, vi la colección en su tienda web y quisiera asesoría de tallas o disponibilidad.';
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
