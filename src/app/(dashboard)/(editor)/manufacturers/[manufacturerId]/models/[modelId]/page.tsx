import { EditorError, EditorLoading } from "@/features/editor/components/editor";
import { ManufacturerEditor } from "@/features/manufacturers/components/manufacturer-editor";
import { ManufacturerEditorHeader } from "@/features/manufacturers/components/manufacturer-editor-header";
import { prefetchManufacturer, prefetchManufacturerContacts } from "@/features/manufacturers/server/prefetch";
import { ModelEditor } from "@/features/models/components/model-editor";
import { ModelEditorHeader } from "@/features/models/components/model-editor-header";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
   params: Promise<{
      manufacturerId: string;
      modelId: string;
   }>
}


const Page = async ({ params }: PageProps) => {
   await requireAuth();
   const { modelId } = await params;
   return (
         <HydrateClient>
            <ErrorBoundary fallback={<EditorError/>}>
               <Suspense fallback={<EditorLoading/>}>
                  <ModelEditorHeader  modelId={modelId}/>
                  <main className="flex-1">
                  <ModelEditor  modelId={modelId}/>
                  </main>
               </Suspense>
            </ErrorBoundary>
         </HydrateClient>
   )
};

export default Page;