"use client"

import { EditorHeader } from "@/features/editor/components/editor-header"
import { useSuspenseContact } from "../hooks/use-contacts"

export const ContactEditorHeader = ({ contactId }: {contactId: string}) => {
   const {data: contacts} = useSuspenseContact(contactId)
   
   return(
      <EditorHeader model="Contacts" backHref="/contacts" name={contacts.firstName}/>
   )
}