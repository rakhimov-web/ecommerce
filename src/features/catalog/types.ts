export type Product = {
  id: string;
  name: { uz: string; ru: string };
  image?: string;
  price: number;
  oldPrice?: number;
  stock: number;
  rating?: { average: number; count: number };
  badge?: "new" | "sale";
  installment?: { monthly: number; months: number };
};
