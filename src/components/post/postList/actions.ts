"use server";

import { validateRequest } from "@/auth";
import { postDataInclude } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function deletePostAction(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error(`Post with id:${id} not found`);
  if (post.userId !== user.id) throw new Error("Unauthorized");

  return await prisma.post.delete({ where: { id }, include: postDataInclude });
}
