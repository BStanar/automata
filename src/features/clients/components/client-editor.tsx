"use client";

import { EntityContainer, ErrorView, LoadingView } from "@/components/entity-components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact2Icon, MicroscopeIcon } from "lucide-react";
import { useSuspenseClient } from "../hooks/use-clients";

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
  
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account"><MicroscopeIcon/>Models</TabsTrigger>
        <TabsTrigger value="contacts"><Contact2Icon/>Contacts</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="contacts">
          
      </TabsContent>
    </Tabs>  );
};
