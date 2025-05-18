export type PublicUser = {
  email: string;
  providers: ('local' | 'google' | 'github')[];
  avatarUrl?: string;
  createdAt?: Date;
};
