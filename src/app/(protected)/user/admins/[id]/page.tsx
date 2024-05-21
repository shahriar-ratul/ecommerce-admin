"use client";
import DetailsAdmin from "@/modules/admin/details-admin/DetailsAdmin";
import Forbidden from "@/modules/errorPage/Forbidden";
import ability from "@/services/guard/ability";
import React from "react";

export default function DetailsAdminPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <>
      {ability.can("admin.view", "") ? (
        <DetailsAdmin id={params.id} />
      ) : (
        <Forbidden />
      )}
    </>
  );
}
