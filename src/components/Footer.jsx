import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Home,
  User,
  Settings,
  PenTool,
  Search,
  BookOpen,
  TrendingUp,
  Calendar,
  Tag,
} from "lucide-react";
import { ImageWithFallback } from "./FallBackImage";
import { useAuth } from "../contexts/AuthContext";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <ImageWithFallback
                src={"/logo.png"}
                alt="ByteBites"
                className="w-12 h-12 rounded-xl object-contain"
              />
              <span className="text-2xl font-bold text-foreground font-heading">
                ByteBites
              </span>
            </Link>
            <p className="text-muted-foreground text-base mb-6 leading-relaxed">
              Discover and share compelling stories that matter. Connect with
              communities worldwide and explore diverse perspectives.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 border border-border"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 border border-border"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 border border-border"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 border border-border"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 border border-border"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-lg mb-6">
              Navigation
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <Home size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <Search size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Search Articles
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <PenTool size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Write Article
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <User size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    My Profile
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-lg mb-6">
              Popular Categories
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/search?category=technology"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <Tag size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Technology
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/search?category=programming"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <Tag size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Programming
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/search?category=web-development"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <Tag size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Web Development
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/search?category=tutorial"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <Tag size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Tutorials
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <TrendingUp size={16} className="mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    All Categories
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-lg mb-6">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail size={18} className="text-primary" />
                <a
                  href="mailto:hello@bytebites.com"
                  className="hover:text-primary transition-colors duration-200"
                >
                  hello@bytebites.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <BookOpen size={18} className="text-primary" />
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors duration-200"
                >
                  About ByteBites
                </Link>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Settings size={18} className="text-primary" />
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 ByteBites. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
