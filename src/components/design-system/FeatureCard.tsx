import { cn } from "../../lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  action,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <Card className={cn("h-full flex flex-col transition-all hover:border-primary/50 hover:shadow-glow", className)} {...props}>
      <CardHeader>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Icon size={24} />
          </div>
        )}
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
      {action && (
        <CardFooter className="pt-4">
          {action}
        </CardFooter>
      )}
    </Card>
  );
}

