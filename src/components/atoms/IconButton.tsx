import * as React from "react";
import type { SVGProps } from "react";
import { Button, type ButtonProps } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

type IconButtonProps = Omit<ButtonProps, "children"> & {
  srLabel: string;
  children: React.ReactElement<SVGProps<SVGSVGElement>>;
  size?: ButtonProps["size"];
  title?: string;
  iconClassName?: string;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { srLabel, children, title, iconClassName, size = "icon", ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        aria-label={srLabel}
        title={title ?? srLabel}
        size={size}
        {...props}
      >
        {React.cloneElement(children, {
          className: cn("h-5 w-5", children.props.className, iconClassName),
          "aria-hidden": true,
        })}
        <span className="sr-only">{srLabel}</span>
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";
