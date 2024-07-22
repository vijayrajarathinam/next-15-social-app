"use server";

import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { SignUpValues, signUpSchema } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";

export async function signupAction(
  credentials: SignUpValues,
): Promise<{ error?: string }> {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    // validate to username already exist in database
    const existingUsername = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } }, // mode -> compare case insensitive
    });

    if (existingUsername) return { error: "Username already taken" };

    // validate to email already exist in database
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } }, // mode -> compare case insensitive
    });

    if (existingEmail) return { error: "Email already taken" };

    // save user information in db
    await prisma.user.create({
      data: {
        email,
        username,
        id: userId,
        displayName: username,
        password: passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
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
