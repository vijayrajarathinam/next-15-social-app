import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "./mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/commons/LoadingButton";
import { Button } from "@/components/ui/button";

interface DeletePostDialogueProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

export default function DeletePostDialogue(props: DeletePostDialogueProps) {
  const { post, open, onClose } = props;
  const mutation = useDeletePostMutation();

  const handleOpenChange = (open: boolean) =>
    (!open || !mutation.isPending) && onClose();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            loading={mutation.isPending}
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
