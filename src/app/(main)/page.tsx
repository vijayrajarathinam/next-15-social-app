import Post from "@/components/post/postList/Post";
import FlatList from "@/components/commons/FlatList";
import PostEditor from "@/components/post/editor/PostEditor";
import FeatureBar from "@/components/post/trends/FeatureBar";
import { postDataInclude } from "@/lib/types";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {/* {posts.map(post => <Post key={post.id} post={post}/>)} */}
        <FlatList of={posts} render={(post) => <Post post={post} />} />
      </div>
      <FeatureBar />
    </main>
  );
}
