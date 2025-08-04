import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@auth";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";
import { Button } from "../ui/button";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <section className="max-sm:hidden top-0 left-0 sticky flex flex-col justify-between shadow-light-300 dark:shadow-none p-6 pt-36 light-border border-r lg:w-[266px] h-screen overflow-y-auto custom-scrollbar background-light900_dark200">
      <div className="flex flex-col flex-1 gap-6">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-3">
        {userId ? (
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button
              type="submit"
              className="!bg-transparent px-4 py-3 w-fit base-medium"
            >
              <LogOut className="size-5 text-black dark:text-white" />
              <span className="max-lg:hidden text-dark300_light900">
                Logout
              </span>
            </Button>
          </form>
        ) : (
          <>
            <Button
              className="shadow-none px-4 py-3 rounded-lg w-full min-h-[41px] small-medium btn-secondary"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="lg:hidden invert-colors"
                />
                <span className="max-lg:hidden primary-text-gradient">
                  Log In
                </span>
              </Link>
            </Button>

            <Button
              className="shadow-none px-4 py-3 border light-border-2 rounded-lg w-full min-h-[41px] text-dark400_light900 small-medium btn-tertiary"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <Image
                  src="/icons/sign-up.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="lg:hidden invert-colors"
                />
                <span className="max-lg:hidden">Sign Up</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default LeftSidebar;
