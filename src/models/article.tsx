export type Article = {
  imgSrc: string;
  title: string;
  link: string;
  originalSource?: string;
  time: string;
};

export interface ArticleList {
  totalCount: number;
  totalPage: number;
  items: ArticleItem[];
  __typename: string;
}

export interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  link: string;
  featuredImage: string;
  postDate: Date;
  modifiedDate: Date;
  location: string;
  author: Author;
  sponsor: Sponsor;
  category: Author[];
  tags: Author[] | null;
  profiles: null;
  __typename: string;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  link: string;
  profilePhoto?: null | string;
  __typename: Typename;
}

export enum Typename {
  Author = "Author",
  Category = "Category",
  Tag = "Tag",
}

export interface Sponsor {
  slug: null;
  name: string;
  picture: null;
  bio: string;
  __typename: string;
}
