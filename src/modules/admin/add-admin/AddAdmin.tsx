"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BreadCrumb from "@/components/BreadCrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CreateAdminForm } from "@/components/forms/admin/create-admin-form";

const breadcrumbItems = [
  { title: "Admins", link: "/admin" },
  { title: "New Admin", link: "/admin/create" }
];
export default function AddAdmin() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Add New Admin`}
            description="Create a new admin user."
          />
        </div>
        <Separator />

        <Card>
          <CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
          <CardContent>
            <CreateAdminForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
