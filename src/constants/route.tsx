import { type SidebarNavItem } from "@/types";
import { Folder, LayoutDashboard, User, UserCog } from "lucide-react";

export const mainRoutes: SidebarNavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <LayoutDashboard width="20" height="20" />
  },
  {
    title: "Transactions",
    path: "/transaction",
    icon: <Folder width="20" height="20" />,
    submenu: true,
    subMenuItems: [
      { title: "User Wallet", path: "/transaction/wallet" },
      { title: "Withdraw", path: "/transaction/withdraw" },
      { title: "Transaction", path: "/transaction/transactions" },
      { title: "Pending Withdraw", path: "/transaction/pending-withdraw" }
    ]
  },

  {
    title: "User Management",
    path: "/user",
    icon: <Folder width="20" height="20" />,
    submenu: true,
    subMenuItems: [
      { title: "Users", path: "/user/users" },
      { title: "Pending ID Verification", path: "/user/verification" }
    ]
  },
  {
    title: "Admins",
    path: "/admin",
    icon: <UserCog width="20" height="20" />
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <User width="20" height="20" />
  }
];
