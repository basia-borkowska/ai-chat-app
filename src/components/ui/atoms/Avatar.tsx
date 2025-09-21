import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type AvatarVariant = "sm" | "lg";

export interface AvatarProps extends Omit<ImageProps, "width" | "height"> {
  variant?: AvatarVariant;
  className?: string;
}

const sizeMap: Record<AvatarVariant, number> = {
  sm: 32,
  lg: 80,
};

export function Avatar({
  className,
  alt,
  variant = "sm",
  ...props
}: AvatarProps) {
  const size = sizeMap[variant];

  return (
    <div
      className={cn(
        "relative inline-block overflow-hidden rounded-full bg-dark-secondary",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image alt={alt} fill className="object-cover" {...props} />
    </div>
  );
}
