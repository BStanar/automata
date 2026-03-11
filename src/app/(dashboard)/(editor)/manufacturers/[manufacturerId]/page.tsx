import { EditorError, EditorLoading } from "@/features/editor/components/editor";
import { ManufacturerEditor } from "@/features/manufacturers/components/manufacturer-editor";
import { ManufacturerEditorHeader } from "@/features/manufacturers/components/manufacturer-editor-header";
import { prefetchManufacturer } from "@/features/manufacturers/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
   params: Promise<{
      manufacturerId: string;
   }>
}


const Page = async ({ params }: PageProps) => {
   await requireAuth();
   const { manufacturerId } = await params;
   await prefetchManufacturer(manufacturerId);   
   return (
         <HydrateClient>
            <ErrorBoundary fallback={<EditorError/>}>
               <Suspense fallback={<EditorLoading/>}>
                  <ManufacturerEditorHeader manufacturerId={manufacturerId}/>
                  <main className="flex-1">
                  <ManufacturerEditor  manufacturerId={manufacturerId}/>
                  </main>
               </Suspense>
            </ErrorBoundary>
         </HydrateClient>
   )
};

export default Page;