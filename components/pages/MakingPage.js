"use client"

import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Play, CheckCircle, Users, Award, Leaf, Shield } from "lucide-react"
import { useState } from "react"

export default function MakingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const processSteps = [
    {
      step: "01",
      title: "Premium Ingredient Selection",
      description:
        "We source the finest potatoes, spices, and oils from trusted farmers across India, ensuring only the best quality ingredients make it to our kitchen.",
      icon: <Leaf className="h-8 w-8 text-green-500" />,
    },
    {
      step: "02",
      title: "Traditional Recipe Preparation",
      description:
        "Our master chefs follow time-tested recipes passed down through generations, carefully measuring each spice blend to achieve the perfect authentic taste.",
      icon: <Users className="h-8 w-8 text-orange-500" />,
    },
    {
      step: "03",
      title: "Precision Cooking Process",
      description:
        "Using state-of-the-art equipment combined with traditional techniques, we cook each batch at optimal temperatures to ensure consistent quality and taste.",
      icon: <Award className="h-8 w-8 text-red-500" />,
    },
    {
      step: "04",
      title: "Quality Control & Packaging",
      description:
        "Every product undergoes rigorous quality checks before being sealed in our specially designed packaging that locks in freshness and flavor.",
      icon: <Shield className="h-8 w-8 text-blue-500" />,
    },
  ]

  const qualityFeatures = [
    "100% Natural Ingredients",
    "No Artificial Preservatives",
    "Traditional Cooking Methods",
    "Hygienic Manufacturing",
    "Fresh Daily Production",
    "Quality Tested Products",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">Behind the Scenes</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How We Make <span className="text-orange-500">eteto</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the art and science behind creating India's most beloved snacks. From farm-fresh ingredients to
            your doorstep, every step is crafted with care and precision.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video relative">
              {!isVideoPlaying ? (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                  <img
                    src="/makingimg.jpg"
                    alt="Snack making process preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative z-10 text-center text-white">
                    <Button
                      onClick={() => setIsVideoPlaying(true)}
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white mb-4"
                    >
                      <Play className="mr-2 h-6 w-6" />
                      Watch Our Making Process
                    </Button>
                    <p className="text-lg opacity-90">See how we craft each snack with love and tradition</p>
                  </div>
                </div>
              ) : (
                <video controls autoPlay className="w-full h-full" poster="/traditional-indian-kitchen.png">
                  <source src="/makingvideo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Take a behind-the-scenes look at our state-of-the-art facility where traditional recipes meet modern
              technology. Watch how our skilled artisans transform simple ingredients into extraordinary snacks that
              have delighted families for over 25 years.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Crafting Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every eteto product goes through a meticulous 4-step process that ensures exceptional quality and
              authentic taste in every bite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {processSteps.map((process, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                        {process.step}
                      </div>
                      {process.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{process.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{process.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Quality Promise</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At eteto, quality isn't just a goal—it's our commitment to every customer. We believe that great snacks
                start with great ingredients and are perfected through careful attention to every detail of the
                manufacturing process.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                From the moment we select our ingredients to the final packaging, every step is monitored by our quality
                assurance team to ensure that each product meets our exacting standards.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {qualityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="/makingimg.jpg"
                alt="Our making process"
                className="rounded-lg shadow-lg w-1/2 mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sustainable & Responsible</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            We're committed to sustainable practices that protect our environment while supporting local communities.
            Our eco-friendly packaging and responsible sourcing ensure that every eteto product contributes to a better
            future.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Eco-Friendly Packaging</h3>
                <p className="text-gray-600 text-sm">Biodegradable materials that reduce environmental impact</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Sourcing</h3>
                <p className="text-gray-600 text-sm">Supporting local farmers and communities across India</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Waste Goal</h3>
                <p className="text-gray-600 text-sm">Minimizing waste through efficient production processes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
