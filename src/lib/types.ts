import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    followers: {
      where: { followerId: loggedInUserId },
      select: { followerId: true },
    },
    _count: { select: { followers: true } }, // total count of followers
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: { select: getUserDataSelect(loggedInUserId) },
  } satisfies Prisma.PostInclude;
}

export type UserData = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  followers: {
    followerId: string;
  }[];
  _count: {
    followers: number;
  };
};

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
