"use client";
import { AbilityContext } from "@/services/guard/Can";
import ability from "@/services/guard/ability";
import React from "react";

function AbilityProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    </>
  );
}

export default AbilityProvider;
