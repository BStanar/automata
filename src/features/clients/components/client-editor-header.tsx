"use client"

import { EditorHeader } from "@/features/editor/components/editor-header"
import { useSuspenseClient } from "../hooks/use-clients"

export const ClientEditorHeader = ({ clientId }: {clientId: string}) => {
   const {data: client} = useSuspenseClient(clientId)
     const segments = [
    { label: "Clients", href: "/clients" },
    { label: client.name }, 
  ];
   return(
      <EditorHeader segments={segments}/>
   )
}