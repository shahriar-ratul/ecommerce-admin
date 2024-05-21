import { type SidebarNavItem } from "@/types";
import { Folder, LayoutDashboard, User } from "lucide-react";

export const mainRoutes: SidebarNavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <LayoutDashboard width="20" height="20" />
  },
  {
    title: "Sales",
    path: "/sales",
    icon: <Folder width="20" height="20" />,
    submenu: true,
    subMenuItems: [
      { title: "Orders", path: "/sales/orders" },
      { title: "Shipments", path: "/sales/shipments" },
      { title: "Invoices", path: "/sales/invoices" },
      { title: "Refunds", path: "/sales/refunds" },
      { title: "Transactions", path: "/sales/transactions" }
    ]
  },
  {
    title: "Catalog",
    path: "/catalog",
    icon: <Folder width="20" height="20" />,
    submenu: true,
    subMenuItems: [
      { title: "products", path: "/catalog/products" },
      { title: "categories", path: "/catalog/categories" },
      { title: "Attributes", path: "/catalog/attributes" },
      { title: "Manufacturers", path: "/catalog/manufacturers" },
      { title: "Vendors", path: "/catalog/vendors" }
    ]
  },

  {
    title: "Customers",
    path: "/customer",
    icon: <Folder width="20" height="20" />,
    submenu: true,
    subMenuItems: [
      { title: "Customers", path: "/customer/customers" },
      { title: "Group", path: "/customer/groups" },
      { title: "Reviews", path: "/customer/reviews" }
    ]
  },
  {
    title: "User Management",
    path: "/user",
    icon: <Folder width="20" height="20" />,
    submenu: true,
    subMenuItems: [
      { title: "Admins", path: "/user/admins" },
      { title: "Roles", path: "/user/roles" },
      { title: "Permissions", path: "/user/permissions" }
    ]
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <User width="20" height="20" />
  }
];
