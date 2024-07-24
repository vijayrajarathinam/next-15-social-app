import { redirect } from "next/navigation";
import SessionProvider from "@/providers/SessionProvider";
import Navbar from "@/components/commons/Navbar";
import Sidebar from "@/components/commons/Sidebar";
import { validateRequest } from "@/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const request = await validateRequest();
  if (!request.user) redirect("/login");
  return (
    <SessionProvider value={request}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl gap-5 p-5">
          <Sidebar className="sticky top-[5.25rem] hidden h-fit space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <Sidebar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
