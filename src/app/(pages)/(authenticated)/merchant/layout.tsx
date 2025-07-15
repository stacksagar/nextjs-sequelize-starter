import { getUser } from "@/server/user.actions";
import MerchantLayout from "./MerchantLayout";
import { redirect } from "next/navigation";

export default async function layout({ children }: any) {
  const user = await getUser();
  if (!user) return redirect("/auth/login");

  return <MerchantLayout user={user}>{children}</MerchantLayout>;
}
