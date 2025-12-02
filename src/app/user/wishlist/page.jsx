import WishlistPage from "@/components/user/WishlistPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;

  console.log("WISHLIST USER ID:", user_id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist?user_id=${user_id}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  const items = json.data || [];

  return <WishlistPage items={items} />;
}
