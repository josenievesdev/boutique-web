export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}