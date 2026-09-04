import { useMemo, useState } from "react";
import { TextField } from "@/components/form/TextField";
import { cn } from "@/lib/cn";
import type { SelectOption } from "@/components/form/SelectField";

type SearchableSelectProps = {
  label?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  containerClassName?: string;
};

export function SearchableSelect({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Search…",
  error,
  containerClassName,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      <TextField
        label={label}
        value={query || selectedLabel || ""}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onValueChange?.("");
        }}
        placeholder={placeholder}
        error={error}
        autoComplete="off"
      />
      {query.trim() ? (
        <ul className="max-h-40 overflow-auto rounded-md border border-border bg-card shadow-e1">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>
          ) : (
            filtered.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-surface-2"
                  onClick={() => {
                    onValueChange?.(opt.value);
                    setQuery("");
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
