"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, History } from "lucide-react";
import { Tables } from "@/utils/database.types";
import { EditContactDialog } from "./edit-contact-dialog";
import { DeleteContactDialog } from "./delete-contact-dialog";

interface ContactActionsProps {
  contact: Tables<'contacts'>;
}

export function ContactActions({ contact }: ContactActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete Contact
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4" />
            View History
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditContactDialog
        open={showEditDialog}
        onOpenChangeAction={setShowEditDialog}
        contact={contact}
      />

      <DeleteContactDialog
        open={showDeleteDialog}
        onOpenChangeAction={setShowDeleteDialog}
        contact={contact}
      />
    </>
  );
} 