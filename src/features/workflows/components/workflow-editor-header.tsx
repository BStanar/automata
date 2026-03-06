"use client"

import { EditorHeader } from "@/features/editor/components/editor-header"
import { useSuspenseWorkflow } from "../hooks/use-workflows"

export const WorkflowEditorHeader = ({ workflowId }: {workflowId: string}) => {
   const {data: workflow} = useSuspenseWorkflow(workflowId)
   
   return(
      <EditorHeader model="Workflows" backHref="/workflows" name={workflow.name}/>
   )
}