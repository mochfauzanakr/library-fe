"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Mulai Jelajahi Buku-buku Terbaik
        </h2>

        <p className="text-slate-600 mt-4 text-lg">
          Temukan koleksi lengkap dari fiksi, sains, teknologi, hingga sejarah —
          semuanya bisa kamu akses secara online.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/books">
            <Button size="lg">Lihat Koleksi</Button>
          </Link>

          <Link href="/register">
            <Button size="lg" variant="outline" className="text-primary">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
