import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { WorkflowEditor } from "@/features/workflows/components/workflow-editor";
import { WorkflowEditorHeader } from "@/features/workflows/components/workflow-editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
   params: Promise<{
      workflowId: string;
   }>
}

const Page = async ({ params }: PageProps) => {
   await requireAuth();
   const { workflowId } = await params;
   prefetchWorkflow(workflowId);
   
   return (
      <HydrateClient>
         <ErrorBoundary fallback={<EditorError/>}>
            <Suspense fallback={<EditorLoading/>}>
               <WorkflowEditorHeader workflowId={workflowId}/>
               <main className="flex-1">
                  <WorkflowEditor workflowId={workflowId}/>
               </main>
            </Suspense>
         </ErrorBoundary>
      </HydrateClient>
   )
};

export default Page;