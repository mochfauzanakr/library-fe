import { SessionProvider } from "@/components/providers/SessionProvider";
import UserSearch from "@/components/layout/search/UserSearch";
import Topbar from "@/components/layout/topbar";
import AppLayout from "@/components/layout/AppLayout";
import {Toaster} from "@/components/ui/sonner"
export default function UserLayout({ children }) {
  return (
    <SessionProvider>
      <AppLayout
        role="user"
        topbar={<Topbar title="Home" search={<UserSearch />} />}
      >
        {children}
      </AppLayout>

      <Toaster richColors closeButton />
    </SessionProvider>
  );
}
