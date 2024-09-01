'use client';
import React from 'react';
import Image from 'next/image';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import ceoPhoto from './logo.png';
import poweredByLogo from './powered.png';

const FooterBottom = () => {
  return (

    <footer className="bg-[#25609A] text-gray-200 py-12">
          <div className="mx-3 md:mx-10 lg:mx-20">

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-gray-700 pb-8">
          {/* Social Media Icons */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h2 className="text-lg font-semibold">Follow Us</h2>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61557287476216"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl hover:text-blue-500 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com/TheEverestNews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl hover:text-gray-800 transition-colors"
              >
               <FaXTwitter />
              </a>
              <a
                href="https://www.youtube.com/channel/UC6bTt6eddfNfh6q1m0QxG1A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl hover:text-red-500 transition-colors"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.instagram.com/everestportal/?=NXZ3YmRINnhwNWN3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl hover:text-pink-500 transition-colors"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* The Everest News Info */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => window.location.href = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=theeverestnews24@gmail.com&su=main"}
            >
              <Image src={ceoPhoto} alt="CEO's Photo" className="rounded-lg h-auto w-14" />
              <span className="font-semibold text-lg">The Everest News</span>
            </div>
            </div>
            <div className='flex-container'>
            <p>
              Our Team: <a href="/ourteam" className="text-blue-400 hover:underline">The Everest News</a>
            </p>
            <p>All rights reserved &copy; 2024</p>
            <p
              className="cursor-pointer hover:underline"
              onClick={() => window.location.href = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=theeverestnews24@gmail.com&su=main"}
            >
              Email: theeverestnews24@gmail.com
            </p>
            </div>

          {/* Spacer column for alignment */}
          <div className="hidden md:block"></div>

          {/* Powered by */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h2 className="text-lg font-semibold">Powered by</h2>
            <a className='p-1' href="https://www.intersect.com.np">
              <Image className='rounded ' src={poweredByLogo} alt="Powered By Logo" width={128} height={32} />
            </a>
          </div>
        </div>
      </div>
          </div>

    </footer>
  );
};

export default FooterBottom;