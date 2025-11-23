"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
  const slides = [
    {
      title: "Selamat Datang di Perpustakaan",
      desc: "Perpustakaan kami menyediakan akses mudah ke ribuan koleksi buku, jurnal, dan literatur yang dapat diakses oleh seluruh anggota komunitas.",
      color: "var(--primary)",
    },
    {
      title: "Fasilitas Modern",
      desc: "Ruang baca nyaman, area diskusi, serta sistem peminjaman berbasis web memudahkan siapa pun untuk belajar dan mencari referensi.",
      color: "var(--accent)",
    },
    {
      title: "Layanan Peminjaman Online",
      desc: "Pengunjung dapat memesan buku secara online, memeriksa ketersediaan, dan mengambilnya langsung di perpustakaan.",
      color: "var(--secondary)",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        className="rounded-2xl px-4 md:px-8" // ruang luar kiri-kanan
      >
        {slides.map((item, idx) => (
          <SwiperSlide key={idx} className="!px-2 md:!px-4">  {/* jarak antar slide */}
            <div
              className="h-[350px] md:h-[420px] flex flex-col items-start justify-center px-10 py-8 rounded-2xl shadow-lg"
              style={{
                background: item.color,
                color: "var(--primary-foreground)",
              }}
            >
              <h2 className="text-4xl font-bold mb-4 max-w-3xl">
                {item.title}
              </h2>
              <p className="text-lg opacity-90 max-w-3xl leading-relaxed">
                {item.desc}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
