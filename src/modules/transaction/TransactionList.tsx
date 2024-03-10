"use client";
import Forbidden from "@/modules/errorPage/Forbidden";
import ability from "@/services/guard/ability";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import BreadCrumb from "@/components/BreadCrumb";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TransactionTable from "./transacton-list/transaction-table";

const breadcrumbItems = [{ title: "Admin", link: "/dashboard/admin" }];
export default function TransactionList() {
  return (
    <>
      {ability.can("admin.view", "") ? (
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading
              title={`Transaction List`}
              description="Manage (Server side table functionalities.)"
            />

            <Link
              href={"/transaction/transactions/create"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          <Separator />

          <Card>
            <CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
            <CardContent>
              <TransactionTable />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Forbidden />
      )}
    </>
  );
}
