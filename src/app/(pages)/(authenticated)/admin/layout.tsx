import { getUser } from "@/server/user.actions";
import AdminLayout from "./AdminLayout";

export default async function layout({ children }: any) {
  const user = await getUser();
  
  return <AdminLayout user={user}>{children}</AdminLayout>;
}
