"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useState } from "react";
import SelectTrigger from "./SelectTrigger";

const SelelctResponsiveWrapper = ({
  children,
  field,
  trigerProps,
  className,
  commandClassName,
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const triggerClass = `
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",`;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger
          disabled={trigerProps.isLoading}
          className={cn(triggerClass, className)}
          ref={field?.ref}
        >
          <SelectTrigger {...trigerProps} />
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-[300px] p-0", commandClassName)}
          align="start"
        >
          {children(handleClose)}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        disabled={trigerProps.isLoading}
        className={cn(triggerClass, className)}
        ref={field?.ref}
      >
        <SelectTrigger {...trigerProps} />
      </DrawerTrigger>
      <DrawerContent className={commandClassName}>
        <div className="mt-4 border-t">{children(handleClose)}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default SelelctResponsiveWrapper;
