import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Users, Award, Heart, Truck } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Quality First",
      description:
        "We use only the finest ingredients and traditional recipes to create authentic Indian snacks that taste like home.",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Family Heritage",
      description:
        "Started as a family business, we've been serving delicious snacks for over 25 years with the same passion and dedication.",
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Excellence",
      description:
        "Our commitment to excellence has earned us recognition as one of India's most trusted snack brands.",
    },
    {
      icon: <Truck className="h-8 w-8 text-green-500" />,
      title: "Fresh Delivery",
      description: "From our kitchen to your doorstep, we ensure every product reaches you fresh and full of flavor.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">Our Story</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-orange-500">eteto</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Born from a passion for authentic Indian flavors, eteto has been crafting delicious snacks that bring
            families together for over two decades.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Journey</h2>
              <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed max-w-2xl">
                What started as a small family kitchen in 2022 has grown into one of India's most beloved snack brands.
                Our founder, inspired by traditional recipes passed down through generations, began with a simple
                mission: to create snacks that taste like home.
              </p>
              <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed max-w-2xl">
                Today, eteto continues to honor those traditional flavors while innovating with new varieties
                . Every product is made with care, using premium ingredients and time-tested recipes.
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                From our family to yours, we're committed to bringing you the authentic taste of India, one snack at a
                time.
              </p>
            </div>
            <div className="relative">
              <img
                src="/about1.png"
                alt="Traditional Indian kitchen"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do, from sourcing ingredients to delivering your favorite snacks.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">25+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">1M+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">50+</div>
              <div className="text-gray-600">Product Varieties</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">28</div>
              <div className="text-gray-600">States Served</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
