import * as React from "react";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountries } from "@/hooks/use-countries";
import { decodeSvg } from "@/hooks/decode-svg";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function CountrySelect({ value, onChange, placeholder = "اختر الدولة", error }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const { countries, loading } = useCountries();

  const selectedCountry = countries.find((country) => country.name_ar === value || country.name_en === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-11 px-4 font-normal hover:bg-background/50 transition-all duration-200 rounded-xl",
            !value && "text-muted-foreground",
            error && "border-red-500 ring-red-500/10",
            open && "ring-2 ring-primary/20 border-primary"
          )}
          dir="rtl"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {selectedCountry ? (
              <div className="w-8 h-6 overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-border/30 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                {selectedCountry.flag_svg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: decodeSvg(selectedCountry.flag_svg, "size-8") }}
                  />
                ) : selectedCountry.flag_url ? (
                  <img 
                    src={selectedCountry.flag_url} 
                    alt={selectedCountry.name_ar}
                    translate="no"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <span className="truncate font-medium">
              {selectedCountry ? selectedCountry.name_ar : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 shadow-2xl border-primary/10 overflow-hidden" align="start">
        <Command dir="rtl" className="rounded-lg">
          <CommandInput placeholder="ابحث عن دولة..." className="h-12" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-sm text-muted-foreground">جاري تحميل الدول...</span>
                </div>
              ) : (
                countries.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={country.name_ar}
                    onSelect={() => {
                      onChange(country.name_ar);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-primary/5 data-[selected=true]:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-6 overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-border/30 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                          {country.flag_svg ? (
                            <div 
                              dangerouslySetInnerHTML={{
                                __html: decodeSvg(country.flag_svg),
                              }}
                            />
                          ) : country.flag_url ? (
                            <img 
                              src={country.flag_url} 
                              alt={country.name_ar}
                              translate="no"
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                       <span className="text-sm font-medium">{country.name_ar}</span>
                    </div>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        value === country.name_ar ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
