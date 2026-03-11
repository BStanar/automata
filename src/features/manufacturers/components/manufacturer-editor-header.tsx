"use client"

import { EditorHeader } from "@/features/editor/components/editor-header"
import { useSuspenseManufacturer } from "../hooks/use-manufacturers"

export const ManufacturerEditorHeader = ({ manufacturerId }: {manufacturerId: string}) => {
   const {data: manufacturer} = useSuspenseManufacturer(manufacturerId)
   
   return(
      <EditorHeader model="Manufacturers" backHref="/manufacturers" name={manufacturer.name}/>
   )
}