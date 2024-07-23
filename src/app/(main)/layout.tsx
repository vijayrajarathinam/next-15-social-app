import { redirect } from "next/navigation";
import SessionProvider from "@/providers/SessionProvider";
import { validateRequest } from "@/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const request = await validateRequest();
  if (!request.user) redirect("/login");
  return <SessionProvider value={request}>{children}</SessionProvider>;
}
