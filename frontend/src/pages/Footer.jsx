import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1 - Company */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b-2 border-pink-500 inline-block pb-1">Company</h3>
          <ul className="space-y-2 text-sm mt-2">
            <li><a href="#" className="hover:text-pink-400">About Us</a></li>
            <li><a href="#" className="hover:text-pink-400">Our Services</a></li>
            <li><a href="#" className="hover:text-pink-400">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Column 2 - Get Help */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b-2 border-pink-500 inline-block pb-1">Get Help</h3>
          <ul className="space-y-2 text-sm mt-2">
            <li><a href="#" className="hover:text-pink-400">FAQ</a></li>
            <li><a href="#" className="hover:text-pink-400">Shipping</a></li>
            <li><a href="#" className="hover:text-pink-400">Returns</a></li>
            <li><a href="#" className="hover:text-pink-400">Order Status</a></li>
            <li><a href="#" className="hover:text-pink-400">Payment Options</a></li>
          </ul>
        </div>

        {/* Column 3 - Online Shop */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b-2 border-pink-500 inline-block pb-1">Online Shop</h3>
          <ul className="space-y-2 text-sm mt-2">
            <li><a href="#" className="hover:text-pink-400">Smart Phones</a></li>
            <li><a href="#" className="hover:text-pink-400">Laptops</a></li>
            <li><a href="#" className="hover:text-pink-400">Smart Watchs</a></li>
            <li><a href="#" className="hover:text-pink-400">Headphones</a></li>
          </ul>
        </div>

        {/* Column 4 - Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b-2 border-pink-500 inline-block pb-1">Follow Us</h3>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="bg-gray-700 hover:bg-pink-500 p-2 rounded-full">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-gray-700 hover:bg-pink-500 p-2 rounded-full">
              <FaTwitter />
            </a>
            <a href="#" className="bg-gray-700 hover:bg-pink-500 p-2 rounded-full">
              <FaInstagram />
            </a>
            <a href="#" className="bg-gray-700 hover:bg-pink-500 p-2 rounded-full">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
