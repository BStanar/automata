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
import {
  ModelsContainer,
  ModelsList,
} from "@/features/models/components/models";
import {
  useInvalidateOwnerModels,
  useSuspenseModelsByOwner,
} from "@/features/models/hooks/use-models";

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
  const { data: models } = useSuspenseModelsByOwner({ manufacturerId });

  const invalidateContacts = useInvalidateOwnerContacts({ manufacturerId });
  const invalidateModels = useInvalidateOwnerModels({ manufacturerId });

  return (
    <div className="flex justify-center h-full">
      <Tabs defaultValue="models" className="w-7xl">
        <TabsList>
          <TabsTrigger value="models">
            <MicroscopeIcon />
            Models
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Contact2Icon />
            Contacts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="models">
          <ModelsContainer
            manufacturerId= {manufacturerId}
            onModelMutated= {invalidateModels}
            embedded = {true}
          >
            <ModelsList items={models} />
          </ModelsContainer>
        </TabsContent>
        <TabsContent value="contacts">
          <ContactsContainer
            contactOwnerType={ContactOwnerType.MANUFACTURER}
            manufacturerId={manufacturerId}
            onContactMutated={invalidateContacts}
            embedded
          >
            <div className="overflow-y-auto snap-y snap-mandatory pb-4">
              <ContactsList items={contacts} className="gap-y-0" />
            </div>
          </ContactsContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};
