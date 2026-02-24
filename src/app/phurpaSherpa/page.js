'use client';
import React from 'react';
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaNewspaper } from 'react-icons/fa';
import { IoMdMail, IoMdCall } from 'react-icons/io';
import { BiNews } from 'react-icons/bi';
import NavbarTop from '@/app/Components/Header/TopHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import LowerHeading from '../Components/Footer/LowerHeading';

const PhurpaSherpaPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Sections */}
      <NavbarTop />
      <Heading />
      <BottomHeader />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Phurpa Sherpa</h1>
            <h2 className="text-2xl text-blue-600 font-medium">Editor, The Everest News</h2>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <Image
                  className="h-64 w-full md:h-full md:w-64 object-cover"
                  src="/logo.png" // Replace with actual image path
                  alt="Phurpa Sherpa"
                  width={256}
                  height={256}
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">
                  About the Editor
                </div>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Phurpa Sherpa is an accomplished journalist with over 15 years of experience in the
                  media industry. As the  Editor of The Everest News, She brings a wealth of
                  knowledge and expertise in investigative journalism, political reporting, and
                  multimedia storytelling.
                </p>
                <div className="mt-6 flex space-x-4">
                  
                  <a
                    href="mailto:theeverestnews24@gmail.com"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <IoMdMail className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">At The Everest News</h3>
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                    <BiNews className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Leadership</h4>
                  <p className="mt-2 text-gray-600">
                    Leading the editorial vision of The Everest News, ensuring journalistic integrity
                    and excellence in reporting. Oversees all content publication and editorial standards.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                    <FaNewspaper className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Editorial Direction</h4>
                  <p className="mt-2 text-gray-600">
                    Spearheading the digital transformation of the news platform and implementing
                    innovative storytelling techniques to engage audiences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Editorial Philosophy</h3>
            <blockquote className="text-gray-700 italic border-l-4 border-blue-400 pl-4 py-2 mb-6">
              &quot;Journalism is not just about reporting facts, but about telling the stories that matter
              with integrity and compassion.&quot;
            </blockquote>
            <div className="prose text-gray-600">
              <p>
                Under the leadership of Phurpa Sherpa, The Everest News has committed to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Uncompromising journalistic integrity</li>
                <li>In-depth investigative reporting</li>
                <li>Amplifying underrepresented voices</li>
                <li>Digital innovation in news delivery</li>
                <li>Environmental and social responsibility</li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Phone:</h4>
                <p className="text-gray-600 flex items-center">
                  <IoMdCall className="mr-2 text-blue-500" />
                  +977-9845924397
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Email:</h4>
                <p className="text-gray-600 flex items-center">
                  <IoMdMail className="mr-2 text-blue-500" />
                  theeverestnews24@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterBottom />
      <LowerHeading/>
    </div>
  );
};

export default PhurpaSherpaPage;