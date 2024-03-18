"use client";
import Forbidden from "@/modules/errorPage/Forbidden";
import DetailsUser from "@/modules/user/details/DetailsUser";
import ability from "@/services/guard/ability";
import React from "react";

export default function DetailsUserPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <>
      {ability.can("user.view", "") ? (
        <DetailsUser id={params.id} />
      ) : (
        <Forbidden />
      )}
    </>
  );
}
