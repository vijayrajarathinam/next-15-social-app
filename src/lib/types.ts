import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export type UserData = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export const postDataInclude = {
  user: { select: userDataSelect },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}
