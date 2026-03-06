import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { WorkflowEditorHeader } from "@/features/workflows/components/workflow-editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
   params: Promise<{
      workorderId: string;
   }>
}

const Page = async ({ params }: PageProps) => {
   await requireAuth();
   const { workorderId } = await params;
   prefetchWorkflow(workorderId);
   
   return (
      <HydrateClient>
         <ErrorBoundary fallback={<EditorError/>}>
            <Suspense fallback={<EditorLoading/>}>
               <WorkflowEditorHeader workflowId={workorderId}/>
               <main className="flex-1">
                  <Editor workflowId={workorderId}/>
               </main>
            </Suspense>
         </ErrorBoundary>
      </HydrateClient>
   )
};

export default Page;