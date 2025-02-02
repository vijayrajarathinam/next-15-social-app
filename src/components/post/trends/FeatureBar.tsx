import { Suspense } from "react";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Loader2 } from "lucide-react";
import { validateRequest } from "@/auth";
import FlatList from "@/components/commons/FlatList";
import Useravatar from "@/components/commons/Useravatar";
import { UserData, getUserDataSelect } from "@/lib/types";
import FollowButton from "@/components/user/FollowButton";
import { formatNumber } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default function FeatureBar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <FollowSuggesions />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

const SuggestionItem = ({ user }: { user: UserData }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={`/users/${user.username}`}
        className="flex items-center gap-3"
      >
        <Useravatar avatarUrl={user.avatarUrl} className="flex-none" />
        <div className="">
          <p className="line-clamp-1 break-all font-semibold hover:underline">
            {user.displayName}
          </p>
          <p className="line-clamp-1 break-all text-muted-foreground">
            @{user.username}
          </p>
        </div>
      </Link>
      <FollowButton
        userId={user.id}
        initialState={{
          followers: user._count.followers,
          isFollowedByUser: !!user.followers.some(
            ({ followerId }) => followerId === user.id,
          ),
        }}
      />
    </div>
  );
};

async function FollowSuggesions() {
  const { user } = await validateRequest();
  if (!user) return null;
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: { id: user.id },
      followers: { none: { followerId: user.id } },
    },
    select: getUserDataSelect(user.id),
    take: 5, // limit 5
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      <FlatList
        of={usersToFollow}
        render={(utf) => <SuggestionItem user={utf} />}
      />
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
    FROM posts GROUP BY (hashtag) ORDER BY count DESC, hashtag ASC LIMIT 5
`;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 3 * 60 * 60 },
);
async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      <FlatList
        of={trendingTopics}
        render={({ hashtag, count }) => {
          const title = hashtag.split("#")[1];

          return (
            <Link href={`/hashtag/${title}`} className="block">
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={hashtag}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        }}
      />
    </div>
  );
}
