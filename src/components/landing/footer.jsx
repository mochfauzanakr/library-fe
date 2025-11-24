import { Instagram, Twitter, Facebook, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold">Library System</h3>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Sistem perpustakaan modern untuk meminjam buku dengan mudah dan cepat.
          </p>

          <div className="flex gap-4 mt-4">
            <a href="https://instagram.com" target="_blank" className="text-slate-600 hover:text-primary transition">
              <Instagram />
            </a>
            <a href="https://twitter.com" target="_blank" className="text-slate-600 hover:text-primary transition">
              <Twitter size={22} />
            </a>
            <a href="https://facebook.com" target="_blank" className="text-slate-600 hover:text-primary transition">
              <Facebook size={22} />
            </a>
            <a href="https://github.com" target="_blank" className="text-slate-600 hover:text-primary transition">
              <Github size={22} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-4">Navigasi</h4>
          <ul className="space-y-2 text-slate-600">
            <li><a href="#" className="hover:text-primary">Home</a></li>
            <li><a href="#" className="hover:text-primary">Koleksi Buku</a></li>
            <li><a href="#" className="hover:text-primary">Tentang Kami</a></li>
            <li><a href="#" className="hover:text-primary">Kontak</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-4">Kategori</h4>
          <ul className="space-y-2 text-slate-600">
            <li><a href="#" className="hover:text-primary">Fiksi</a></li>
            <li><a href="#" className="hover:text-primary">Sains</a></li>
            <li><a href="#" className="hover:text-primary">Teknologi</a></li>
            <li><a href="#" className="hover:text-primary">Sejarah</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Hubungi Kami</h4>
          <ul className="space-y-2 text-slate-600">
            <li>Email: contact@library.com</li>
            <li>Telp: (021) 123-456</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Library System. All rights reserved.
      </div>
    </footer>
  );
}
