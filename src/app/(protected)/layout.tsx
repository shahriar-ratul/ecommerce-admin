import { auth } from "@/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <div className="">
          <Header />
          <Sidebar className="fixed  hidden border-r xl:flex" />
          <main className="flex">
            <div className="container mt-10 pb-8 xl:pl-[256px] w-full">
              {children}
            </div>
          </main>
        </div>
      </SessionProvider>
    </>
  );
}
