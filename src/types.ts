export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  boardId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}