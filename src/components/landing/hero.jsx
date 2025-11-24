import {Button} from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row items-center px-6 gap-10 py-10 md:py-20">
      
      {/* LEFT */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Borrow Books Easily and Efficiently
        </h1>
        <p className="text-slate-600 mt-4 text-lg">
          A modern online booking system for your library. Browse, reserve, and pick up — no hassle.
        </p>

        <div className="mt-6 flex gap-4 justify-center md:justify-start">
          <Button size="lg">Get Started</Button>
          <Button className="text-primary hover:text-primary" size="lg" variant="outline">
            Browse Collection
          </Button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-md">
        <Image
          src="/img/homepage.jpg"
          alt="Library Hero"
          width={800}
          height={500}
          className="object-cover"
        />
      </div>
    </div>
  );
}
