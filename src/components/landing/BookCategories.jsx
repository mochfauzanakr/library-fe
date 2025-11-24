"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Library,
  BookOpen,
  BookMarked,
  BookCopy,
  BookText,
  BrainCircuit,
  GraduationCap,
  Landmark,
  Palette,
  Briefcase,
} from "lucide-react";

const iconMap = [
  BookOpen,
  BookCopy,
  BrainCircuit,
  GraduationCap,
  Landmark,
  Palette,
  Briefcase,
  BookMarked,
  Library,
  BookText,
];

export default function BookCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Gagal load kategori:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Kategori Buku</h2>
        <p className="text-center text-gray-500">Loading kategori...</p>
      </section>
    );
  }

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Kategori Buku
      </h2>
      <p className="text-center text-gray-600 mb-10 px-3">
        Pilih kategori dan mulai jelajahi koleksi perpustakaan.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto px-4">
        {categories.map((cat, index) => {
          const Icon = iconMap[index % iconMap.length];

          return (
            <Card
              key={cat.id_category}
              className="hover:shadow-xl hover:-translate-y-1 transition transform border border-blue-100"
            >
              <CardHeader className="flex flex-col items-center py-6 gap-3">
                <span className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </span>
                <CardTitle className="text-lg text-center">
                  {cat.name}
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
