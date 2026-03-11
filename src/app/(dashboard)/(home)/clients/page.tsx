import { clientsParamsLoader } from "@/features/clients/server/params-loader";
import {
  ClientsContainer,
  ClientsList,
  ClientsLoading,
  ClientsError,
} from "@/features/clients/components/clients";
import { prefetchClients } from "@/features/clients/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await clientsParamsLoader(searchParams);
  prefetchClients(params);

  return (
    <HydrateClient>
      <ClientsContainer>
        <ErrorBoundary fallback={<ClientsError />}>
          <Suspense fallback={<ClientsLoading />}>
            <ClientsList />
          </Suspense>
        </ErrorBoundary>
      </ClientsContainer>
    </HydrateClient>
  );
};

export default Page;
