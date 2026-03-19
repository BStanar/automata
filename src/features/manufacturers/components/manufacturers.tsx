"use client";
import {
  useRemoveManufacturer,
  useSuspenseManufacturers,
} from "../hooks/use-manufacturers";
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
import { useManufacturersParams } from "../hooks/use-manufacturers-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { Manufacturer } from "@/generated/prisma/client";
import { FactoryIcon } from "lucide-react";
import { useState } from "react";
import {
  ManufacturerFormDialog,
} from "./manufacturer-form-dialog";
import { useCreateManufacturerRedirect } from "../hooks/use-manufacturers-create";

export const ManufacturersList = () => {
  const manufacturers = useSuspenseManufacturers();
  return (
    <EntityList
      items={manufacturers.data.items}
      getKey={(manufacturer) => manufacturer.id}
      renderItem={(manufacturer) => <ManufacturerItem data={manufacturer} />}
      emptyView={<ManufacturersEmpty />}
    />
  );
};

export const ManufacturersSearch = () => {
  const [params, setParams] = useManufacturersParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search manufacturers"
    />
  );
};

export const ManufacturersHeader = ({ disabled }: { disabled?: boolean }) => {
 
  const [open, setOpen] = useState(false);
  const { handleCreate, isPending } = useCreateManufacturerRedirect();

  return (
    <>
      <ManufacturerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
      />
      <EntityHeader
        title="Manufacturers"
        description="Create and manage your manufacturers"
        onNew={() => setOpen(true)}
        newButtonLabel="New manufacturer"
        disabled={disabled}
        isCreating={isPending}
      />
    </>
  );
};

export const ManufacturersPagination = () => {
  const manufacturers = useSuspenseManufacturers();
  const [params, setParams] = useManufacturersParams();

  return (
    <EntityPagination
      disabled={manufacturers.isFetching}
      totalPages={manufacturers.data.totalPages}
      page={manufacturers.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ManufacturersContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ManufacturersHeader />}
      search={<ManufacturersSearch />}
      pagination={<ManufacturersPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ManufacturersLoading = () => {
  return <LoadingView message="Loading manufacturers..." />;
};
export const ManufacturersError = () => {
  return <ErrorView message="Error loading manufacturers..." />;
};
export const ManufacturersEmpty = () => {

  const [open, setOpen] = useState(false);
  const { handleCreate } = useCreateManufacturerRedirect();

  return (
    <>
      <ManufacturerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
      />
      <EmptyView
        onNew={() => setOpen(true)}
        message="No manufacturers found. Get started by creating your first manufacturer"
      />
    </>
  );
};
export const ManufacturerItem = ({ data }: { data: Manufacturer }) => {
  const removeManufacturer = useRemoveManufacturer();

  const handleRemove = () => {
    removeManufacturer.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/manufacturers/${data.id}`}
      title={data.name}
      subtitle={data.description}
      image={
        <div className="size-8 flex items-center justify-center">
          <FactoryIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeManufacturer.isPending}
    />
  );
};
