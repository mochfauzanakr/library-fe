import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Nav() {
  return (
<nav className="sticky top-4 z-20 w-full">
  <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6 rounded-3xl border border-slate-200 shadow-sm bg-white/70 backdrop-blur">
        <Link href="/" className="text-lg font-semibold">Library System</Link>

        <div className="hidden md:flex gap-6">
          <Link className="hover:text-primary" href="#">Collection</Link>
          <Link className="hover:text-primary" href="#">About</Link>
          <Link className="hover:text-primary" href="#">Events</Link>
          <Link className="hover:text-primary" href="#">Contact</Link>
        </div>

        <div className="flex gap-3">
          <Link href="/login">
          <Button variant="outline" className='text-primary hover:text-primary/90'>Log in</Button>
          </Link>
          <Link href='/register'>
          <Button>Sign up</Button>
          </Link>
        </div>
        </div>
      </nav>
  );
}