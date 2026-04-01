"use client";

import { EditorHeader } from "@/features/editor/components/editor-header";
import { useSuspenseModel } from "../hooks/use-models";

interface ModelEditorHeaderProps {
  modelId: string;
}

export const ModelEditorHeader = ({ modelId }: ModelEditorHeaderProps) => {
  const { data: model } = useSuspenseModel(modelId);

  const segments = [
    //Fix after db data migration, i the schema manufacturer is conditional.
    { label: "Manufacturers", href: "/manufacturers" },
    ...(model.manufacturer
      ? [
          {
            label: model.manufacturer.name,
            href: `/manufacturers/${model.manufacturer.id}`,
          },
        ]
      : []),
    ...(model.manufacturer
      ? [
          {
            label: "Models",
            href: `/manufacturers/${model.manufacturer.id}/models`,
          },
        ]
      : []),
    { label: model.name },
  ];

  return <EditorHeader segments={segments} />;
};
