"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipControl = ({
  children,
  title,
  side = "right",
  delayDuration = 0,
  className,
  ...props
}) => {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className} {...props}>
        {title}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipControl;
