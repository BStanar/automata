"use client"

import { EditorHeader } from "@/features/editor/components/editor-header"
import { useSuspenseClient } from "../hooks/use-clients"

export const ClientEditorHeader = ({ clientId }: {clientId: string}) => {
   const {data: client} = useSuspenseClient(clientId)
   
   return(
      <EditorHeader model="Clients" backHref="/clients" name={client.name}/>
   )
}