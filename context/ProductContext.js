"use client"

import { createContext, useContext, useState } from "react"
import { products, categories, searchProducts } from "../data/products"

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [sortBy, setSortBy] = useState("featured")

  const getFilteredProducts = () => {
    let filteredProducts = products

    // Filter by search query
    if (searchQuery.trim()) {
      filteredProducts = searchProducts(searchQuery)
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory)
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1],
    )

    // Sort products
    switch (sortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "featured":
      default:
        filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
        break
    }

    return filteredProducts
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        getFilteredProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
