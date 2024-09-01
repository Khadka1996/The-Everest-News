import React from 'react'
import Breaking from '../Home/Breaking'
import Tourism from '../Home/Tourism'
import Economics from '../Home/Economics'
import Uddyan from '../Home/Uddyan'
import Sports from '../Home/Sports'
import Entertainment from '../Home/Entertainment'
import Bichar from '../Home/Bichar'
import International from '../Home/International'
import PhotoGallery from '../Home/PhotoGallery'
import TrendingArticles from './TrendingPage'

const ArticlePage = () => {
  return (
    <div>
      <Breaking/>
      <Tourism/>
      <Economics/>
      <Uddyan/>
      <Sports/>
      <TrendingArticles/>
      <International/>
      <Bichar/>
      <Entertainment/>
      <PhotoGallery/>
      
    </div>
  )
}

export default ArticlePage
