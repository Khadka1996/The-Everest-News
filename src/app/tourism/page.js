import React from 'react'
import TourismArticle from './tourism'
import TourismUddyan from './uddyan'
import TourismGhumfir from './ghumfir'
import TourismHospitality from './hospitality'
import TourismHeading from './heading'
import BottomHeader from '../Components/Header/BottomHeader'
import NavbarTop from '../Components/Header/TopHeader'
import FooterBottom from '../Components/Footer/FooterBottom'
import LowerHeading from '../Components/Footer/LowerHeading'

const page = () => {
  return (
    <>
    <NavbarTop/>
    <TourismHeading/>
    <BottomHeader/>
    <TourismArticle/>
    <TourismUddyan/>
    <TourismGhumfir/>
    <TourismHospitality/>
    <FooterBottom/>
    <LowerHeading/>
    </>
  )
}

export default page