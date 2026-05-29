import React from 'react'
import { Link } from 'react-router-dom'
import { Cpu, Menu } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">HWPROTO</p>
            <p className="text-xs text-muted-foreground">Hardware prototyping studio</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/services/pcb-design" className="hover:text-foreground transition-colors">PCB Design</Link>
          <Link to="/services/web-development" className="hover:text-foreground transition-colors">Web Dev</Link>
          <Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/store" className="hidden rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/5 md:inline-flex">
            Store
          </Link>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-primary/5 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
