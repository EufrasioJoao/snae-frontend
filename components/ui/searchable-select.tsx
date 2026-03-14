"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchableSelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção...",
  emptyText = "Nenhuma opção encontrada.",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  selectedOption.badgeVariant === "secondary" && "bg-gray-100 text-gray-700",
                  selectedOption.badgeVariant === "destructive" && "bg-red-100 text-red-700",
                  selectedOption.badgeVariant === "outline" && "border border-gray-300 text-gray-700",
                  !selectedOption.badgeVariant && "bg-blue-100 text-blue-700"
                )}>
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar..." className="h-9" />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onValueChange?.(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="flex items-center justify-between p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{option.label}</span>
                    {option.badge && (
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full flex-shrink-0",
                        option.badgeVariant === "secondary" && "bg-gray-100 text-gray-700",
                        option.badgeVariant === "destructive" && "bg-red-100 text-red-700",
                        option.badgeVariant === "outline" && "border border-gray-300 text-gray-700",
                        !option.badgeVariant && "bg-blue-100 text-blue-700"
                      )}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-sm text-gray-500 truncate">{option.description}</p>
                  )}
                </div>
                <Check
                  className={cn(
                    "ml-2 h-4 w-4 flex-shrink-0",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}