"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import { Filter, Grid, List, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
 
import { Slider } from "../ui/slider"
import { useProducts } from "../../context/ProductContext"
import { imageCatalog } from "../../data/products"
import { useCart } from "../../context/CartContext"
 

// Box sizing constant removed as prices are no longer displayed

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [gridColumns, setGridColumns] = useState(1)
  const [quantities, setQuantities] = useState({})
  const [mrpSelections, setMrpSelections] = useState({})
  const productsPerPage = 12

  const {
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    getFilteredProducts,
  } = useProducts()

  const { addToCart } = useCart()

  // Always start at top when navigating to this page
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }
  }, [location.pathname])

  // Build display from centralized catalog
  const displayItems = imageCatalog.map((item, i) => ({
    id: `img-${i}`,
    name: item.name,
    image: item.src,
  }))

  const isCanItem = (name) => {
    const n = (name || "").toLowerCase()
    return n.includes("flavoured peanuts") || n.includes("salt n'pepper peanuts")
  }

  // Items that require choosing MRP (5 or 10)
  const needsMrpChoice = (name) => {
    const base = (name || "").split("(")[0].trim().toLowerCase()
    return (
      base === "masala chana" ||
      base === "moong dal" ||
      base === "simply salted peanuts" ||
      base === "green peas" ||
      base === "nut cracker" ||
      base === "masala sing"
    )
  }

  // Apply category and search filters to catalog items
  const categoryParam = (searchParams.get("category") || "").toString()
  const baseByCategory = (() => {
    if (categoryParam === "2") {
      // Jars: show can items only
      return displayItems.filter((it) => isCanItem(it.name))
    }
    if (categoryParam === "1") {
      // Packets: hide can items
      return displayItems.filter((it) => !isCanItem(it.name))
    }
    return displayItems
  })()

  const normalizedQuery = (searchQuery || "").trim().toLowerCase()
  const filteredItems = normalizedQuery
    ? baseByCategory.filter((it) => it.name.toLowerCase().includes(normalizedQuery))
    : baseByCategory

  // Pagination based on images
  const totalPages = Math.ceil(filteredItems.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentItems = filteredItems.slice(startIndex, startIndex + productsPerPage)

  // Handle URL parameters
  useEffect(() => {
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    if (category && category !== selectedCategory) {
      setSelectedCategory(category)
      setCurrentPage(1)
    }
    if (search && search !== searchQuery) {
      setSearchQuery(search)
      setCurrentPage(1)
    }
  }, [searchParams, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery])

  // Determine current grid columns to identify first column items
  useEffect(() => {
    const calcCols = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024
      if (w >= 1280) return 4 // xl
      if (w >= 1024) return 3 // lg
      if (w >= 640) return 2 // sm
      return 1
    }
    setGridColumns(calcCols())
    const onResize = () => setGridColumns(calcCols())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    if (category === "all") {
      newParams.delete("category")
    } else {
      newParams.set("category", category)
    }
    setSearchParams(newParams)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    if (query) {
      newParams.set("search", query)
    } else {
      newParams.delete("search")
    }
    setSearchParams(newParams)
  }

  const handleAddToCart = (item) => {
    // Add a lightweight catalog item with price 0 to avoid price displays
    const payload = {
      id: item.id,
      name: needsMrpChoice(item.name)
        ? `${item.name} - ${mrpSelections[item.id] || "5"} rupees MRP`
        : item.name,
      image: item.image,
      price: 0,
      originalPrice: 0,
      description: "",
      weight: "",
      source: "catalog",
      mrp: needsMrpChoice(item.name) ? (mrpSelections[item.id] || "5") : undefined,
    }
    const qty = Math.max(1, parseInt(quantities[item.id]) || 1)
    addToCart(payload, qty)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Shop All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of authentic Indian snacks and treats
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-12 pl-10 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
  
        <div className="flex flex-col gap-8">
          {/* Products Grid/List */}
          <div className="flex-1">
            {currentItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setPriceRange([0, 300])
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold">All Products</h2>
                  <div className="mt-1 font-semibold">Minimum order should be of 50,000.</div>
                  <div className="text-sm text-muted-foreground mt-1">(For ordering this cart items, contact us on 9574745353/7016683789 or email us at gujjunacsco@gmail.com)</div>
                </div>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredItems.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredItems.length)} of {filteredItems.length} items
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {currentItems.map((item) => {
                    return (
                      <Card
                        key={item.id}
                        className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${
                          viewMode === "list" ? "flex" : "flex flex-col"
                        }`}
                      >
                        <div className={`relative overflow-hidden shrink-0 ${viewMode === "list" ? "w-40 sm:w-48 h-36 sm:h-40" : ""}`}>
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className={`${viewMode === "list" ? "w-full h-full sm:h-full" : "w-full h-40 sm:h-48 md:h-56"} object-contain bg-white`}
                          />
                        </div>
                         <CardContent className={`${viewMode === "list" ? "flex-1 p-6" : "p-4"} space-y-2 ${viewMode === "list" ? "" : "flex flex-col h-full"}`}>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          {[
                            "Cheese Tomato Flavoured Peanuts",
                            "Punjabi Tadka Flavoured Peanuts",
                            "Mexican Chilly Flavoured Peanuts",
                            "Peri Peri Flavoured Peanuts",
                            "Hing Jeera Flavoured Peanuts",
                            "Butter Salted Flavoured Peanuts",
                            "Spicy Garlic Flavoured Peanuts"
                          ].includes(item.name.trim()) ? (
                            <div className="text-sm text-muted-foreground">1 box contains 105 jars</div>
                          ) : (
                            <>
                              <div className="text-sm text-muted-foreground">Pack Size: 1 Box (90 Pattis)</div>
                              <div className="text-sm text-muted-foreground">Each Patti Contains: 12 Packets</div>
                              <div className="text-sm text-muted-foreground">Total Packets per Box: 1080 (90 x 12)</div>
                            </>
                          )}
                          {needsMrpChoice(item.name) && (
                            <div className="pt-1">
                              <div className="text-sm font-medium text-foreground mb-1">Select MRP</div>
                              <div className="flex items-center gap-3 flex-nowrap">
                                <label className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <input
                                    type="radio"
                                    name={`mrp-${item.id}`}
                                    value="5"
                                    checked={(mrpSelections[item.id] || "5") === "5"}
                                    onChange={() => setMrpSelections((prev) => ({ ...prev, [item.id]: "5" }))}
                                  />
                                  5 rupees
                                </label>
                                <label className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <input
                                    type="radio"
                                    name={`mrp-${item.id}`}
                                    value="10"
                                    checked={mrpSelections[item.id] === "10"}
                                    onChange={() => setMrpSelections((prev) => ({ ...prev, [item.id]: "10" }))}
                                  />
                                  10 rupees
                                </label>
                              </div>
                            </div>
                          )}
                          <div className="mt-auto pt-2 flex items-center justify-between gap-2 flex-nowrap w-full">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <label htmlFor={`qty-${item.id}`} className="text-sm text-muted-foreground">Qty</label>
                              <input
                                id={`qty-${item.id}`}
                                type="number"
                                min={1}
                                value={quantities[item.id] ?? 1}
                                onChange={(e) => {
                                  const v = Math.max(1, parseInt(e.target.value) || 1)
                                  const key = item.id
                                  setQuantities((prev) => ({ ...prev, [key]: v }))
                                }}
                                className="w-12 h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"
                              />
                            </div>
                            <Button size="sm" className="ml-auto shrink-0" onClick={() => handleAddToCart(item)}>Add to Cart</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Category Selector (only '1' and '2', at end) */}
                <div className="mt-8 flex flex-row flex-wrap gap-2 items-center overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent pb-2 justify-center">
                  <span className="font-semibold mr-2 whitespace-nowrap">Categories:</span>
                  {["1", "2"].map((cat) => (
                    <Button
                      key={`cat-btn-${cat}`}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCategoryChange(cat)}
                      className="whitespace-nowrap"
                    >
                      {cat === "1" ? "Packets" : cat === "2" ? "Jars" : cat}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
