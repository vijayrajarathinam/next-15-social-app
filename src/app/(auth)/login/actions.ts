"use server";

import { verifySync } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { loginSchema, LoginValues } from "@/lib/validation";

export async function loginAction(
  credentials: LoginValues,
): Promise<{ error?: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    // validate to username already exist in database
    const existingUser = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } }, // mode -> compare case insensitive
    });

    if (!existingUser || !existingUser.password)
      return { error: "Incorrect Username or Password" };

    const validPassword = verifySync(existingUser.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) return { error: "Incorrect Username or Password" };

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(`Signup Error: ${error}`);
    return { error: "Somethinng went wrong please try again!.." };
  }
}
