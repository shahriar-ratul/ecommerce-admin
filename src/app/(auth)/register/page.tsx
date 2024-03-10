import { Suspense } from "react";

import { type Metadata } from "next";
import RegisterComponent from "@/modules/auth/register-component";

export const metadata: Metadata = {
  title: "Register",
  description: "Login to your account"
};

export default function LoginPage() {
  return (
    <>
      <Suspense fallback="Loading...">
        <div className="min-h-screen  text-gray-900 flex justify-center">
          <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex flex-1">
            <div className="w-full p-4 sm:p-12">
              <RegisterComponent />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
