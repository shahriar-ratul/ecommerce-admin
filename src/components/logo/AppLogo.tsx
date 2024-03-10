import Image from "next/image";
import React from "react";

const AppLogo = () => {
  return (
    <div className="flex flex-row cursor-pointer items-center min-h-12 mr-2">
      <Image src="/images/logo.png" alt="logo" height={55} width={100} />
    </div>
  );
};

export default AppLogo;
