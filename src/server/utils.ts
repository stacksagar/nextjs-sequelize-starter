import { headers } from "next/headers";

export async function getDomain() {
  const headersList = headers();
  const host = (await headersList).get("host");
  const protocol = (await headersList).get("x-forwarded-proto") || "http";
  const fullUrl = `${protocol}://${host}`;
  return fullUrl;
}
