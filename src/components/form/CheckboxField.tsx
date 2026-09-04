import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/form/Label";
import { cn } from "@/lib/cn";

type CheckboxFieldProps = {
  id?: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  containerClassName?: string;
};

export function CheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
  disabled,
  error,
  containerClassName,
}: CheckboxFieldProps) {
  const fieldId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className={cn("space-y-1", containerClassName)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={fieldId}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(v) => onCheckedChange?.(v === true)}
        />
        <Label htmlFor={fieldId} className="font-normal">
          {label}
        </Label>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
