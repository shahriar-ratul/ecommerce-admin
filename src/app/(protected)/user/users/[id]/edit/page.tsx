"use client";
import AdminList from "@/modules/admin/AdminList";
import Forbidden from "@/modules/errorPage/Forbidden";
import ability from "@/services/guard/ability";
import React from "react";

export default function Dashboard() {
  return <>{ability.can("admin.view", "") ? <AdminList /> : <Forbidden />}</>;
}
