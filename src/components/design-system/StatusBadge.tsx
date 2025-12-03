import { cn } from "../../lib/utils";

export type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "error" | "info";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-white hover:bg-secondary/90",
  outline: "text-white border border-input hover:bg-accent hover:text-white",
  success: "bg-success/15 text-white border border-success/20 hover:bg-success/25",
  warning: "bg-warning/15 text-white border border-warning/20 hover:bg-warning/25",
  error: "bg-destructive/15 text-white border border-destructive/20 hover:bg-destructive/25",
  info: "bg-info/15 text-white border border-info/20 hover:bg-info/25",
};

export function StatusBadge({
  variant = "default",
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

