import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormLabel } from "@/components/ui/form-field";

// يحوّل أي قيمة (string / Date / undefined) إلى Date صالح أو null
function parseValidDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function formatDisplayDate(value, placeholder) {
  const date = parseValidDate(value);
  return date ? date.toLocaleDateString("en-US") : placeholder;
}

export function DatePicker({ value, onChange, placeholder = "اختر التاريخ", label, register, name, rules }) {
  const [open, setOpen] = useState(false);
  const validDate = parseValidDate(value);

  const handleSelect = (date) => {
    onChange(date ? date.toISOString().split("T")[0] : "");
    setOpen(false);
  };

  // If register is provided, use it for react-hook-form integration
  if (register && name) {
    return (
      <div>
        {label && <FormLabel className="mb-2">{label}</FormLabel>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start h-12 font-normal text-muted-foreground bg-background border-gray-200",
                !validDate && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {formatDisplayDate(value, placeholder)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={validDate ?? undefined}
              onSelect={handleSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          {...register(name, rules)}
          value={value || ""}
          onChange={() => {}}
        />
      </div>
    );
  }

  // Original behavior for non-react-hook-form usage
  return (
    <div>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start h-10 font-normal text-muted-foreground bg-background border-gray-200",
              !validDate && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {formatDisplayDate(value, placeholder)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={validDate ?? undefined}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}