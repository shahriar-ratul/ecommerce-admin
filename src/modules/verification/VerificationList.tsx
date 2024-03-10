"use client";
import Forbidden from "@/modules/errorPage/Forbidden";
import ability from "@/services/guard/ability";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BreadCrumb from "@/components/BreadCrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import VerificationTable from "./verification-list/verification-table";

const breadcrumbItems = [{ title: "User", link: "/user/verification" }];
export default function VerificationList() {
  return (
    <>
      {ability.can("user.view", "") ? (
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading
              title={`Pending Verification List`}
              description="Manage (Server side table functionalities.)"
            />
          </div>
          <Separator />

          <Card>
            <CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
            <CardContent>
              <VerificationTable />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Forbidden />
      )}
    </>
  );
}
