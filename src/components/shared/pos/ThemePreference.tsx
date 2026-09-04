import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  APP_THEME_GROUP_LABELS,
  APP_THEMES,
  applyTheme,
  persistTheme,
  readSavedTheme,
  type AppTheme,
  type ThemeGroup,
} from "@/app/theme/theme";
import { cn } from "@/lib/cn";

const GROUP_ORDER: ThemeGroup[] = ["core", "professional", "signature", "accessibility"];

type ThemePreferenceProps = {
  /** Render as header icon button (default) or floating FAB. */
  variant?: "header" | "fab";
};

export function ThemePreference({ variant = "header" }: ThemePreferenceProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => readSavedTheme());

  const grouped = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      label: APP_THEME_GROUP_LABELS[group],
      themes: APP_THEMES.filter((t) => t.group === group),
    })).filter((g) => g.themes.length > 0);
  }, []);

  function selectTheme(next: AppTheme) {
    setTheme(next);
    applyTheme(next);
    persistTheme(next);
  }

  const selected = APP_THEMES.find((t) => t.value === theme) ?? APP_THEMES[0];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {variant === "fab" ? (
          <button
            type="button"
            aria-label="Open appearance settings"
            className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-e3 transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Palette className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Appearance and theme"
            title="Appearance"
            className="rounded-md p-2 text-text-secondary hover:bg-surface-2 hover:text-text-primary"
          >
            <Palette className="h-4 w-4" />
          </button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4 text-left">
          <SheetTitle className="font-display text-lg">Appearance</SheetTitle>
          <SheetDescription>
            Choose a color theme for Retrod POS. Preference is saved on this device.
          </SheetDescription>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface-2/50 px-3 py-2">
            <SwatchDots colors={selected.swatches} />
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-text-primary">{selected.label}</p>
              <p className="text-[11px] text-text-secondary">
                {APP_THEME_GROUP_LABELS[selected.group]} · active
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto py-4">
          {grouped.map(({ group, label, themes }) => (
            <section key={group}>
              <h3 className="label-uppercase mb-2 px-1 text-text-secondary">{label}</h3>
              <div className="grid grid-cols-1 gap-2">
                {themes.map((option) => {
                  const active = option.value === theme;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectTheme(option.value)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition",
                        active
                          ? "border-primary bg-primary-tint shadow-e1"
                          : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
                      )}
                    >
                      <SwatchDots colors={option.swatches} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-text-primary">{option.label}</p>
                        <p className="truncate font-mono text-[10px] text-text-secondary">
                          {option.value}
                        </p>
                      </div>
                      {active ? (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                          On
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SwatchDots({ colors }: { colors: [string, string, string] }) {
  return (
    <span className="flex shrink-0 -space-x-1.5" aria-hidden>
      {colors.map((color) => (
        <span
          key={color}
          className="h-5 w-5 rounded-full border border-border-strong/40 shadow-e1"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}
