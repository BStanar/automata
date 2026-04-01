"use client";

import { EditorHeader } from "@/features/editor/components/editor-header";
import { useSuspenseManufacturer } from "../hooks/use-manufacturers";

export const ManufacturerEditorHeader = ({
  manufacturerId,
}: {
  manufacturerId: string;
}) => {
  const { data: manufacturer } = useSuspenseManufacturer(manufacturerId);
  const segments = [
    //Fix after db data migration, i the schema manufacturer is conditional.

    { label: "Manufacturers", href: "/manufacturers" },
    { label: manufacturer.name, href: manufacturer.id },
  ];
  return <EditorHeader segments={segments} />;
};
