import React from "react";
import { getUser } from "@/server/user.actions";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default async function layout({ children }: any) {
  const user = await getUser();

  return (
    <div>
      <Header user={user} />
      {children}
      <Footer />
    </div>
  );
}
