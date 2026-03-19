"use client";

import {
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useSuspenseModel } from "../hooks/use-models";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};
export const EditorError = () => {
  return <ErrorView message="Error loading editor..." />;
};

export const ModelEditor = ({
  modelId,
}: {
  modelId: string;
}) => {
  const { data: model } = useSuspenseModel(modelId);

  return (
    <div>
      {JSON.stringify(model)}
    </div>
  );
};
