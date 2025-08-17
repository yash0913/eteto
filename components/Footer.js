import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex ">
              <img src="/logooo.png" alt="eteto logo" className="h-24 md:h-28 w-auto" />
            </div>
            <div className="text-4">
              <div className="font-medium">GUJARAT SNACKS COMPANY</div>
              <div className="text-sm text-muted-foreground">RAJKOT MAHARASHTRA INDIA</div>
            </div>
            <p className="text-muted-foreground text-sm">
              Bringing you the finest Indian snacks with authentic flavors and premium quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 gujjusnacsco@gmail.com</p>
              <p>📞 9574745353</p>
              <p>💬 WhatsApp: 7016683789</p>
              <p>📍 Opp. Genius School, Mota Mava, Kalawad Road, Rajkot - 360005, Gujarat, India </p>
              <p>🧾 GSTIN: 24AJMPP6393G1ZR</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 eteto. All rights reserved. Made with ❤️ for snack lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}
