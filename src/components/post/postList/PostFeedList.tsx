"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { PostData, PostPage } from "@/lib/types";
import { Loader2 } from "lucide-react";
import FlatList from "@/components/commons/FlatList";
import Post from "./Post";
import kyInstance from "@/lib/ky";
import { Button } from "@/components/ui/button";
import InfiniteScrollContainer from "@/components/commons/InfiniteScrollContainer";
import PostsLoadingSkeleton from "./PostsLoadingSkeleton";

const ERROR_TEXT_MESSAGE = "Error occured while loading data";

export default function PostFeedList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "me"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/me",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostPage>(),
    // queryFn: async ({pageParam}) => {
    //   const res = await fetch("/api/posts/me");
    //   if (!res.ok) throw Error(`Request failed with status code ${res.status}`);
    //   return res.json();
    // },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts: PostData[] = data?.pages.flatMap((page) => page.posts) || [];

  // handling data loading state
  if (status === "pending") return <PostsLoadingSkeleton />;

  // handling data error state
  if (status === "error")
    return <p className="text-center text-destructive">{ERROR_TEXT_MESSAGE}</p>;

  // on data success and page end
  if (status === "success" && !posts.length && hasNextPage)
    return <p className="text-center text-muted-foreground">No posts yet!..</p>;

  // on data success
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <FlatList of={posts} render={(post) => <Post post={post} />} />
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
