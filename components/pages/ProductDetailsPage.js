"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { getProductById, products } from "../../data/products"
import { useCart } from "../../context/CartContext"

export default function ProductDetailsPage() {
  const { id } = useParams()
  const product = getProductById(id)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()
  
  const [activeTab, setActiveTab] = useState("description")


  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  

  const images = product.images || [product.image]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/shop" className="text-muted-foreground hover:text-primary">
            Shop
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground capitalize">{product.category}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="space-y-1 mb-2">
                <div className="text-sm text-muted-foreground">Pack Size: 1 Box (90 Pattis)</div>
                <div className="text-sm text-muted-foreground">Each Patti Contains: 12 Packets</div>
                <div className="text-sm text-muted-foreground">Total Packets per Box: 1080 (90 x 12)</div>
              </div>
              <div className="mt-3">
                <Button size="lg" onClick={() => addToCart(product, 1)}>Add to Cart</Button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center space-y-2">
                <Truck className="w-6 h-6 mx-auto text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Free Delivery</div>
                  <div className="text-muted-foreground">On orders ₹500+</div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-6 h-6 mx-auto text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Quality Assured</div>
                  <div className="text-muted-foreground">Premium ingredients</div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <RotateCcw className="w-6 h-6 mx-auto text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Easy Returns</div>
                  <div className="text-muted-foreground">7-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          <div className="border-b">
            <div className="flex">
              {["description", "ingredients", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <CardContent className="p-6">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Weight:</span> {product.weight}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {product.category}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "ingredients" && (
              <div>
                <h3 className="font-medium mb-2">Ingredients:</h3>
                <p className="text-muted-foreground">{product.ingredients}</p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">{product.rating}</div>
                  <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{product.reviews} reviews</div>
                  </div>
                </div>
                <Separator />
                <p className="text-muted-foreground">Reviews feature coming soon...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <img
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Pack Size: 1 Box (90 Pattis)</div>
                      <div className="text-sm text-muted-foreground">Each Patti Contains: 12 Packets</div>
                      <div className="text-sm text-muted-foreground">Total Packets per Box: 1080 (90 x 12)</div>
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
