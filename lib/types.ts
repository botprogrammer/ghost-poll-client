export interface Poll {
  _id: string;
  question: string;
  slug: string;
  options: {
    id: string;
    value: string;
    votes: number;
  }[];
  expiresAt: string;
  hideResults: boolean;
  reactions: {
    likes: number;
    trending: number;
  };
  totalVotes: number;
  createdAt: string;
}
