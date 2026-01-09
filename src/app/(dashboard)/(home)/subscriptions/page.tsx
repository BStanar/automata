import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
   await requireAuth();
   return (
      <p>Subscriptions</p>
   )
};

export default Page;