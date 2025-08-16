"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, CreditCard, Smartphone, Truck, CheckCircle, Download, Calendar, MapPin } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState("shipping")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [errors, setErrors] = useState({})

  const subtotal = getCartTotal()
  const shipping = subtotal >= 500 ? 0 : 40
  const tax = Math.round(subtotal * 0.05) // 5% tax
  const total = subtotal + shipping + tax

  const validateShipping = () => {
    const newErrors = {}
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"]

    required.forEach((field) => {
      if (!shippingInfo[field].trim()) {
        newErrors[field] = "This field is required"
      }
    })

    // Email validation
    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation
    if (shippingInfo.phone && !/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    // Pincode validation
    if (shippingInfo.pincode && !/^\d{6}$/.test(shippingInfo.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleShippingChange = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setCurrentStep("payment")
    }
  }

  const handlePlaceOrder = () => {
    // Simulate order processing
    const newOrderId = `ETT${Date.now().toString().slice(-6)}`
    const currentDate = new Date()
    const deliveryDate = new Date(currentDate)
    deliveryDate.setDate(currentDate.getDate() + 3) // 3 days delivery

    setOrderId(newOrderId)
    setOrderDate(currentDate.toLocaleDateString("en-IN"))
    setEstimatedDelivery(deliveryDate.toLocaleDateString("en-IN"))
    setOrderPlaced(true)

    // Store order in localStorage for invoice generation
    const orderData = {
      orderId: newOrderId,
      orderDate: currentDate.toISOString(),
      estimatedDelivery: deliveryDate.toISOString(),
      customer: shippingInfo,
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      status: "confirmed",
    }

    // Store in localStorage (in real app, this would be sent to backend)
    const existingOrders = JSON.parse(localStorage.getItem("eteto_orders") || "[]")
    existingOrders.push(orderData)
    localStorage.setItem("eteto_orders", JSON.stringify(existingOrders))

    clearCart()
  }

  const generateInvoice = () => {
    const invoiceContent = `
      ETETO SNACKS - INVOICE
      =====================
      
      Order ID: ${orderId}
      Order Date: ${orderDate}
      Customer: ${shippingInfo.firstName} ${shippingInfo.lastName}
      Email: ${shippingInfo.email}
      Phone: ${shippingInfo.phone}
      
      Shipping Address:
      ${shippingInfo.address}
      ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}
      
      Items Ordered:
      ${cartItems.map((item) => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`).join("\n")}
      
      Order Summary:
      Subtotal: ₹${subtotal.toFixed(2)}
      Shipping: ₹${shipping.toFixed(2)}
      Tax (5%): ₹${tax.toFixed(2)}
      Total: ₹${total.toFixed(2)}
      
      Payment Method: ${paymentMethod.toUpperCase()}
      
      Thank you for shopping with eteto!
      Visit us at www.eteto.com
    `

    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `eteto-invoice-${orderId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground mb-8">Add some delicious snacks to your cart first.</p>
          <Button asChild size="lg">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-muted-foreground mb-2">Thank you for your order, {shippingInfo.firstName}!</p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Order ID: {orderId}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">{orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span className="font-medium text-green-600">{estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-bold text-lg text-primary">₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p>{shippingInfo.address}</p>
                  <p>
                    {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                  </p>
                  <p>{shippingInfo.phone}</p>
                  <p>{shippingInfo.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button onClick={generateInvoice} variant="outline" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button asChild size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>

          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-muted-foreground">Your order has been received and confirmed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Processing</p>
                    <p className="text-sm text-muted-foreground">We're preparing your order</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Shipped</p>
                    <p className="text-sm text-muted-foreground">Your order is on the way</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Delivered</p>
                    <p className="text-sm text-muted-foreground">Order delivered successfully</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/cart">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Checkout</h1>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                currentStep === "shipping" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                1
              </div>
              <span>Shipping</span>
            </div>
            <div className="w-12 h-px bg-border"></div>
            <div
              className={`flex items-center gap-2 ${
                currentStep === "payment" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                2
              </div>
              <span>Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleShippingChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleShippingChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingChange("email", e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingChange("phone", e.target.value)}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange("address", e.target.value)}
                      className={errors.address ? "border-destructive" : ""}
                      placeholder="Street address, apartment, suite, etc."
                    />
                    {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange("city", e.target.value)}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange("state", e.target.value)}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={shippingInfo.pincode}
                        onChange={(e) => handleShippingChange("pincode", e.target.value)}
                        className={errors.pincode ? "border-destructive" : ""}
                      />
                      {errors.pincode && <p className="text-sm text-destructive mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={shippingInfo.notes}
                      onChange={(e) => handleShippingChange("notes", e.target.value)}
                      placeholder="Any special instructions for delivery"
                    />
                  </div>

                  <Button onClick={handleContinueToPayment} size="lg" className="w-full">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Truck className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">UPI Payment</div>
                          <div className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, Paytm</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-muted-foreground">Visa, Mastercard, RuPay accepted</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep("shipping")} className="flex-1">
                      Back to Shipping
                    </Button>
                    <Button onClick={handlePlaceOrder} size="lg" className="flex-1">
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
