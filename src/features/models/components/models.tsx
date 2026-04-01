"use client";
import {
  useCreateModel,
  useRemoveModel,
  useSuspenseModels,
  useSuspenseModelsByOwner,
} from "../hooks/use-models";
import {
  EmptyView,
  EntityCardAction,
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
import { Model, RegulatoryStatus } from "@/generated/prisma/client";
import { FactoryIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { ModelFormDialog, ModelFormValues } from "./model-form-dialog";
import {
  useCreateModelInline,
  useCreateModelRedirect,
  useUpdateModelInline,
} from "../hooks/use-models-create";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

export const ModelsCardList = ({ items, className }: ModelsListProps) => {
  return (
    <EntityList
      items={items}
      getKey={(model) => model.id}
      renderItem={(model) => <ModelItem data={model} />}
      emptyView={<ModelsEmpty />}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
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

  const { onModelMutated } = useModelOwner();
  const [editOpen, setEditOpen] = useState(false);

  const handleRemove = () => {
    removeModel.mutate({ id: data.id });
  };
  const { handleUpdate, isPending } = useUpdateModelInline(data.id, () => {
    setEditOpen(false);
    onModelMutated?.();
  });

  return (
    <>
      <ModelFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        defaultValues={{
          name: data.name,
          description: data.description ?? undefined,
          regulatoryStatus: data.regulatoryStatus ?? undefined,
          endOfSaleDate: data.endOfSaleDate ?? undefined,
          endOfSupportDate: data.endOfSupportDate ?? undefined,
          manufacturerId: data.manufacturerId ?? undefined,
        }}
        manufacturerId={data.manufacturerId ?? undefined}
        mode="edit"
      />
      <EntityItem
        href={`/manufacturers/${data.manufacturerId}/models/${data.id}`}
        title={data.name}
        subtitle={data.description}
        image={
          <div className="size-8 flex items-center justify-center">
            <FactoryIcon className="size-5 text-muted-foreground" />
          </div>
        }
        onRemove={() => removeModel.mutate({ id: data.id }, { onSuccess: () => onModelMutated?.() })}
        onEdit={() => setEditOpen(true)}
        isRemoving={removeModel.isPending}
      />
    </>
  );
};
