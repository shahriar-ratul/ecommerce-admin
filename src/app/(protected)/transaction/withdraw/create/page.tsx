"use client";
import AddAdmin from "@/modules/admin/add-admin/AddAdmin";
import Forbidden from "@/modules/errorPage/Forbidden";
import ability from "@/services/guard/ability";
import React from "react";

export default function Create() {
  return <>{ability.can("admin.create", "") ? <AddAdmin /> : <Forbidden />}</>;
}
