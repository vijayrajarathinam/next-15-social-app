import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import signUpImage from "@/assets/signup-image.jpg";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1">
            <h1 className="text-center text-3xl font-bold">
              Sign up to NextBook
            </h1>
            <p className="text-center text-muted-foreground">
              Get to know your surrounding
            </p>
            <div className="space-y-5">
              <SignupForm />
              <Link href="/login" className="block text-center hover:underline">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={signUpImage}
          alt="sign up meta image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
