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
