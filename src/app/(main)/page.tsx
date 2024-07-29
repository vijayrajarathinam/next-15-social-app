import PostEditor from "@/components/post/editor/PostEditor";
import FeatureBar from "@/components/post/trends/FeatureBar";
import PostFeedList from "@/components/post/postList/PostFeedList";

export default async function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <PostFeedList />
      </div>
      <FeatureBar />
    </main>
  );
}
