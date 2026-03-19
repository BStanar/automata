"use client";

import { EditorHeader } from "@/features/editor/components/editor-header";
import { useSuspenseWorkflow } from "../hooks/use-workflows";

export const WorkflowEditorHeader = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const segments = [
    { label: "Workflows", href: "/workflows" },
    { label: workflow.name }, // Current page, no href
  ];

  return (
    <EditorHeader
      segments={segments}
    />
  );
};
