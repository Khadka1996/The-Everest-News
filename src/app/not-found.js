import Link from 'next/link';
import errorImage from './Components/assets/error.png';
import Image from 'next/image';
import NavbarTop from './Components/Header/TopHeader';
import Heading from './Components/Header/MiddleHeader';
import BottomHeader from './Components/Header/BottomHeader';
import FooterBottom from './Components/Footer/FooterBottom';
const Error = () => {
  return (
    <div className=''>
    <NavbarTop/>
    <Heading/>
    <BottomHeader/>
    <div className="flex flex-col items-center justify-center mt-8 mb-8">
      {/* Display the imported image */}
      <Image src={errorImage} alt="Error" className="w-80 h-80 mb-1" />

      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-8">तपाईंले खोज्नु भएको पृष्ठ अनुपलब्ध हुन सक्छ वा अवस्थित छैन।</p>

      {/* Create a button with a "go back" icon */}
      <Link href="/">
        <button className="bg-blue-500 hover:bg-[#7BB660] text-white font-bold py-2 px-4 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a1 1 0 0 1-.707-.293l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 1.414L4.414 10l6.293 6.293A1 1 0 0 1 10 18z" clipRule="evenodd" />
          </svg>
          पछाडि फर्कनुहोस्      
            </button>
      </Link>
    </div>
    <FooterBottom/>
    </div>
  );
};

export default Error;