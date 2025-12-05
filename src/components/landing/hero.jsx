import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative flex flex-col md:flex-row items-center gap-10 py-14 md:py-20">
      {/* LEFT */}
      <div className="flex-1 text-center md:text-left space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          New: Faster approvals & auto late fee
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          Satu platform untuk menemukan, meminjam, dan mengelola koleksi buku.
        </h1>
        <p className="text-slate-600 mt-2 text-lg max-w-2xl">
          Jelajahi katalog, pantau stok realtime, dan kelola peminjaman dengan workflow yang bersih
          untuk pembaca, staf, dan admin.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
          <Button size="lg" asChild>
            <Link href="/register">Mulai Gratis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Masuk Dashboard</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-2 justify-center md:justify-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border">
            Realtime stock
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border">
            Auto late fee
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border">
            Staff-friendly dashboard
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 relative">
        <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-primary/20 via-transparent to-sky-200 blur-3xl" />
        <div className="relative rounded-2xl overflow-hidden shadow-xl border bg-white/70 backdrop-blur">
          <Image
            src="/img/homepage.jpg"
            alt="Library Hero"
            width={900}
            height={560}
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
