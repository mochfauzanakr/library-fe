import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

      {/* TEXT SIDE */}
      <div className="flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-4">
          Siapa Kami?
        </h2>
        <p className="text-lg leading-relaxed opacity-80 mb-6">
          Perpustakaan kami memiliki visi untuk memberikan akses literasi yang
          inklusif bagi seluruh pelajar dan masyarakat. Dengan ribuan koleksi
          buku dan sistem berbasis web, kami berkomitmen memperluas wawasan dan
          memudahkan proses peminjaman.
        </p>
        <p className="text-lg leading-relaxed opacity-80">
          Kami terus berkembang dengan menyediakan fasilitas modern,
          termasuk ruang baca nyaman, area diskusi, dan layanan reservasi buku
          online.
        </p>
      </div>

      {/* IMAGE SIDE */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-xl">
        <Image
          src="/img/login_photo.jpg"
          fill
          alt="Library"
          className="object-cover"
        />
      </div>
    </section>
  );
}