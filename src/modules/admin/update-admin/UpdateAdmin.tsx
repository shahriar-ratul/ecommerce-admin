/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumb from "@/components/BreadCrumb";
import { UpdateAdminForm } from "@/components/forms/admin/update-admin-form";
import Loader from "@/components/loader/loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { type AdminModel } from "@/schema/AdminSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const breadcrumbItems = [
  { title: "Admins", link: "/user/admins" },
  { title: "Update", link: "/user/admins/update" }
];
export default function UpdateAdmin({ id }: any) {
  const session = useSession();

  const [item, SetItem] = useState<AdminModel | null>(null);
  const fetchData = async () => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${session.data?.user.accessToken}`;

    const { data } = await axios.get(`/api/v1/admins/${id}`);
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["admins-list", id],
    queryFn: async () => {
      const { data } = await fetchData();

      SetItem(data.data as AdminModel);

      return true;
    }
  });

  return (
    <>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title={`User Update`} description="update" />
          </div>
          <Separator />

          {isError ? (
            <div className="text-red-600 text-center font-bold">
              {error?.message}
            </div>
          ) : null}
          <Card>
            <CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
            <CardContent>
              {item && (
                <>
                  <UpdateAdminForm item={item} />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
