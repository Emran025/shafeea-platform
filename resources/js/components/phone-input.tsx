import * as React from "react";
import { Check, ChevronsUpDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface PhoneInputProps {
  phoneValue: string;
  onPhoneChange: (value: string) => void;
  zoneValue: string;
  onZoneChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function PhoneInput({
  phoneValue,
  onPhoneChange,
  zoneValue,
  onZoneChange,
  placeholder = "5XXXXXXXX",
  error,
  className
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const { countries, loading } = useCountries();

  const selectedCountry = countries.find((country) => country.phone_code === zoneValue);

  return (
    <div className={cn("flex flex-col gap-1.5", className)} dir="ltr">
      <div className={cn(
        "flex h-11 w-full rounded-xl border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 shadow-sm",
        error && "border-red-500 ring-red-500/10"
      )}>
        {/* Country Code Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="h-11 px-3 border-r rounded-none hover:bg-transparent active:bg-transparent transition-colors flex items-center gap-1 min-w-[100px] !shadow-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none focus-visible:outline-none"
              dir="ltr"
            >
              <div className="flex items-center gap-2">
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
                  <Phone className="w-8 h-6 text-muted-foreground" />
                )}
                <span className="text-sm font-bold text-foreground">{zoneValue || '+'}</span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0 shadow-2xl border-primary/10 overflow-hidden" align="start">
            <Command dir="rtl" className="rounded-lg">
              <CommandInput placeholder="ابحث عن دولة أو رمز..." className="h-12" />
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
                        value={`${country.name_ar} ${country.phone_code}`}
                        onSelect={() => {
                          onZoneChange(country.phone_code);
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
                                  }}                                />
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
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary/70 bg-primary/5 px-2 py-1 rounded-md min-w-[45px] text-center" dir="ltr">{country.phone_code}</span>
                          <Check
                            className={cn(
                              "h-4 w-4 text-primary",
                              zoneValue === country.phone_code ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <Input
            type="tel"
            placeholder={placeholder}
            value={phoneValue}
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ''))}
            className="h-11 border-0 rounded-none !bg-transparent !shadow-none hover:!bg-transparent focus:!bg-transparent !ring-0 !ring-offset-0 focus-visible:!border-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none focus-visible:outline-none px-4 text-left font-mono text-base tracking-widest placeholder:tracking-normal"            dir="ltr"
          />
          <div className="absolute right-3.5 top-3.5 pointer-events-none">
            <Phone className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-[11px] font-medium mt-1 mr-1">{error}</p>}
    </div>
  );
}
