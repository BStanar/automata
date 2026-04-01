"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseContact } from "../hooks/use-contacts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact2Icon, MicroscopeIcon } from "lucide-react";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};
export const EditorError = () => {
  return <ErrorView message="Error loading editor..." />;
};

export const ContactEditor = ({
  contactId,
}: {
  contactId: string;
}) => {
  const { data: contact } = useSuspenseContact(contactId);
  
  return (
    <></>
  );
};
