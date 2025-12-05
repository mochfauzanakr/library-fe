import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Carousel from "@/components/landing/Carousel";
import AboutUs from "@/components/landing/AboutUs";
import Testimonials from "@/components/landing/Testimonials";
import BooksPreview from "@/components/landing/BooksPreview";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Nav />

      {/* HERO + Value Props */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#a5b4fc33,_transparent_45%),_radial-gradient(circle_at_30%_60%,_#38bdf833,_transparent_35%)]" />
        <div className="max-w-6xl mx-auto px-6">
          <Hero />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-12">
            {[
              { title: "Smart Search", desc: "Temukan buku dalam hitungan detik dengan kategori dan keyword." },
              { title: "Realtime Stock", desc: "Lihat ketersediaan tanpa harus datang ke rak fisik." },
              { title: "Borrow Tracking", desc: "Pantau status pinjaman dan jadwal pengembalian." },
              { title: "Staff Friendly", desc: "Kelola koleksi dan pengguna dari satu dashboard." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border bg-white/70 backdrop-blur shadow-sm p-4"
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Carousel />
        </div>
      </section>

      {/* ABOUT US */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <AboutUs />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Testimonials />
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <BooksPreview />
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <CTA />
        </div>
      </section>
    
    <Footer />
    </div>
  );
}
