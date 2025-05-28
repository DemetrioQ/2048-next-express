export type PublicUser = {
  id: string;
  email: string;
  username?: string;
  isVerified: boolean;
  providers: ('local' | 'google' | 'github')[];
  avatar: {
    imageUrl: string,
    imageKey: string
  }
  createdAt?: Date;
};
