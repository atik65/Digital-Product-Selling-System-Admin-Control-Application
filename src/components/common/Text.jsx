import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Link as RouterLink } from "react-router-dom";

/**
 * Typography styles mapping
 */
const componentStyles = {
  h1: "text-[32px] font-bold leading-[1.2]",
  h2: "text-[28px] font-bold leading-[1.2]",
  h3: "text-[24px] font-semibold leading-[1.3]",
  h4: "text-[20px] font-semibold leading-[1.3]",
  "body-large": "text-[16px] font-medium leading-[1.5]",
  body: "text-[14px] font-normal leading-[1.5]",
  "body-small": "text-[13px] font-normal leading-[1.5]",
  caption: "text-[11px] text-muted-foreground font-medium leading-[1.4]",
  link: "text-[14px] font-normal leading-[1.5]",
};

/**
 * Element mapping for semantic HTML
 */
const componentElements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  "body-large": "p",
  body: "p",
  "body-small": "p",
  caption: "span",
  link: "a",
};

const Text = forwardRef(
  (
    {
      component = "body",
      className,
      children,
      to,
      href,
      underline = true,
      ...props
    },
    ref
  ) => {
    // Handle link component
    if (component === "link") {
      const linkClasses = cn(
        componentStyles.link,
        "text-primary hover:text-primary/80 transition-colors",
        underline && "underline",
        className
      );

      // Internal link
      if (to) {
        return (
          <RouterLink ref={ref} to={to} className={linkClasses} {...props}>
            {children}
          </RouterLink>
        );
      }

      // External link
      return (
        <a
          ref={ref}
          href={href}
          className={linkClasses}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    // Regular text components
    const Element = componentElements[component] || "p";
    const componentClass = componentStyles[component] || componentStyles.body;

    return (
      <Element ref={ref} className={cn(componentClass, className)} {...props}>
        {children}
      </Element>
    );
  }
);

Text.displayName = "Text";

export default Text;

/*
Usage Examples:

import Text from "@/components/common/Text";

// Headings
<Text component="h1">Heading 1 - 32px Bold</Text>
<Text component="h2">Heading 2 - 28px Bold</Text>
<Text component="h3">Heading 3 - 24px Semibold</Text>
<Text component="h4">Heading 4 - 20px Semibold</Text>

// Body text
<Text component="body-large">Body Large - 16px Medium</Text>
<Text component="body">Body Regular - 14px Regular</Text>
<Text component="body-small">Body Small - 13px Regular</Text>

// Caption
<Text component="caption">CAPTION - 11px Medium</Text>

// Links
<Text component="link" to="/dashboard">Internal Link</Text>
<Text component="link" href="https://example.com">External Link</Text>
<Text component="link" to="/about" underline={false}>No Underline</Text>

// With custom classes
<Text component="body" className="text-red-500 uppercase">
  Custom styled text
</Text>
*/
