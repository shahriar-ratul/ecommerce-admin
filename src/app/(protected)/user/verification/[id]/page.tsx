"use client";
import Forbidden from "@/modules/errorPage/Forbidden";
import DetailsVerification from "@/modules/verification/details/DetailsVerification";
import ability from "@/services/guard/ability";
import React from "react";

export default function DetailsVerifyPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <>
      {ability.can("user.view", "") ? (
        <DetailsVerification id={params.id} />
      ) : (
        <Forbidden />
      )}
    </>
  );
}
