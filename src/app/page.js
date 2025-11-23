import Carousel from "@/components/landing/carousel";
import Nav from "@/components/landing/nav";
import AboutUs from "@/components/landing/abousUs";
import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <div>
      <Nav />
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 gap-12 mb-16 py-16 md:py-24 lg:py-32">
        <Hero />
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="flex justify-center mb-12 flex-col items-center px-6 text-center max-w-4xl mx-auto gap-4">
          <div className="width[80%]">
            <Carousel />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className=" mx-auto px-6">
          <AboutUs />
        </div>
      </section>

    </div>


  );
}