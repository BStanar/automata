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
import { useContactsParams } from "../hooks/use-contacts-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { Contact, ContactOwnerType } from "@/generated/prisma/client";
import { ContactIcon, FactoryIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { ContactFormDialog, ContactFormValues } from "./contact-form-dialog";

interface ContactsListProps {
  items: Contact[];
  className?: string;
}

interface ContactOwnerContext {
  contactOwnerType: ContactOwnerType;
  manufacturerId?: string;
  clientId?: string;
  onContactMutated?: () => void;
}

const ContactOwnerContext = createContext<ContactOwnerContext | null>(null);

const useContactOwner = () => {
  const ctx = useContext(ContactOwnerContext);
  if (!ctx)
    throw new Error(
      "useContactOwner must be used within ContactOwnerContext.Provider",
    );
  return ctx;
};

export const ContactsList = ({ items, className }: ContactsListProps) => {
  return (
    <EntityList
      items={items}
      getKey={(contact) => contact.id}
      renderItem={(contact) => <ContactItem data={contact} />}
      emptyView={<ContactsEmpty />}
      className={className}
    />
  );
};

export const ContactsListConnected = () => {
  const contacts = useSuspenseContacts();
  return <ContactsList items={contacts.data.items} />;
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
  const { contactOwnerType, manufacturerId, clientId, onContactMutated } =
    useContactOwner();
  const [open, setOpen] = useState(false);

  const handleCreate = (values: ContactFormValues) => {
    createContact.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        onContactMutated?.();
      },
    });
  };

  return (
    <>
      <ContactFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        contactOwnerType={contactOwnerType}
        manufacturerId={manufacturerId}
        clientId={clientId}
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

interface ContactsContainerProps {
  children: React.ReactNode;
  contactOwnerType: ContactOwnerType;
  manufacturerId?: string;
  clientId?: string;
  onContactMutated?: () => void;

  embedded?: boolean;
}

export const ContactsContainer = ({
  children,
  contactOwnerType,
  manufacturerId,
  clientId,
  onContactMutated,
  embedded = false,
}: ContactsContainerProps) => {
  return (
    <ContactOwnerContext.Provider
      value={{
        contactOwnerType,
        manufacturerId,
        clientId,
        onContactMutated,
      }}
    >
      <EntityContainer
        header={<ContactsHeader />}
        search={embedded ? null : <ContactsSearch />}
        pagination={embedded ? null : <ContactsPagination />}
      >
        {children}
      </EntityContainer>
    </ContactOwnerContext.Provider>
  );
};

export const ContactsLoading = () => {
  return <LoadingView message="Loading contacts..." />;
};
export const ContactsError = () => {
  return <ErrorView message="Error loading contacts..." />;
};
export const ContactsEmpty = ({}) => {
  const createContact = useCreateContact();
  const { contactOwnerType, manufacturerId, clientId, onContactMutated } =
    useContactOwner();
  const [open, setOpen] = useState(false);

  const handleCreate = (values: ContactFormValues) => {
    createContact.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        onContactMutated?.();
      },
    });
  };

  return (
    <>
      <ContactFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        contactOwnerType={contactOwnerType}
        manufacturerId={manufacturerId}
        clientId={clientId}
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
  const { onContactMutated } = useContactOwner();
  const [open, setOpen] = useState(false);

  return (
    <div className="snap-start">
      <ContactFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={() => {}}
        defaultValues={{
          ...data,
          telephoneNumberSecondary: data.telephoneNumberSecondary ?? undefined,
          clientId: data.clientId ?? undefined,
          manufacturerId: data.manufacturerId ?? undefined,
        }}
        contactOwnerType={data.ownerType}
        manufacturerId={data.manufacturerId ?? undefined}
        clientId={data.clientId ?? undefined}
        mode="view"
      />
      <EntityItem
        onClick={() => setOpen(true)}
        title={`${data.firstName} ${data.lastName}`}
        subtitle={
          <>
            tel: {data.telephoneNumber} <br /> email {data.email}
          </>
        }
        image={
          <div className="size-8 flex items-center justify-center">
            <ContactIcon className="size-8 text-muted-foreground" />
          </div>
        }
        onRemove={() =>
          removeContact.mutate(
            { id: data.id },
            { onSuccess: () => onContactMutated?.() },
          )
        }
        isRemoving={removeContact.isPending}
      />
    </div>
  );
};
