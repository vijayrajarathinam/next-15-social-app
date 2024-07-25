"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ExtensionPlaceholder from "@tiptap/extension-placeholder";
import { submitPost } from "./actions";
import Useravatar from "@/components/commons/Useravatar";
import { useSession } from "@/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";

const placeholder: string = "Share your thought for the day";

export default function PostEditor() {
  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      ExtensionPlaceholder.configure({ placeholder }),
    ],
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  async function onEditorSubmit() {
    await submitPost(input);
    editor?.commands.clearContent();
  }
  return (
    <div className="mx-2 flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <Useravatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onEditorSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
