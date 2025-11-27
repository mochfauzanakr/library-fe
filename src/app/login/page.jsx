import LoginForm from "@/components/forms/loginform"
import Image from "next/image"
import Link from "next/link";
import React from "react";
import {ArrowLongRightIcon} from'@heroicons/react/24/solid';

export default function Login() {
  return (
    <div className="flex justify-center gap-16 mt-6">
      <div className="left-panel relative w-1/2 h-full overflow-hidden rounded-xl shadow-lg justify-center flex ml-8">
        <Image className="w-full h-full" src='/img/login_photo.jpg' width={568} height={568} alt="about us" />
        <div className="absolute top-4 right-4 flex justify-center items-center">
          <Link href="/" className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm hover:bg-white/30 transition">
            Back to website <ArrowLongRightIcon className="w-4 h-4 inline-block ml-1" />
          </Link>
        </div>
      </div>
      <div className="w-1/2 right-panel flex flex-col gap-6 mt-6 mr-8 justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}