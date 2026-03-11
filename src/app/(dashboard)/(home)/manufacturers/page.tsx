import { manufacturersParamsLoader } from "@/features/manufacturers/server/params-loader";
import {
  ManufacturersContainer,
  ManufacturersList,
  ManufacturersLoading,
  ManufacturersError,
} from "@/features/manufacturers/components/manufacturers";
import { prefetchManufacturers } from "@/features/manufacturers/server/prefetch";
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

  const params = await manufacturersParamsLoader(searchParams);
  await prefetchManufacturers(params);

  return (
    <HydrateClient>
      <ManufacturersContainer>
        <ErrorBoundary fallback={<ManufacturersError />}>
          <Suspense fallback={<ManufacturersLoading />}>
            <ManufacturersList />
          </Suspense>
        </ErrorBoundary>
      </ManufacturersContainer>
    </HydrateClient>
  );
};

export default Page;
