"use client";

import {
  EntityContainer,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useSuspenseManufacturer } from "../hooks/use-manufacturers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact2Icon, MicroscopeIcon } from "lucide-react";
import {
  ContactsContainer,
  ContactsList,
} from "@/features/contacts/components/contacts";
import { ContactOwnerType } from "@/generated/prisma/enums";
import {
  useInvalidateOwnerContacts,
  useSuspenseContactsByOwner,
} from "@/features/contacts/hooks/use-contacts";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};
export const EditorError = () => {
  return <ErrorView message="Error loading editor..." />;
};

export const ManufacturerEditor = ({
  manufacturerId,
}: {
  manufacturerId: string;
}) => {
  const { data: manufacturer } = useSuspenseManufacturer(manufacturerId);
  const { data: contacts } = useSuspenseContactsByOwner({ manufacturerId });

  const invalidateContacts = useInvalidateOwnerContacts({ manufacturerId });

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">
          <MicroscopeIcon />
          Models
        </TabsTrigger>
        <TabsTrigger value="contacts">
          <Contact2Icon />
          Contacts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="contacts">
        ovdje
        <ContactsContainer
          contactOwnerType={ContactOwnerType.MANUFACTURER}
          manufacturerId={manufacturerId}
          onContactMutated={invalidateContacts}
          embedded
        >
          <div className="max-h-105 overflow-y-auto snap-y snap-mandatory pb-4">
            <ContactsList items={contacts} className="gap-y-0" />
          </div>
        </ContactsContainer>
      </TabsContent>
    </Tabs>
  );
};
