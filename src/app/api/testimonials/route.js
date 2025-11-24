import { NextResponse } from "next/server";

const testimonials = [
  { id: 1, name: "Rina", comment: "Perpustakaan lengkap parah!" },
  { id: 2, name: "Budi", comment: "Website gampang dipakai." },
  { id: 3, name: "Sari", comment: "Desainnya nyaman dilihat." },
];

export async function GET() {
  return NextResponse.json(testimonials);
}
