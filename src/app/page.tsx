"use client"

import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { create } from "domain";

const Page = () => {
   //await requireAuth();

   const trpc = useTRPC();

   //const data = await caller.getUsers();
   const testAi = useMutation(trpc.testAi.mutationOptions())

   return (
      <div className=" min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
         Protected server component
         <div>
            <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
               Test AI
            </Button>
         </div>
        <LogoutButton/>
      </div>
   )
};

export default Page;