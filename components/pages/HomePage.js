"use client"

import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Star, Truck, Shield, Award, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
 
 
import { imageCatalog } from "../../data/products"
import { useIsMobile } from "../../hooks/use-mobile"

// Box sizing constants removed (display-only info is now static under names)

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  
  
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [gridColumns, setGridColumns] = useState(1)
  const [showAllFeatured, setShowAllFeatured] = useState(false)
  const [quantities, setQuantities] = useState({})
  const isMobile = useIsMobile()

  // Category slideshow (3 panels, rotates every 25s)
  const categorySlides = [
    { color: 'bg-red-500', label: 'Packets', img: '/slide21.png' },
    { color: 'bg-orange-500', label: 'Jars', img: '/slide22.png' },
    { color: 'bg-emerald-500', label: 'Our Company', img: '/slide23.png' },
  ]
  const [catIdx, setCatIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCatIdx((i) => (i + 1) % categorySlides.length), 4000)
    return () => clearInterval(id)
  }, [categorySlides.length])
  const prevCat = () => setCatIdx((i) => (i - 1 + categorySlides.length) % categorySlides.length)
  const nextCat = () => setCatIdx((i) => (i + 1) % categorySlides.length)
  const slideLinks = ["/shop?category=1", "/shop?category=2", "/about"]

  // Hero slideshow
  const desktopSlides = [
    "/slide1.jpg",
    "/frontimg.jpg",
    "/slide3.jpg",
    "/slide4.jpg",
    "/slide5.jpg",
    "/slide6r.png",
    "/slide7.png",
  ]
  const mobileSlides = [
    "/slide1mobb.png",
    "/frontimgmob.png",
    "/slide3mob.jpg",
    "/slide4mob.jpg",
    "/slide5mob.jpg",
    "/slide6rmob.jpg",
    "/slide7mob.jpg",
  ]
  const slides = isMobile ? mobileSlides : desktopSlides
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length)
    }, 4000)
    return () => clearInterval(id)
  }, [slides.length])

  const prevSlide = () => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)
  const nextSlide = () => setSlideIndex((i) => (i + 1) % slides.length)

  // Note: Featured section is display-only; no cart interactions here.

  const openProductModal = (product) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  

  // Build Featured panels from centralized catalog
  const imagePanels = imageCatalog.map((item) => ({
    src: item.src,
    name: item.name,
  }))

  const isCanItem = (name) => {
    const n = (name || "").toLowerCase()
    return n.includes("flavoured peanuts") || n.includes("salt n'pepper peanuts")
  }

  const handleAddToCart = (panel, idx) => {
    const payload = {
      id: `home-${idx}`,
      name: panel.name,
      image: panel.src,
      price: 0,
      originalPrice: 0,
      description: "",
      weight: "",
      source: "catalog",
    }
    const id = `home-${idx}`
    const qty = Math.max(1, parseInt(quantities[id]) || 1)
    addToCart(payload, qty)
  }

  // Determine current grid columns for first-column detection
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

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Slideshow Fullscreen (minus navbar height) */}
      <section className="relative h-[calc(100vh-4rem)] w-screen overflow-hidden bg-background">
        <img
          src={slides[slideIndex]}
          alt={`Eteto Slide ${slideIndex + 1}`}
          className="absolute inset-0 h-full w-full object-cover block"
        />
        {/* Prev/Next Controls */}
        <div className="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-0">
          <Button variant="ghost" size="icon" onClick={prevSlide} className="bg-background/60 hover:bg-background/80">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextSlide} className="bg-background/60 hover:bg-background/80">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        {/* Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i === slideIndex ? "bg-primary" : "bg-muted"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Label above category slideshow */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-10 mb-4">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground text-center">Our Bestsellers</h2>
      </div>

      {/* Category promotional slideshow (hero-like, 15s interval) */}
      <section className="relative w-full overflow-hidden">
        <style>{`
          .panel{ border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,.25); overflow: hidden; }
        `}</style>
        {/* Single active panel with controls and dots (like the hero) */}
        <div className="relative h-[70vh] md:h-[80vh] w-screen bg-transparent overflow-hidden">
          {/* Active slide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`panel ${categorySlides[catIdx].color} relative w-[86vw] md:w-[72vw] lg:w-[62vw] h-[60vh] md:h-[70vh] transition-all duration-500 ring-4 md:ring-8 ring-white/80 ring-offset-2 md:ring-offset-4 ring-offset-white/50 shadow-[0_30px_80px_rgba(0,0,0,0.45)] drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]`}>
              <div className="absolute inset-0">
                {catIdx <= 1 ? (
                  <Link
                    to={slideLinks[catIdx]}
                    aria-label={`Open ${categorySlides[catIdx].label}`}
                    className="absolute inset-0 block z-10"
                  >
                    <img
                      src={categorySlides[catIdx].img}
                      alt={categorySlides[catIdx].label}
                      className={`w-full h-full object-contain pointer-events-none`}
                    />
                  </Link>
                ) : (
                  <img
                    src={categorySlides[catIdx].img}
                    alt={categorySlides[catIdx].label}
                    className={`absolute inset-0 w-full h-full object-contain`}
                  />
                )}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-extrabold text-xl md:text-2xl drop-shadow text-center">{categorySlides[catIdx].label}</div>
            </div>
          </div>

          {/* Prev/Next Controls */}
          <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 pointer-events-none">
            <Button variant="ghost" size="icon" onClick={prevCat} className="bg-background/60 hover:bg-background/80 pointer-events-auto">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextCat} className="bg-background/60 hover:bg-background/80 pointer-events-auto">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-2">
            {categorySlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCatIdx(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${i === catIdx ? "bg-primary" : "bg-muted"}`}
                aria-label={`Go to category slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Next Page: Become Our Distributor */}
        <div className="hidden">
          <div className="absolute inset-6 border-2 border-white rounded-xl pointer-events-none" />

          {/* Left text & CTA */}
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid md:grid-cols-2 items-center gap-8 z-[1]">
            <div className="space-y-4">
              <div className="text-3xl md:text-5xl font-extrabold text-foreground">Become our distributor</div>
              <p className="text-sm md:text-base text-foreground/80 max-w-prose">
                Partner with us to bring irresistible snacks to more shelves. Get competitive margins, dedicated support,
                and a fast-moving catalog consumers love.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                <Link to="/contact">Connect With Us</Link>
              </Button>
            </div>

            {/* Claw + hanging packets */}
            <div className="relative h-[360px] md:h-[460px]">
              {/* Claw SVG */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-6 origin-top" style={{ animation: 'sway 4s ease-in-out infinite' }}>
                <svg width="140" height="160" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#e5e7eb"/>
                      <stop offset="100%" stopColor="#9ca3af"/>
                    </linearGradient>
                  </defs>
                  <rect x="66" y="0" width="8" height="50" fill="url(#grad)"/>
                  <path d="M40 60 L70 50 L100 60 L90 80 L70 75 L50 80 Z" fill="url(#grad)" stroke="#6b7280"/>
                  <path d="M50 80 Q70 110 55 140" stroke="#6b7280" strokeWidth="8" fill="none"/>
                  <path d="M90 80 Q70 110 85 140" stroke="#6b7280" strokeWidth="8" fill="none"/>
                </svg>
              </div>

              {/* Hero packet held by claw */}
              <img src="/masalachanaa.png" alt="hero" className="absolute left-1/2 -translate-x-1/2 top-24 w-36 md:w-44 object-contain drop-shadow-2xl" style={{ animation: 'floatSlow 5s ease-in-out infinite' }} />

              {/* Hanging packets like a chain */}
              <img src="/moongdal.png" alt="hang1" className="absolute left-[40%] top-[58%] w-28 md:w-32 object-contain drop-shadow-xl" style={{ animation: 'floatSlow 6s ease-in-out infinite' }} />
              <img src="/simplysalted.png" alt="hang2" className="absolute right-[38%] top-[64%] w-28 md:w-32 object-contain drop-shadow-xl" style={{ animation: 'floatSlow 6.5s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Free Delivery</h3>
              <p className="text-muted-foreground">Free delivery on orders above ₹60000 across India</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Quality Assured</h3>
              <p className="text-muted-foreground">Premium ingredients with strict quality control</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Authentic Taste</h3>
              <p className="text-muted-foreground">Traditional recipes with authentic Indian flavors</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">About Eteto</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a passion for authentic Indian flavors, eteto brings you the finest collection of
                  traditional snacks made with premium ingredients and time-tested recipes.
                </p>
                <p>
                  Our journey began with a simple mission: to preserve and share the rich culinary heritage of India
                  through delicious, high-quality snacks that bring families together and create lasting memories.
                </p>
                <p>
                   every product is crafted with care, ensuring that each bite
                  delivers the authentic taste you love and trust.
                </p>
              </div>
              <Button asChild variant="outline" size="lg">
                <Link to="/shop">Explore Our Products</Link>
              </Button>
            </div>
            <div className="relative">
              <img src="/frontimg.jpg" alt="About Eteto" className="w-full rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions about our products or need assistance with your order? We're here to help!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground">gujjusnacsco@gmail.com</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Phone</h3>
              <p className="text-muted-foreground">9574745353</p>
              <p className="text-muted-foreground">WhatsApp: 7016683789</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Address</h3>
              <p className="text-muted-foreground">Opp. Genius School, Mota Mava, Kalawad Road, Rajkot - 360005, Gujarat, India </p>
            </div>
          </div>
          <Button asChild size="lg">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      </section>

      {selectedProduct && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={closeProductModal}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                    {/* Price-based save badge removed */}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">{selectedProduct.name}</h2>
                      <div className="space-y-1 mb-3">
                        <div className="text-sm text-muted-foreground">Pack Size: 1 Box (90 Pattis)</div>
                        <div className="text-sm text-muted-foreground">Each Patti Contains: 12 Packets</div>
                        <div className="text-sm text-muted-foreground">Total Packets per Box: 1080 (90 x 12)</div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-primary text-primary" />
                        <span className="font-medium">{selectedProduct.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                    </div>

                    {selectedProduct.ingredients && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Ingredients:</h3>
                        <p className="text-sm text-muted-foreground">{selectedProduct.ingredients}</p>
                      </div>
                    )}

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-800 text-center font-medium mb-3">
                        Sign in to purchase this product and enjoy exclusive benefits!
                      </p>
                      <div className="flex gap-3">
                        <Button asChild className="flex-1">
                          <Link to="/login">Sign In</Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1 bg-transparent">
                          <Link to="/signup">Create Account</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
