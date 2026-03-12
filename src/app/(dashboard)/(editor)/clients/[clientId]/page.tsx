import { EditorError, EditorLoading } from "@/features/editor/components/editor";
import { ClientEditor } from "@/features/clients/components/client-editor";
import { ClientEditorHeader } from "@/features/clients/components/client-editor-header";
import { prefetchClient } from "@/features/clients/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
   params: Promise<{
      clientId: string;
   }>
}


const Page = async ({ params }: PageProps) => {
   await requireAuth();
   const { clientId } = await params;
   prefetchClient(clientId);   
   return (
         <HydrateClient>
            <ErrorBoundary fallback={<EditorError/>}>
               <Suspense fallback={<EditorLoading/>}>
                  <ClientEditorHeader clientId={clientId}/>
                  <main className="flex-1">
                     jedan
                  <ClientEditor  clientId={clientId}/>
                  </main>
               </Suspense>
            </ErrorBoundary>
         </HydrateClient>
   )
};

export default Page;