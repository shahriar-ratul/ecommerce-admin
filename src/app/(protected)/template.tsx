"use client";
import { AbilityContext } from "@/services/guard/Can";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";

function updateAbility(ability: any, permissions: string[]) {
  const { can, rules } = new AbilityBuilder(createMongoAbility);

  if (permissions) {
    for (const permission of permissions) {
      can(permission, "");
    }
  }

  ability.update(rules);
}

const Template = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  const ability = useContext(AbilityContext);

  if (
    session?.data?.user?.permissions &&
    session?.data?.user?.permissions.length > 0
  ) {
    const permissions = session?.data?.user?.permissions;

    updateAbility(ability, permissions);
  }

  return <>{children}</>;
};
export default Template;
