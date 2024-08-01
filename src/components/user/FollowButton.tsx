"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data: { isFollowedByUser },
  } = useFollowerInfo(userId, initialState);
  const followEndpoint = `/api/users/${userId}/followers`;
  const queryKey: QueryKey = ["follower-info", userId];
  const { mutate } = useMutation({
    mutationFn: () =>
      isFollowedByUser
        ? kyInstance.delete(followEndpoint)
        : kyInstance.post(followEndpoint),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));
      return { previousState };
    },
    onError(error, _, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    },
  });
  return (
    <Button
      onClick={() => mutate()}
      variant={isFollowedByUser ? "secondary" : "default"}
    >
      {isFollowedByUser ? "unfollow" : "follow"}
    </Button>
  );
}
