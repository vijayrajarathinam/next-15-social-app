"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { postDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });
  const newPost = prisma.post.create({
    data: { content, userId: user.id },
    include: postDataInclude,
  });

  return newPost;
}
