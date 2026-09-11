import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActionDialogDelete from "../ActionDialogDelete";
import { Ellipsis } from "lucide-react";

export const ActionItem = DropdownMenuItem;
export const ActionSeparator = DropdownMenuSeparator;

export const ActionDelete = ({ name, request }) => {
  return (
    <ActionDialogDelete
      request={request}
      name={name}
      trigger={
        <Button variant="outline" size="sm" className="w-full justify-start">
          Delete
        </Button>
      }
    />
  );
};
export const TableAction = ({ children }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
