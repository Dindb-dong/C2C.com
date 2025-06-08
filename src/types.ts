interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  comments: Comment[];
  mentor: Mentor | null;
  posts: Post[];
  postDislikes: PostDislike[];
  postLikes: PostLike[];
}

interface Mentor {
  id: string;
  recommend_mentor_id: string;
  recommended_mentor_id?: string;
  user_id: string;
  name: string;
  title: string;
  description: string;
  career: string;
  skills: string[];
  hourly_rate: number;
  expertise: string[];
  star_rating: number;
  mentor_point: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  user: User;
}

interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  boardId: string;
  category: string;
  tags: string[];
  likes: number;
  dislikes: number;
  comments: Comment[];
  author: User;
  board: Board;
  postDislikes: PostDislike[];
  postLikes: PostLike[];
}

interface Comment {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  postId: string;
  author: User;
  post: Post;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  categoryCode: string;
  topic?: string;
  topicSummaryId?: string;
  TopicSummary?: TopicSummary;
}

interface TopicSummary {
  id: string;
  title: string;
  content: string;
  categoryCode: string;
  createdAt: Date;
  updatedAt: Date;
  NewsArticle: NewsArticle[];
}

interface ChatSession {
  id: string;
  userId: string;
  problemId?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
  messages: Message[];
}

interface Message {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  createdAt: Date;
  tokens?: number;
  metadata?: any;
  session: ChatSession;
}

interface PostLike {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
  post: Post;
  user: User;
}

interface PostDislike {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
  post: Post;
  user: User;
}
