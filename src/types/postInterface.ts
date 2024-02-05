export interface PostProps {
  slug: string;
  title: string;
  created_at: string;
  metadata: {
    author: string;
    cover_image: {
      url: string;
      imgix_url: string;
    };
    tags: {
      title: string;
    }[];
    excerpt: string;
    content: string;
  };
}