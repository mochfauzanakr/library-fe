import AppLayout from "@/components/layout/appLayout";

export default function UserRootLayout({ children }) {
  return <AppLayout role="user">{children}</AppLayout>;
}
