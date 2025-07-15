import ButtonMedium from "@/components/common/buttons/ButtonMedium";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { ArrowLeft } from "lucide-react";
 
import Link from "next/link";
import React from "react";

export default async function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-160px)] lg:min-h-[calc(100vh-110px)] flex items-center justify-center">
        <div className="content py-12 lg:grid grid-cols-2 gap-10 place-items-center">
          <div className="space-y-7">
            <div className="text-rose-800 text-base font-medium">404 error</div>
            <div className=" text-3xl lg:text-6xl font-bold lg:leading-[72px]">
              Page not found
            </div>

            <div className="max-w-[480px] text-xl font-normal leading-loose">
              Sorry, the page you are looking for doesn't exist.Here are some
              helpful links:
            </div>
            <div className="flex items-center gap-x-2">
              <Link href="/" className="!bg-transparent !">
                <ButtonMedium outline icon={<ArrowLeft />}>
                  Go Back
                </ButtonMedium>
              </Link>

              <Link href="/">
                <ButtonMedium> Take me home </ButtonMedium>
              </Link>
            </div>
          </div>
          <div className="w-full hidden lg:block">
            <img
              className="w-full object-cover rounded-xl"
              src="/images/not-found-bg.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
