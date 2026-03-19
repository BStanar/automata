"use client";

import { EntityContainer, ErrorView, LoadingView } from "@/components/entity-components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact2Icon, MicroscopeIcon } from "lucide-react";
import { useSuspenseClient } from "../hooks/use-clients";
import { ContactsContainer, ContactsList } from "@/features/contacts/components/contacts";
import { useInvalidateOwnerContacts, useSuspenseContactsByOwner } from "@/features/contacts/hooks/use-contacts";
import { ContactOwnerType } from "@/generated/prisma/enums";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};
export const EditorError = () => {
  return <ErrorView message="Error loading editor..." />;
};

export const ClientEditor = ({
  clientId,
}: {
  clientId: string;
}) => {
  const { data: client } = useSuspenseClient(clientId);
    const { data: contacts } = useSuspenseContactsByOwner({ clientId });
  
    const invalidateContacts = useInvalidateOwnerContacts({ clientId });
  
  return (
    <Tabs defaultValue="devices" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="devices"><MicroscopeIcon/>Devices</TabsTrigger>
        <TabsTrigger value="contacts"><Contact2Icon/>Contacts</TabsTrigger>
      </TabsList>
      <TabsContent value="devices">
        Manage clients devices
      </TabsContent>
      <TabsContent value="contacts">
          <ContactsContainer
                    contactOwnerType={ContactOwnerType.CLIENT}
                    clientId={clientId}
                    onContactMutated={invalidateContacts}
                    embedded
                  >
                    <div className="max-h-105 overflow-y-auto snap-y snap-mandatory">
                      <ContactsList items={contacts} className="gap-y-0" />
                    </div>
                  </ContactsContainer>
      </TabsContent>
    </Tabs>  );
};
