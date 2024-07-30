/* eslint-disable react-hooks/rules-of-hooks */
import { usePathname, useRouter } from "next/navigation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { deletePostAction } from "./actions";
import { PostPage } from "@/lib/types";

export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();
  const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

  const mutation = useMutation({
    mutationFn: deletePostAction,
    onSuccess: async (deletedPost) => {
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(({ nextCursor, posts }) => ({
              nextCursor,
              posts: posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({ description: "Post deleted!.." });
      if (pathname === `posts/${deletedPost.id}`)
        router.push(`/users/${deletedPost.user.username}`);
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "failed to delete post. Please try again!..",
      });
    },
  });

  return mutation;
}
