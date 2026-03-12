"use client";
import {
  useRemoveClient,
  useSuspenseClients,
} from "../hooks/use-clients";
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
import { useClientsParams } from "../hooks/use-clients-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { Client } from "@/generated/prisma/client";
import { FactoryIcon } from "lucide-react";
import { useState } from "react";
import {
  ClientFormDialog,
} from "./client-form-dialog";
import { useCreateClientRedirect } from "../hooks/use-clients-create";

export const ClientsList = () => {
  const clients = useSuspenseClients();
  return (
    <EntityList
      items={clients.data.items}
      getKey={(client) => client.id}
      renderItem={(client) => <ClientItem data={client} />}
      emptyView={<ClientsEmpty />}
    />
  );
};

export const ClientsSearch = () => {
  const [params, setParams] = useClientsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search clients"
    />
  );
};

export const ClientsHeader = ({ disabled }: { disabled?: boolean }) => {
 
  const [open, setOpen] = useState(false);
  const { handleCreate, isPending } = useCreateClientRedirect();

  return (
    <>
      <ClientFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
      />
      <EntityHeader
        title="Clients"
        description="Create and manage your clients"
        onNew={() => setOpen(true)}
        newButtonLabel="New client"
        disabled={disabled}
        isCreating={isPending}
      />
    </>
  );
};

export const ClientsPagination = () => {
  const clients = useSuspenseClients();
  const [params, setParams] = useClientsParams();

  return (
    <EntityPagination
      disabled={clients.isFetching}
      totalPages={clients.data.totalPages}
      page={clients.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ClientsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ClientsHeader />}
      search={<ClientsSearch />}
      pagination={<ClientsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ClientsLoading = () => {
  return <LoadingView message="Loading clients..." />;
};
export const ClientsError = () => {
  return <ErrorView message="Error loading clients..." />;
};
export const ClientsEmpty = () => {

  const [open, setOpen] = useState(false);
  const { handleCreate } = useCreateClientRedirect();

  return (
    <>
      <ClientFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
      />
      <EmptyView
        onNew={() => setOpen(true)}
        message="No clients found. Get started by creating your first client"
      />
    </>
  );
};
export const ClientItem = ({ data }: { data: Client }) => {
  const removeClient = useRemoveClient();

  const handleRemove = () => {
    removeClient.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/clients/${data.id}`}
      title={data.name}
      subtitle={data.streetAddress}
      image={
        <div className="size-8 flex items-center justify-center">
          <FactoryIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeClient.isPending}
    />
  );
};
