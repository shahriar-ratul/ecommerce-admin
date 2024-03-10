"use client";
import Forbidden from "@/modules/errorPage/Forbidden";
import AddTransaction from "@/modules/transaction/add-transaction/AddTransaction";
import ability from "@/services/guard/ability";
import React from "react";

export default function Create() {
  return (
    <>{ability.can("admin.create", "") ? <AddTransaction /> : <Forbidden />}</>
  );
}
