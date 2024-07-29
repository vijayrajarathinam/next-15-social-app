import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { PostPage } from "@/lib/types";

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryFilter: QueryFilters = { queryKey: ["post-feed", "me"] };

  const mutation = useMutation({
    mutationFn: submitPost,
    // call the get post api again and invalidate the cache state in the [queryFilter]
    // onSuccess: () => queryClient.invalidateQueries(queryFilter),
    // not make a call to get post api instead update the cache state for the [queryFilter]
    onSuccess: async (newPost) => {
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );
      // triggers only if cancelled before 1st page loaded
      // e.g., make a new post before first page loads
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        // condition to trigger only if cancelled before 1st page loaded
        predicate: (query) => !query.state.data,
      });
      toast({ description: "Post created!.." });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again later ",
      });
    },
  });

  return mutation;
}
