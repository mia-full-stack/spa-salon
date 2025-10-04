"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getTranslation, getCurrentLanguage } from "@/lib/i18n"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [t, setT] = useState(getTranslation("ru"))
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setUser(getCurrentUser())
    const lang = getCurrentLanguage()
    setT(getTranslation(lang))

    const currentUser = getCurrentUser()
    setIsAdmin(currentUser?.role === "admin")
  }, [])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    setIsAdmin(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Updated salon name and logo letter */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <span className="font-serif text-2xl font-bold text-primary-foreground">L</span>
          </div>
          <span className="font-serif text-2xl font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            La'Mia Studio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary relative group">
            {t.nav.home}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary relative group">
            {t.nav.about}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary relative group">
            {t.nav.services}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/certificates"
            className="text-sm font-medium transition-colors hover:text-primary relative group"
          >
            {t.nav.certificates}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary relative group">
            {t.nav.events}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link href="/booking" className="text-sm font-medium transition-colors hover:text-primary relative group">
            {t.nav.booking}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link href="/reviews" className="text-sm font-medium transition-colors hover:text-primary relative group">
            {t.nav.reviews}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary relative group">
            {t.nav.contact}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
                  {t.nav.admin}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur">
                <DropdownMenuItem asChild>
                  <Link href="/admin/stats">{t.nav.stats}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/events">{t.nav.manageEvents}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/print-certificate">{t.nav.printCertificates}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-primary/10">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t.nav.dashboard}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">{t.nav.dashboard}</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/stats">{t.nav.stats}</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.nav.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <User className="h-5 w-5" />
                <span className="sr-only">{t.nav.login}</span>
              </Button>
            </Link>
          )}

          <Link href="/booking" className="hidden md:block">
            <Button className="relative overflow-hidden group">
              <span className="relative z-10">{t.nav.booking}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Меню</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.about}
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.services}
            </Link>
            <Link
              href="/certificates"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.certificates}
            </Link>
            <Link
              href="/events"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.events}
            </Link>
            <Link
              href="/booking"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.booking}
            </Link>
            <Link
              href="/reviews"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.reviews}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.contact}
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin/stats"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.stats}
                </Link>
                <Link
                  href="/admin/events"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.manageEvents}
                </Link>
                <Link
                  href="/admin/print-certificate"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.printCertificates}
                </Link>
              </>
            )}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.dashboard}
                </Link>
                <Button variant="outline" onClick={handleLogout} className="w-full border-primary/30 bg-transparent">
                  {t.nav.logout}
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.login}
              </Link>
            )}
            <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">{t.nav.booking}</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
