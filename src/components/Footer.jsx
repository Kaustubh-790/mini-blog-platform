import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                ByteBites
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Discover and share compelling stories that inspire, educate, and
              connect communities worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Browse Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/authors"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Authors
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/category/technology"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/category/lifestyle"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link
                  to="/category/travel"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Travel
                </Link>
              </li>
              <li>
                <Link
                  to="/category/creative-writing"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Creative Writing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 StoryStream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
