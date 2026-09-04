import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/form/Label";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  label?: string;
  error?: string;
  hint?: string;
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  containerClassName?: string;
};

export function SelectField({
  label,
  error,
  hint,
  value,
  placeholder = "Select…",
  options,
  onValueChange,
  disabled,
  containerClassName,
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? <Label>{label}</Label> : null}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn(error && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
