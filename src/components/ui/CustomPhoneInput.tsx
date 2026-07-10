import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { AsYouType } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import { COUNTRIES, Country } from '@/lib/countries';
import clsx from 'clsx';

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountryCode?: string;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
}

export function CustomPhoneInput({ 
  value, 
  onChange, 
  defaultCountryCode = 'ES', 
  className = '',
  placeholder = '',
  searchPlaceholder = 'Buscar país...',
  notFoundText = 'No se encontraron países'
}: CustomPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse initial value to find country and local number
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (value) {
      const match = COUNTRIES.find(c => value.startsWith(c.dialCode));
      if (match) return match;
    }
    return COUNTRIES.find(c => c.code === defaultCountryCode) || COUNTRIES[0];
  });

  const [localNumber, setLocalNumber] = useState(() => {
    if (value) {
      const match = COUNTRIES.find(c => value.startsWith(c.dialCode));
      if (match) {
        return value.slice(match.dialCode.length).trim();
      }
    }
    return '';
  });

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.dialCode.includes(searchQuery)
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    
    // Reformatear el número actual bajo las reglas del nuevo país
    const formatter = new AsYouType(country.code as CountryCode);
    const numericOnly = localNumber.replace(/\D/g, '');
    formatter.input(numericOnly);
    
    const nationalNumber = formatter.getNationalNumber() || numericOnly;
    const cleanFormatter = new AsYouType(country.code as CountryCode);
    const newFormatted = cleanFormatter.input(nationalNumber);

    setLocalNumber(newFormatted);
    onChange(country.dialCode + ' ' + newFormatted);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir números, espacios y el signo '+' temporalmente para detectar pegados
    const rawVal = e.target.value.replace(/[^\d\s+]/g, '');
    let numericOnly = rawVal.replace(/\D/g, '');
    
    const rawPrefix = selectedCountry.dialCode; // Ej. "+58"
    const numericPrefix = rawPrefix.replace(/\D/g, ''); // Ej. "58"
    
    // SISTEMA PREMIUM: Limpiar prefijos duplicados si el usuario los pega
    // 1. Pegó con el '+' explícito (ej. +58 424...)
    if (rawVal.replace(/\s/g, '').startsWith(rawPrefix)) {
      numericOnly = rawVal.replace(/\s/g, '').substring(rawPrefix.length).replace(/\D/g, '');
    }
    // 2. Pegó con el formato internacional '00' (ej. 0058 424...)
    else if (numericOnly.startsWith('00' + numericPrefix)) {
      numericOnly = numericOnly.substring(2 + numericPrefix.length);
    }
    // 3. Pegó solo los números (ej. 58 424...) y la longitud sugiere que es un prefijo
    // (Asumimos que un número local puro rara vez pasa de los 11 dígitos)
    else if (numericOnly.startsWith(numericPrefix) && numericOnly.length > 11) {
      numericOnly = numericOnly.substring(numericPrefix.length);
    }
    
    // Evitar que sigan escribiendo más de 14 números locales (el límite mundial suele ser ~11)
    if (numericOnly.length > 14) return;
    
    const formatter = new AsYouType(selectedCountry.code as CountryCode);
    formatter.input(numericOnly);
    
    // Magia Premium: Extrae el "Número Nacional" real. 
    // En Venezuela elimina el '0' inicial automáticamente, pero en Italia lo conserva porque es legalmente requerido.
    const nationalNumber = formatter.getNationalNumber() || numericOnly;
    
    const cleanFormatter = new AsYouType(selectedCountry.code as CountryCode);
    const formatted = cleanFormatter.input(nationalNumber);

    setLocalNumber(formatted);
    onChange(selectedCountry.dialCode + ' ' + formatted);
  };

  return (
    <div className={clsx("relative w-full", className)} ref={dropdownRef}>
      {/* Input Container */}
      <div className={clsx(
        "flex items-center w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 shadow-inner group",
        isOpen ? "ring-2 ring-primary/50 border-primary/50 bg-white" : "focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 focus-within:bg-white hover:bg-white"
      )}>
        
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 pl-4 pr-3 py-3 h-[52px] rounded-l-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
        >
          <img 
            src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
            width="20"
            alt={selectedCountry.name}
            className="rounded-[2px] shadow-sm"
          />
          <ChevronDown className={clsx("w-4 h-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
          <span className="text-sm font-medium text-text-dark ml-1 border-r border-gray-200 dark:border-gray-700 pr-3 h-6 flex items-center">{selectedCountry.dialCode}</span>
        </button>

        {/* Number Input */}
        <input
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={placeholder}
          maxLength={18}
          className="flex-1 bg-transparent border-none outline-none h-[52px] px-3 text-text-dark placeholder:text-gray-400 min-w-0"
        />
      </div>

      {/* Custom Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 sticky top-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                autoFocus
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Country List */}
          <ul className="max-h-60 overflow-y-auto overscroll-contain py-2 custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(country => (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={clsx(
                      "w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                      selectedCountry.code === country.code && "bg-primary/5 dark:bg-primary/10 text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                        width="20"
                        alt={country.name}
                        className="rounded-[2px] shadow-sm"
                      />
                      <span className="text-sm font-medium text-text-dark">{country.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{country.dialCode}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-sm text-gray-500">
                {notFoundText}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
