"use client";
import UpdateAdmin from "@/modules/admin/update-admin/UpdateAdmin";
import Forbidden from "@/modules/errorPage/Forbidden";
import ability from "@/services/guard/ability";
import React from "react";

export default function UpdateAdminPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <>
      {ability.can("admin.view", "") ? (
        <UpdateAdmin id={params.id} />
      ) : (
        <Forbidden />
      )}
    </>
  );
}
