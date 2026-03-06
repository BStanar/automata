"use client";
import {
  useCreateContact,
  useRemoveContact,
  useSuspenseContacts,
} from "../hooks/use-contacts";
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
import { useRouter } from "next/navigation";
import { useContactsParams } from "../hooks/use-contacts-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { Contact } from "@/generated/prisma/client";
import { FactoryIcon } from "lucide-react";
import { useState } from "react";
import { ContactFormDialog, ContactFormValues } from "./contact-form-dialog";

export const ContactsList = () => {
  const contacts = useSuspenseContacts();
  return (
    <EntityList
      items={contacts.data.items}
      getKey={(contact) => contact.id}
      renderItem={(contact) => <ContactItem data={contact} />}
      emptyView={<ContactsEmpty />}
    />
  );
};

export const ContactsSearch = () => {
  const [params, setParams] = useContactsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search contacts"
    />
  );
};

export const ContactsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createContact = useCreateContact();
  const router = useRouter();

  const [open, setOpen] = useState(false);

const handleCreate = (values: ContactFormValues) => {
    createContact.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        router.push(`/contacts/${data.id}`);
      },
    });
  };

  return (
    <>
      <ContactFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
      />
      <EntityHeader
        title="Contacts"
        description="Create and manage your contacts"
        onNew={() => setOpen(true)}
        newButtonLabel="New contact"
        disabled={disabled}
        isCreating={createContact.isPending}
      />
    </>
  );
};

export const ContactsPagination = () => {
  const contacts = useSuspenseContacts();
  const [params, setParams] = useContactsParams();

  return (
    <EntityPagination
      disabled={contacts.isFetching}
      totalPages={contacts.data.totalPages}
      page={contacts.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ContactsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ContactsHeader />}
      search={<ContactsSearch />}
      pagination={<ContactsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ContactsLoading = () => {
  return <LoadingView message="Loading contacts..." />;
};
export const ContactsError = () => {
  return <ErrorView message="Error loading contacts..." />;
};
export const ContactsEmpty = () => {
  const createContact = useCreateContact();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleCreate = (values: ContactFormValues) => {
    createContact.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        router.push(`/contacts/${data.id}`);
      },
    });
  };

  return (
    <>
      
      <ContactFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
      />
      <EmptyView
        onNew={() => setOpen(true)}
        message="No contacts found. Get started by creating your first contact"
      />
    </>
  );
};
export const ContactItem = ({ data }: { data: Contact }) => {
  const removeContact = useRemoveContact();

  const handleRemove = () => {
    removeContact.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/contacts/${data.id}`}
      title={data.firstName}
      subtitle={<>Updated &bull; Created </>}
      image={
        <div className="size-8 flex items-center justify-center">
          <FactoryIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeContact.isPending}
    />
  );
};
