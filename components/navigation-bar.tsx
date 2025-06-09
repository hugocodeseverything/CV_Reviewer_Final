"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, LogOut, ChevronDown } from "lucide-react"
import { LucideUser } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showFeatures, setShowFeatures] = useState(false)
  const [pathname] = usePathname()

  useEffect(() => {
    try {
      const userData = localStorage.getItem("scandidate_user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Pemeriksaan autentikasi gagal:", error)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("scandidate_user")
    localStorage.removeItem("scandidate_token")
    setUser(null)
    window.location.href = "/"
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-cyan-700 bg-clip-text text-transparent font-space-grotesk">
              Scandidate
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive("/")
                  ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                  : "text-slate-600 hover:text-purple-600"
              }`}
            >
              Beranda
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center gap-1 font-medium text-slate-600 hover:text-purple-600 transition-colors"
              >
                Fitur AI
                <ChevronDown className="h-4 w-4" />
              </button>

              {showFeatures && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <Link href="/ai-features" className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50">
                    Pemindai CV
                  </Link>
                  <Link href="/job-match" className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50">
                    Pencocokan Pekerjaan
                  </Link>
                  <Link href="/ats-simulator" className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50">
                    Simulator ATS
                  </Link>
                  <Link href="/privacy-mode" className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50">
                    Mode Privasi
                  </Link>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <LucideUser className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-purple-100">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`font-medium transition-colors ${isActive("/") ? "text-purple-600" : "text-slate-600"}`}
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/ai-features"
                className={`font-medium transition-colors ${
                  isActive("/ai-features") ? "text-purple-600" : "text-slate-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Pemindai CV
              </Link>

              {user ? (
                <div className="flex flex-col space-y-3 pt-4 border-t border-purple-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <LucideUser className="h-4 w-4" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 w-fit"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4 border-t border-purple-100">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white w-full">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
