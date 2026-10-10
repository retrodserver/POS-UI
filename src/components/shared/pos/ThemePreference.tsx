import { useMemo, useState, useEffect } from "react";
import { Palette, Check, RotateCcw } from "lucide-react";
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
import { cn } from "@/lib/utils";

const GROUP_ORDER: ThemeGroup[] = ["core", "professional", "signature", "accessibility"];

interface ThemePreferenceProps {
  /** Render as header icon button, floating FAB, or full inline view in Settings. */
  variant?: "header" | "fab" | "inline";
}

export function ThemePreference({ variant = "header" }: ThemePreferenceProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => readSavedTheme());

  // Keep local state in sync with external theme changes (across tabs / components)
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: AppTheme }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener("retrod:theme:change", handleThemeChange);
    return () => window.removeEventListener("retrod:theme:change", handleThemeChange);
  }, []);

  const selected = useMemo(() => {
    return APP_THEMES.find((t) => t.value === theme) ?? APP_THEMES[0];
  }, [theme]);

  function selectTheme(next: AppTheme) {
    setTheme(next);
    applyTheme(next);
    persistTheme(next);
  }

  function handleResetDefault() {
    selectTheme("light");
  }

  // Inline view for Settings page
  if (variant === "inline") {
    return (
      <div className="space-y-4 max-w-lg">
        <CompactThemeList currentTheme={theme} onSelect={selectTheme} />
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg border border-border hover:bg-surface-2 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default (Light)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {variant === "fab" ? (
          <button
            type="button"
            aria-label="Open appearance settings"
            title={`Appearance: ${selected.label} (Click to change)`}
            className="group fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-e2 transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 print:hidden cursor-pointer"
          >
            <Palette className="h-5 w-5 text-primary transition-transform duration-200 group-hover:rotate-45" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Appearance and theme"
            title={`Appearance: ${selected.label}`}
            className="relative flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-text-primary hover:bg-surface-2 transition cursor-pointer shadow-xs"
          >
            <Palette className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline-block max-w-[90px] truncate">{selected.label}</span>
          </button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border bg-surface text-text-primary shadow-2xl sm:max-w-sm p-0"
      >
        {/* Simple Compact Header */}
        <SheetHeader className="border-b border-border px-4 py-3 text-left bg-surface">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
              <Palette className="h-3.5 w-3.5" />
            </div>
            <div>
              <SheetTitle className="text-xs font-bold text-text-primary leading-tight">
                Appearance & Themes
              </SheetTitle>
              <SheetDescription className="text-[10.5px] text-text-secondary">
                Select a color theme for Retrod POS
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Compact Single-Line Color List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <CompactThemeList currentTheme={theme} onSelect={selectTheme} />
        </div>

        {/* Footer */}
        <div className="border-t border-border px-3 py-2.5 flex items-center justify-between bg-surface shrink-0">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary px-2 py-1 rounded-md hover:bg-surface-2 transition cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset to Default</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-1 text-xs font-semibold rounded-md bg-primary text-primary-foreground shadow-xs transition hover:bg-primary-pressed cursor-pointer"
          >
            Done
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Small, simple 1-line per color list grouped by category */
function CompactThemeList({
  currentTheme,
  onSelect,
}: {
  currentTheme: AppTheme;
  onSelect: (theme: AppTheme) => void;
}) {
  return (
    <div className="space-y-3">
      {GROUP_ORDER.map((group) => {
        const groupThemes = APP_THEMES.filter((t) => t.group === group);
        if (groupThemes.length === 0) return null;

        return (
          <div key={group} className="space-y-1">
            {/* Category label */}
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-disabled">
              {APP_THEME_GROUP_LABELS[group]}
            </div>

            {/* One line per theme */}
            <div className="space-y-1">
              {groupThemes.map((option) => {
                const isActive = option.value === currentTheme;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSelect(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition cursor-pointer border",
                      isActive
                        ? "bg-primary/10 border-primary/30 text-text-primary font-bold shadow-2xs"
                        : "border-transparent text-text-primary hover:bg-surface-2",
                    )}
                  >
                    {/* Left: Swatch dot & Label */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="h-4 w-4 rounded-full border border-black/15 shadow-2xs shrink-0"
                        style={{ backgroundColor: option.swatches[0] }}
                      />
                      <span className="truncate text-[12.5px]">{option.label}</span>
                    </div>

                    {/* Right: 4-dot preview palette & active check */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center -space-x-1" aria-hidden>
                        {option.swatches.map((color, idx) => (
                          <span
                            key={idx}
                            className="h-2.5 w-2.5 rounded-full border border-surface shadow-2xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="w-4 h-4 flex items-center justify-center">
                        {isActive && <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
