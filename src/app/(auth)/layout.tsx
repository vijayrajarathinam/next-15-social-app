import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (user) redirect("/");
  return <>{children}</>;
}
