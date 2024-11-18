'use client'

import * as React from 'react'
import Link from "next/link"
import { Button } from "../components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet"
import { HomeIcon, PenSquare, UserCircle, UserPlus, LogIn, Menu } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: <HomeIcon className="mr-2 h-4 w-4" /> },
    { href: "/create-post", label: "Create Post", icon: <PenSquare className="mr-2 h-4 w-4" /> },
    { href: "/profile", label: "Profile", icon: <UserCircle className="mr-2 h-4 w-4" /> },
    { href: "/create-account", label: "Create Account", icon: <UserPlus className="mr-2 h-4 w-4" /> },
    { href: "/login", label: "Login", icon: <LogIn className="mr-2 h-4 w-4" /> },
  ]

  return (
    
    <header className="bg-black text-white p-4">
      
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          nextBlog
        </Link>
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-black text-white">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}