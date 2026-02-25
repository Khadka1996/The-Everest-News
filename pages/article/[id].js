import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import axios from 'axios';
import { FaClock, FaFacebook, FaWhatsapp, FaFacebookMessenger, FaShareAlt } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import NavbarTop from '@/app/Components/Header/TopHeader';
import MiddleHeader from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import Photos from '@/app/ImageVideo/Photo';
import Video from '@/app/ImageVideo/Video';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import LowerHeading from '@/app/Components/Footer/LowerHeading';
import '@/app/globals.css';
import ArticlePage from '@/app/articless/page';

const ServerPage = ({ data, tags, authors }) => {
  const router = useRouter();

  if (!data) {
    return <p>Error loading data.</p>;
  }

  const { headline, subheadline, content, createdAt, photos, shareCount } = data;



  const imageUri = photos && photos.length > 0 ? `http://localhost:5000/uploads/articles/${photos[0].split('/').pop()}` : '';

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]+>/g, '');
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const cleanedContent = truncateText(stripHtmlTags(content), 160);

  return (
    <>
      <NavbarTop />
      <MiddleHeader />
      <BottomHeader />
      <Head>
        <title>{headline}</title>
        <meta name="description" content={cleanedContent} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://theeverestnews.com${router.asPath}`} />
        <meta property="og:title" content={headline} />
        <meta property="og:description" content={cleanedContent} />
        <meta property="og:image" content={imageUri} />
      </Head>
      {/* Pass article data directly to ArticlePage */}
      <ArticlePage data={data} tags={tags} authors={authors} />
      <Video />
      <FooterBottom />
      <LowerHeading />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  try {
    const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
    const articleData = response.data.data || null;

    return {
      props: {
        data: articleData,
        tags: articleData.selectedTags || [],
        authors: articleData.selectedAuthors || [],
      },
    };
  } catch (error) {
    console.error('Error fetching article data:', error);
    return {
      props: {
        data: null,
        tags: [],
        authors: [],
      },
    };
  }
};

export default ServerPage;
