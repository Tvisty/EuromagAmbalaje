export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  basePrice: number;
  options: ProductOption[];
  features?: string[];
  minimumOrder?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string; // unique id for the cart item (e.g., date.now())
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
  totalPrice: number;
}

