"use client";
import Forbidden from "@/modules/errorPage/Forbidden";
import UserProfile from "@/modules/user/details/UserProfile";
import ability from "@/services/guard/ability";
import { useSession } from "next-auth/react";
import React from "react";

export default function ProfilePage() {
  const session = useSession();

  return (
    <>
      {ability.can("user.view", "") ? (
        <UserProfile id={session.data?.user.id} />
      ) : (
        <Forbidden />
      )}
    </>
  );
}
