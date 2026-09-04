import { Input } from "@/components/ui/input";
import { Label } from "@/components/form/Label";
import { cn } from "@/lib/cn";

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
};

export function TextField({
  label,
  error,
  hint,
  id,
  containerClassName,
  className,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? props.name;
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? <Label htmlFor={fieldId}>{label}</Label> : null}
      <Input id={fieldId} className={cn(error && "border-destructive", className)} {...props} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
