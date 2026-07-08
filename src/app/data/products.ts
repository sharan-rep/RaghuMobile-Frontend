export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  condition?: 'Like New' | 'Good' | 'Fair';
  specifications: {
    display?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    camera?: string;
    battery?: string;
    type?: string;
    compatibility?: string;
    connectivity?: string;
    material?: string;
    powerOutput?: string;
    cableLength?: string;
    batteryLife?: string;
    noiseCancellation?: string;
  };
  colors?: string[];
  storage?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 134900,
    originalPrice: 159900,
    image: 'https://images.unsplash.com/photo-1651312707872-7bea9259a6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBwcm8lMjBsdXh1cnl8ZW58MXx8fHwxNzcxOTA5NTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.8,
    reviews: 2341,
    inStock: true,
    condition: 'Like New',
    description: 'The ultimate iPhone with A17 Pro chip, titanium design, and pro camera system.',
    specifications: {
      display: '6.7" Super Retina XDR',
      processor: 'A17 Pro chip',
      ram: '8GB',
      storage: '256GB',
      camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      battery: '4422 mAh',
    },
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    storage: ['256GB', '512GB', '1TB'],
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 129999,
    originalPrice: 139999,
    image: 'https://images.unsplash.com/photo-1627609834360-74948f361335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwZ2FsYXh5JTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NzE5MDk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.7,
    reviews: 1876,
    inStock: true,
    condition: 'Good',
    description: 'Powerful flagship with S Pen, 200MP camera, and AI features.',
    specifications: {
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '200MP Main + 50MP Telephoto + 12MP Ultra Wide',
      battery: '5000 mAh',
    },
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'],
    storage: ['256GB', '512GB', '1TB'],
  },
  {
    id: '3',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 64999,
    originalPrice: 69999,
    image: 'https://images.unsplash.com/photo-1758682663495-69b525734f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmUlMjBibGFjayUyMG1vZGVybnxlbnwxfHx8fDE3NzE5MDk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.6,
    reviews: 1234,
    inStock: true,
    condition: 'Fair',
    description: 'Fast performance with Hasselblad camera and 100W charging.',
    specifications: {
      display: '6.82" LTPO AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP Main + 64MP Telephoto + 48MP Ultra Wide',
      battery: '5400 mAh',
    },
    colors: ['Flowy Emerald', 'Silky Black'],
    storage: ['256GB', '512GB'],
  },
  {
    id: '4',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: 106999,
    originalPrice: 114999,
    image: 'https://images.unsplash.com/photo-1656758211601-a8849367b3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmRyb2lkJTIwcGhvbmUlMjBzY3JlZW4lMjBkaXNwbGF5fGVufDF8fHx8MTc3MTkwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.7,
    reviews: 987,
    inStock: true,
    description: 'Best-in-class AI photography with pure Android experience.',
    specifications: {
      display: '6.7" LTPO OLED',
      processor: 'Google Tensor G3',
      ram: '12GB',
      storage: '128GB',
      camera: '50MP Main + 48MP Telephoto + 48MP Ultra Wide',
      battery: '5050 mAh',
    },
    colors: ['Obsidian', 'Porcelain', 'Bay'],
    storage: ['128GB', '256GB', '512GB'],
  },
  {
    id: '5',
    name: 'iPhone 14',
    brand: 'Apple',
    price: 69900,
    originalPrice: 79900,
    image: 'https://images.unsplash.com/photo-1651312707872-7bea9259a6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBwcm8lMjBsdXh1cnl8ZW58MXx8fHwxNzcxOTA5NTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.6,
    reviews: 3456,
    inStock: true,
    description: 'Powerful iPhone with A15 Bionic chip and advanced camera.',
    specifications: {
      display: '6.1" Super Retina XDR',
      processor: 'A15 Bionic',
      ram: '6GB',
      storage: '128GB',
      camera: '12MP Main + 12MP Ultra Wide',
      battery: '3279 mAh',
    },
    colors: ['Midnight', 'Starlight', 'Blue', 'Purple', 'Red'],
    storage: ['128GB', '256GB', '512GB'],
  },
  {
    id: '6',
    name: 'Samsung Galaxy A54 5G',
    brand: 'Samsung',
    price: 38999,
    originalPrice: 42999,
    image: 'https://images.unsplash.com/photo-1627609834360-74948f361335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwZ2FsYXh5JTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NzE5MDk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.4,
    reviews: 2156,
    inStock: true,
    description: 'Great features at an affordable price with great battery life.',
    specifications: {
      display: '6.4" Super AMOLED',
      processor: 'Exynos 1380',
      ram: '8GB',
      storage: '128GB',
      camera: '50MP Main + 12MP Ultra Wide + 5MP Macro',
      battery: '5000 mAh',
    },
    colors: ['Awesome Lime', 'Awesome Graphite', 'Awesome Violet', 'Awesome White'],
    storage: ['128GB', '256GB'],
  },
  {
    id: '7',
    name: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    price: 79999,
    originalPrice: 84999,
    image: 'https://images.unsplash.com/photo-1758682663495-69b525734f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmUlMjBibGFjayUyMG1vZGVybnxlbnwxfHx8fDE3NzE5MDk1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.5,
    reviews: 876,
    inStock: true,
    description: 'Leica co-engineered camera with flagship performance.',
    specifications: {
      display: '6.73" LTPO AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP Main + 50MP Telephoto + 50MP Ultra Wide',
      battery: '4880 mAh',
    },
    colors: ['Black', 'White', 'Titanium'],
    storage: ['256GB', '512GB'],
  },
  {
    id: '8',
    name: 'Nothing Phone (2)',
    brand: 'Nothing',
    price: 44999,
    originalPrice: 49999,
    image: 'https://images.unsplash.com/photo-1656758211601-a8849367b3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmRyb2lkJTIwcGhvbmUlMjBzY3JlZW4lMjBkaXNwbGF5fGVufDF8fHx8MTc3MTkwOTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smart Phone',
    rating: 4.3,
    reviews: 654,
    inStock: true,
    description: 'Unique design with Glyph interface and clean software.',
    specifications: {
      display: '6.7" LTPO OLED',
      processor: 'Snapdragon 8+ Gen 1',
      ram: '8GB',
      storage: '128GB',
      camera: '50MP Main + 50MP Ultra Wide',
      battery: '4700 mAh',
    },
    colors: ['White', 'Dark Gray'],
    storage: ['128GB', '256GB'],
  },
];

export const categories = [
  { id: 'all', name: 'All Products', icon: 'Smartphone' },
  { id: 'smart-phone', name: 'Smart Phone', icon: 'Smartphone' },
  { id: 'accessories', name: 'Accessories', icon: 'Headphones' },
];

export const accessories = [
  {
    id: 'acc1',
    name: 'Wireless Earbuds Pro',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1647334864689-e140efbfd51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc3MTg0NTY3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Accessories',
  },
  {
    id: 'acc2',
    name: 'Premium Phone Case',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1535157412991-2ef801c1748b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGNhc2UlMjBjb3ZlcnxlbnwxfHx8fDE3NzE5MDk1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Accessories',
  },
];
