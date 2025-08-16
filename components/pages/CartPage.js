"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Mail, MessageCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
// products import removed as recommendations are disabled

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const [buyOpen, setBuyOpen] = useState(false)
  const [buyStep, setBuyStep] = useState("confirm") // 'confirm' | 'contact'
  // Ordering, totals and coupon features removed. Only display items and Buy panel.

  // Mock coupon codes
  // Coupons removed

  // Totals removed

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  // Coupon handlers removed

  // Get recommended products (random selection)
  const recommendedProducts = []

  const companyWhatsapp = "7016683789"

  const buildOrderMessage = () => {
    const lines = []
    lines.push("Order Request - eteto")
    lines.push("")
    lines.push("Cart Items:")
    cartItems.forEach((it, idx) => {
      lines.push(`${idx + 1}. ${it.name}  x${it.quantity}`)
    })
    lines.push("")
    lines.push("Contact details:")
    lines.push(`Name: ${user?.name || "N/A"}`)
    lines.push(`Email: ${user?.email || "N/A"}`)
    lines.push(`Contact no: ${user?.phone || "N/A"}`)
    lines.push("")
    
    return lines.join("\n")
  }

  const handleWhatsapp = () => {
    const msg = buildOrderMessage()
    const url = `https://wa.me/${companyWhatsapp}?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  const handleGmail = () => {
    const subject = "Order Request - eteto"
    const body = buildOrderMessage()
    const mailto = `mailto:gujjusnacsco@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    // Prefer the device's default email client (better UX on mobile)
    window.location.href = mailto
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Looks like you haven't added any delicious snacks to your cart yet.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              For ordering this cart items , contact us on 9574745353 or email us at gujjusnacsco@gmail.com
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Recommended Products for Empty Cart */}
          {recommendedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">You Might Like These</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">₹{product.price}</span>
                        <Button size="sm" asChild>
                          <Link to={`/product/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            For ordering this cart items , contact us on {companyWhatsapp} or email us at gujjusnacsco@gmail.com
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          {((typeof item.id === 'number') || (typeof item.id === 'string' && /^\d+$/.test(item.id))) ? (
                            <Link to={`/product/${item.id}`}>
                              <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                          ) : (
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center border rounded-md h-9">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 border-x min-w-[2.5rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                Clear Cart
              </Button>
              <Button variant="outline" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Buy Panel */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Dialog open={buyOpen} onOpenChange={(o) => { setBuyOpen(o); if (o) setBuyStep("confirm") }}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full" onClick={() => setBuyStep("confirm")}>Buy</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    {buyStep === "confirm" ? (
                      <div className="space-y-4">
                        <DialogHeader className="text-center">
                          <DialogTitle>Confirm Order</DialogTitle>
                          <DialogDescription>Is this all products? Confirm to order.</DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" onClick={() => setBuyOpen(false)}>Cancel</Button>
                          <Button onClick={() => setBuyStep("contact")}>Yes, continue</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <DialogHeader className="text-center">
                          <DialogTitle>Contact to Order</DialogTitle>
                          <DialogDescription>
                            For ordering this cart items , contact us on {companyWhatsapp} or email us at gujjusnacsco@gmail.com
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Button className="w-full" onClick={handleWhatsapp}>
                            <MessageCircle className="w-4 h-4 mr-2" /> Whatsapp
                          </Button>
                          <Button variant="outline" className="w-full" onClick={handleGmail}>
                            <Mail className="w-4 h-4 mr-2" /> Gmail
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
