export interface Tag {
  id: string;
  name: string;
  slug: string;
}
export interface Author {
  id: string;
  name: string;
  profile_image?: string;
}
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  feature_image?: string;
  published_at: string;
  tags: Tag[];
  reading_time?: number; // in minutes
  featured?: boolean;
}