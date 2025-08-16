"use client"

import dynamic from "next/dynamic"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import HomePage from "../components/pages/HomePage"
import ShopPage from "../components/pages/ShopPage"
import ProductDetailsPage from "../components/pages/ProductDetailsPage"
import CartPage from "../components/pages/CartPage"
import CheckoutPage from "../components/pages/CheckoutPage"
import LoginPage from "../components/pages/LoginPage"
import SignupPage from "../components/pages/SignupPage"
import AboutPage from "../components/pages/AboutPage"
import ContactPage from "../components/pages/ContactPage"
import MakingPage from "../components/pages/MakingPage"
import ProtectedRoute from "../components/ProtectedRoute"
import { CartProvider } from "../context/CartContext"
import { ProductProvider } from "../context/ProductContext"
import { AuthProvider } from "../context/AuthContext"

function AppInner() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/making" element={<MakingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  )
}

export default dynamic(() => Promise.resolve(AppInner), { ssr: false })
