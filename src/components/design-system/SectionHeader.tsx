import { cn } from "../../lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mb-12",
        align === "center" && "text-center items-center",
        align === "right" && "text-right items-end",
        align === "left" && "text-left items-start",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="text-sm font-mono text-primary uppercase tracking-wider">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

