"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { type Language, languages, getCurrentLanguage, setCurrentLanguage } from "@/lib/i18n"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>("ru")

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang)
    setCurrentLanguage(lang)
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={currentLang === code ? "bg-primary/10" : ""}
          >
            <span className="mr-2">{flag}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
