"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type SidebarNavItem } from "@/types";
import { mainRoutes } from "@/constants/route";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("flex h-full w-[240px] flex-col top-0", className)}>
      <div className="flex h-16 w-full items-center justify-center gap-2 border-b text-lg font-medium">
        <User className="h-9 w-9" /> Hello-Admin
      </div>
      <div className="py-4">
        {mainRoutes.map((item, idx) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return <MenuItem key={idx} item={item} />;
        })}
      </div>
    </div>
  );
}

const MenuItem = ({ item }: { item: SidebarNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  useEffect(() => {
    if (pathname.includes(item.path ?? "")) {
      setSubMenuOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 px-4 rounded-lg hover-bg-zinc-100 text-sm font-medium w-full justify-between hover:bg-zinc-100 dark:bg-slate-600 ${
              pathname.includes(item.path ?? "") ? "text-primary" : ""
            }`}
          >
            <div className="flex flex-row space-x-2 items-center justify-between text-[16px]">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <ChevronDown height={24} width={24} />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-8 flex flex-col space-y-1">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Button
                    key={idx}
                    asChild
                    variant={subItem.path === pathname ? "secondary" : "ghost"}
                    className={cn("w-full justify-start text-[16px]", {
                      "text-primary": subItem.path === pathname
                    })}
                  >
                    <Link href={subItem.path}>
                      {subItem.icon && (
                        <span className="mr-2">{subItem.icon}</span>
                      )}
                      {subItem.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Button
          asChild
          variant={item.path === pathname ? "secondary" : "ghost"}
          className={cn("mb-1 w-full justify-start text-[16px]", {
            "text-primary": item.path === pathname
          })}
        >
          <Link href={item.path}>
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.title}
          </Link>
        </Button>
      )}
    </div>
  );
};
