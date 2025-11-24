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
    <div>
      <Nav />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6">
        <Hero />
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
