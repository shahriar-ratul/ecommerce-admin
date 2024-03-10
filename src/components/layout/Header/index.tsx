"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import MobileSidebar from "@/components/layout/MobileSidebar";
import { Button } from "@/components/ui/button";

import ThemeToggle from "@/components/layout/ThemeToggle";
import UserMenu from "@/components/layout/UserMenu";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from "axios";

interface Props {
  children?: React.ReactNode;
}

export default function Header({ children }: Props) {
  const session = useSession();

  const pathname = usePathname();

  const navRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);

  async function verify() {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.user?.accessToken}`
        }
      }
    );

    if (!data.success) {
      signOut();
    }
  }

  useEffect(() => {
    if (session?.data?.user?.accessToken && pathname !== "/login") {
      verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      entries => {
        setScroll(!entries[0].isIntersecting);
      },
      {
        root: null,
        rootMargin: `10px 0px`,
        threshold: 0
      }
    );

    if (navRef.current) {
      intersectionObserver.observe(navRef.current);
    }

    return () => intersectionObserver.disconnect();
  }, []);

  return (
    <>
      {/* <div ref={navRef}></div> */}
      <div
        className={cn(
          "fixed top-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20 px-6 xl:w-[calc(100%-240px)] w-full "
        )}
      >
        <nav className="h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="-ml-3 xl:hidden"
              size="icon"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </Button>

            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">LOGO</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">{children}</div>
          <div className="flex items-center gap-2">
            <UserMenu
              user={{
                name: session?.data?.user?.name ?? "",
                image: "/images/avatar/A11.jpg",
                email: session?.data?.user?.email ?? ""
              }}
            />
            <ThemeToggle />
          </div>
        </nav>
      </div>

      <MobileSidebar open={open} onOpenChange={setOpen} />
    </>
  );
}
