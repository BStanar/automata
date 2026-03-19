"use client";
import {
  useCreateModel,
  useRemoveModel,
  useSuspenseModels,
  useSuspenseModelsByOwner,
} from "../hooks/use-models";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useModelsParams } from "../hooks/use-models-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { Model } from "@/generated/prisma/client";
import { FactoryIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { ModelFormDialog, ModelFormValues } from "./model-form-dialog";
import {
  useCreateModelInline,
  useCreateModelRedirect,
} from "../hooks/use-models-create";

interface ModelsListProps {
  items: Model[];
  className?: string;
}

interface ModelOwnerContext {
  manufacturerId?: string;
  onModelMutated?: () => void;
}

const ModelOwnerContext = createContext<ModelOwnerContext | null>(null);

const useModelOwner = () => {
  const ctx = useContext(ModelOwnerContext);
  return ctx ?? { manufacturerId: undefined, onModelMutated: undefined };
};

export const ModelsList = ({ items, className }: ModelsListProps) => {
  return (
    <EntityList
      items={items}
      getKey={(model) => model.id}
      renderItem={(model) => <ModelItem data={model} />}
      emptyView={<ModelsEmpty />}
    />
  );
};

export const ModelsSearch = () => {
  const [params, setParams] = useModelsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search models"
    />
  );
};

export const ModelsHeader = ({ disabled }: { disabled?: boolean }) => {
  const [open, setOpen] = useState(false);
  const { manufacturerId, onModelMutated } = useModelOwner();

  const { handleCreate, isPending } = useCreateModelInline(() => {
    setOpen(false);
    onModelMutated?.();
  });

  return (
    <>
      <ModelFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        manufacturerId={manufacturerId}
      />
      <EntityHeader
        title="Models"
        description="Create and manage your models"
        onNew={() => setOpen(true)}
        newButtonLabel="New model"
        disabled={disabled}
        isCreating={isPending}
      />
    </>
  );
};

export const ModelsPagination = () => {
  const models = useSuspenseModels();
  const [params, setParams] = useModelsParams();

  return (
    <EntityPagination
      disabled={models.isFetching}
      totalPages={models.data.totalPages}
      page={models.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

interface ModelsContainerProps {
  children: React.ReactNode;
  manufacturerId?: string;
  onModelMutated?: () => void;
  embedded?: boolean;
}

export const ModelsContainer = ({
  children,
  manufacturerId,
  onModelMutated,
  embedded = false,
}: ModelsContainerProps) => {
  return (
    <ModelOwnerContext.Provider
      value={{ manufacturerId, onModelMutated: onModelMutated }}
    >
      <EntityContainer
        header={<ModelsHeader />}
        search={embedded ? null : <ModelsSearch />} 
        pagination={embedded ? null : <ModelsPagination />}
      >
        {children}
      </EntityContainer>
    </ModelOwnerContext.Provider>
  );
};

export const ModelsLoading = () => {
  return <LoadingView message="Loading models..." />;
};
export const ModelsError = () => {
  return <ErrorView message="Error loading models..." />;
};
export const ModelsEmpty = () => {
  const [open, setOpen] = useState(false);
  const { manufacturerId, onModelMutated } = useModelOwner();

  const { handleCreate, isPending } = useCreateModelInline(() => {
    setOpen(false);
    onModelMutated?.();
  });

  return (
    <>
      <ModelFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        manufacturerId={manufacturerId}
      />
      <EmptyView
        onNew={() => setOpen(true)}
        message="No models found. Get started by creating your first model"
      />
    </>
  );
};
export const ModelItem = ({ data }: { data: Model }) => {
  const removeModel = useRemoveModel();

  const handleRemove = () => {
    removeModel.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/manufacturers/${data.manufacturerId}/models/${data.id}`}
      title={data.name}
      subtitle={data.description}
      image={
        <div className="size-8 flex items-center justify-center">
          <FactoryIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeModel.isPending}
    />
  );
};
