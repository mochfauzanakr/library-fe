import { LoginForm } from "@/components/ui/loginForm"
import Image from "next/image"
import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login() {
  return (
    <div className="flex justify-center gap-16 mt-6">
      <div className="left-panel w-1/2 h-full overflow-hidden rounded-xl shadow-lg justify-center flex ml-8">
        <Image className="w-full h-full" src='/img/login_photo_4.jpg' width={568} height={568} alt="about us"/>
      </div>
      <div className=" w-1/2 right-panel justify-start flex flex-col gap-6 mt-6 mr-8">
        <LoginForm />
      </div>
    </div>
  );
}
