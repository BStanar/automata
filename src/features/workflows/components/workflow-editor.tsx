"use client"

import { useSuspenseWorkflow } from "../hooks/use-workflows";

export const WorkflowEditor = ({workflowId}: {workflowId: string}) => {
   const {data: workflow} = useSuspenseWorkflow(workflowId);
   
   return(
      <pre>
         {JSON.stringify(workflow, null, 2)}
      </pre>
   );}