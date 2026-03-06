"use client";

import { EntityContainer, ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseManufacturer } from "../hooks/use-manufacturers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact2Icon, MicroscopeIcon } from "lucide-react";

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
