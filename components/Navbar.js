"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ShoppingCart, Search, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useCart } from "../context/CartContext"
import { useProducts } from "../context/ProductContext"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { cartItems } = useCart()
  const { setSearchQuery: setGlobalSearchQuery } = useProducts()
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const gstin = "24AJMPP6393G1ZR"

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Making", path: "/making" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setGlobalSearchQuery(searchQuery.trim())
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault()
      navigate("/login", { state: { from: { pathname: "/cart" } } })
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 overflow-visible">
          {/* Brand logo image */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="eteto"
              className="h-28 md:h-36 w-auto relative translate-y-[14px] md:translate-y-[22px] -ml-2 md:-ml-12 drop-shadow-md scale-x-110 md:scale-x-125 origin-left"
            />
          </Link>

          {/* Desktop Navigation (original layout) */}
          <div className="hidden md:block relative">
            <div className="flex items-end space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            {/* GSTIN below Home & Shop without changing their positions */}
            <div className="absolute left-0 top-full mt-0.5 text-xs font-semibold text-muted-foreground">GSTIN: {gstin}</div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-xl mx-8 relative z-10">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search snacks..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pl-10 h-11 rounded-full bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </form>
          </div>

          {/* Cart and Auth Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" onClick={handleCartClick} className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Hi, {user?.name?.split(" ")[0]}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Hi, {user?.name?.split(" ")[0]}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search snacks..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="pl-10"
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
