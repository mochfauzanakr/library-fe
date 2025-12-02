import { SessionProvider } from "@/components/providers/SessionProvider";
import AppLayout from "@/components/layout/AppLayout";
import {Toaster} from "@/components/ui/sonner"
export default function UserLayout({ children }) {
  return (
    <SessionProvider>
      <AppLayout role="user">
        {children}
      </AppLayout>
      <Toaster richColors closeButton />
    </SessionProvider>
  );
}
