import { SessionProvider } from "@/components/providers/SessionProvider";
import AppLayout from "@/components/layout/AppLayout";

export default function UserLayout({ children }) {
  return (
    <SessionProvider>
      <AppLayout role="user">
        {children}
      </AppLayout>
    </SessionProvider>
  );
}
