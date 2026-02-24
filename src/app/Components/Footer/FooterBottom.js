'use client';
import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import { IoDocuments } from "react-icons/io5";
import ceoPhoto from './logo.png';
import poweredByLogo from './powered.png';

const FooterBottom = () => {
  return (
    <footer className="bg-[#25609A] text-gray-100 pt-16 pb-20">
      <div className="container mx-auto px-5">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Image 
                src={ceoPhoto} 
                alt="The Everest News Logo" 
                className="w-14 h-14 object-contain"
                width={56}
                height={56}
              />
              <div>
                <h3 className="text-xl font-bold">The Everest News</h3>
                <p className="text-gray-300 text-sm">Sagarmatha Media House Pvt. Ltd.</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Your trusted source for comprehensive news coverage from Nepal and beyond.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-400" />
                <span>Gokarneshwor-6, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-gray-400" />
                <span>+977-9845924397</span>
              </div>
              <div className="flex items-center space-x-3">
                <IoDocuments className="text-gray-400" />
                <span>Regd: 4803-2018/2028</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold pb-3 border-b border-gray-700">Our Info</h3>
            <ul className="space-y-4">
             
              <li>
                <a 
                  href="/ourteam" 
                  className="hover:text-blue-300 transition-colors flex items-center space-x-3 group"
                >
                  <span className="bg-blue-100 bg-opacity-10 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </span>
                  <span>Our Team</span>
                </a>
              </li>
               <li>
                <a 
                  href="/phurpaSherpa" 
                  className="hover:text-blue-300 transition-colors flex items-center space-x-3 group"
                >
                  <span className="bg-blue-100 bg-opacity-10 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </span>
                  <span>Editor: Phurpa Sherpa</span>
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="hover:text-blue-300 transition-colors flex items-center space-x-3 group"
                >
                  <span className="bg-blue-100 bg-opacity-10 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:theeverestnews24@gmail.com" 
                  className="hover:text-blue-300 transition-colors flex items-center space-x-3 group"
                >
                  <span className="bg-blue-100 bg-opacity-10 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                    <FaEnvelope className="text-sm" />
                  </span>
                  <span>theeverestnews24@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold pb-3 border-b border-gray-700">Stay Connected</h3>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61557287476216"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 flex items-center space-x-3 transition-all"
              >
                <FaFacebook className="text-blue-400 text-xl" />
                <span>Facebook</span>
              </a>
              <a
                href="https://twitter.com/TheEverestNews"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 flex items-center space-x-3 transition-all"
              >
                <FaXTwitter className="text-white text-xl" />
                <span>Twitter</span>
              </a>
              <a
                href="https://www.youtube.com/channel/UC6bTt6eddfNfh6q1m0QxG1A"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 flex items-center space-x-3 transition-all"
              >
                <FaYoutube className="text-red-400 text-xl" />
                <span>YouTube</span>
              </a>
              <a
                href="https://www.instagram.com/everestportal/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 flex items-center space-x-3 transition-all"
              >
                <FaInstagram className="text-pink-400 text-xl" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} The Everest News. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm">Technology Partner</span>
            <a 
              href="https://www.intersect.com.np" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image 
                src={poweredByLogo} 
                alt="Intersect Technologies" 
                width={120}
                height={30}
                className="h-7 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBottom;