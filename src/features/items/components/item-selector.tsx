import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ItemName, ItemType, itemTypeLabel, items } from "@/data/items.mjs";
import { useMediaQuery } from "@/lib/react/use-media-query.mjs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const craftableItems = Object.entries(items)
  .map(([name, item]) => ({
    value: name,
    label: item.label,
    category: item.type,
  }))
  .sort((a, b) => a.category.localeCompare(b.category))
  .sort((a, b) => a.label.localeCompare(b.label));

const groupedCraftableItems = Object.groupBy(
  craftableItems,
  (item) => item.category,
);

interface ItemSelectorProps {
  onChange(itemName: ItemName | null): void;
  className?: string;
}
export function ItemSelector(props: ItemSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <Command>
      <CommandInput placeholder="Search for an item..." />
      <CommandEmpty>No framework found.</CommandEmpty>
      <CommandList className="max-h-[400px] overflow-y-scroll">
        {Object.entries(groupedCraftableItems).map(([group, items]) => (
          <CommandGroup heading={itemTypeLabel[group as ItemType]}>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue: string) => {
                  setValue(currentValue === value ? "" : currentValue);
                  props.onChange(
                    currentValue === value ? null : (currentValue as ItemName),
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", props.className)}
          >
            {value
              ? craftableItems.find((item) => item.value === value)?.label
              : "Select an item..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">{content}</PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {value
            ? craftableItems.find((item) => item.value === value)?.label
            : "Select an item..."}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
