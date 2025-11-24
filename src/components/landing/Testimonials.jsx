"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Rina",
    comment: "Perpustakaannya rapi banget dan koleksinya lengkap!",
    image: ""
  },
  {
    name: "Budi",
    comment: "Website-nya gampang dipake, tinggal cari terus pinjam.",
  },
  {
    name: "Sari",
    comment: "Suka banget sama fitur rekomendasi bukunya.",
  },
];

export default function TestimonialsCarousel() {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Apa Kata Pengunjung?
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
        Pendapat mereka yang sudah mencoba layanan perpustakaan.
      </p>

      <div className="max-w-3xl mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="rounded-xl"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <Card className="shadow-lg border-none bg-white dark:bg-gray-800">
                <CardContent className="flex flex-col items-center text-center py-12 px-6 space-y-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" alt={t.name} />
                    <AvatarFallback className="text-xl">
                      {t.name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-gray-600 dark:text-gray-300 italic text-lg">
                    “{t.comment}”
                  </p>

                  <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
                    {t.name}
                  </h3>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
