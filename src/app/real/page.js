// 'use client';

// import React, { useState, useEffect,Suspense } from 'react';
// import axios from 'axios';
// import YouTube from 'react-youtube';
// import { FaClock } from 'react-icons/fa';
// const TrendingArticles = React.lazy(() => import('./TrendingPage'));
// const LatestUpdates = React.lazy(() => import('./LatestPage'));

// const ArticlePage = () => {
//   const [articles, setArticles] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchData();
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('https://api.theeverestnews.com/api/categories');
//       setCategories(response.data?.data || []);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('https://api.theeverestnews.com/api/articles/all');
//       const updatedArticles = await Promise.all(
//         response.data.data.map(async (article) => {
//           const tags = await Promise.all(article.selectedTags.map(getTagName));
//           const authors = await Promise.all(article.selectedAuthors.map(getAuthorDetails));
//           const articleCategory = await getCategoryName(article.category);
//           return { ...article, selectedTags: tags, selectedAuthors: authors, category: articleCategory };
//         })
//       );

//       updatedArticles.sort((a, b) => {
//         const categoryComparison = a.category.localeCompare(b.category);
//         if (categoryComparison !== 0) return categoryComparison;

//         const authorA = a.selectedAuthors[0];
//         const authorB = b.selectedAuthors[0];

//         const authorComparison = authorA?.fullName.localeCompare(authorB?.fullName);
//         if (authorComparison !== 0) return authorComparison;

//         return new Date(b.createdDate) - new Date(a.createdDate);
//       });

//       setArticles(updatedArticles);
//     } catch (error) {
//       console.error('Error fetching articles:', error);
//     }
//   };

//   const getTagName = async (tagId) => {
//     try {
//       if (!tagId) return '';
//       const response = await axios.get(`https://api.theeverestnews.com/api/tags/${tagId}`);
//       return { tagId, tagName: response.data?.data?.name || '' };
//     } catch (error) {
//       console.error(`Error fetching tag name for tagId ${tagId}:`, error);
//       return { tagId: '', tagName: '' };
//     }
//   };

//   const getAuthorDetails = async (authorId) => {
//     try {
//       const response = await axios.get(`https://api.theeverestnews.com/api/authors/${authorId}`);
//       const author = response.data?.author;
//       const fullName = [author?.firstName, author?.middleName, author?.lastName].filter(Boolean).join(' ');
//       const photo = author?.photo || '';
//       return { fullName, photo, id: authorId };
//     } catch (error) {
//       console.error('Error fetching author details:', error);
//       return { fullName: '', photo: '', id: '' };
//     }
//   };

//   const getCategoryName = async (categoryId) => {
//     try {
//       const response = await axios.get(`https://api.theeverestnews.com/api/categories/${categoryId}`);
//       return response.data?.data?.name || '';
//     } catch (error) {
//       console.error('Error fetching category name:', error);
//       return '';
//     }
//   };

//   const getYouTubeVideoId = (url) => {
//     const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.(?:\/|v=)|[^\/]\/))([^"&?\/\s]{11})/);
//     return match?.[1] || '';
//   };

//   const handleArticleClick = async (id) => {
//     try {
//       await axios.put(`https://api.theeverestnews.com/api/articles/increment-views/${id}`);
//     } catch (error) {
//       console.error('Error incrementing views:', error);
//     }
//   };

//   const formatTimeDifference = (timestamp) => {
//     const currentTime = new Date();
//     const articleTime = new Date(timestamp);

//     const timeDifference = currentTime - articleTime;

//     const seconds = Math.floor(timeDifference / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);
//     const months = Math.floor(days / 30);
//     const years = Math.floor(months / 12);

//     const toNepaliNumber = (number) => {
//       const nepaliNumbers = ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०'];
//       return number.toString().split('').map(digit => nepaliNumbers[parseInt(digit, 10) - 1]).join('');
//     };

//     if (years > 0) return `${toNepaliNumber(years)} वर्ष${years > 1 ? '' : ''} अगाडि`;
//     if (months > 0) return `${toNepaliNumber(months)} महिना${months > 1 ? '' : ''} अगाडि`;
//     if (days > 0) return `${toNepaliNumber(days)} दिन${days > 1 ? '' : ''} अगाडि`;
//     if (hours > 0) return `${toNepaliNumber(hours)} घण्टा${hours > 1 ? '' : ''} अगाडि`;
//     if (minutes > 0) return `${toNepaliNumber(minutes)} मिनेट${minutes > 1 ? '' : ''} अगाडि`;

//     return `${toNepaliNumber(seconds)} सेकेन्ड${seconds > 1 ? '' : ''} अगाडि`;
//   };

//   const renderTags = (tags) => {
//     if (!tags || !Array.isArray(tags) || tags.length === 0) return null;

//     return (
//       <p>
//         {tags.map(({ tagId, tagName }) => (
//           <a className='mr-2' href={`/tag/${tagId}`} key={tagId}>
//             {tagName}
//           </a>
//         ))}
//       </p>
//     );
//   };

//   const renderAuthorInfo = (selectedAuthors) => {
//     if (!selectedAuthors || selectedAuthors.length === 0) return null;

//     return (
//       <div className="article-author-info-front-page">
//         {selectedAuthors.map((author, authorIndex) => (
//           <a href={`/author/${author.id}`} key={authorIndex} className="flex flex-row justify-center items-center">
//             {author.photo && (
//               <img 
//                 src={`https://api.theeverestnews.com/uploads/authors/${author.photo}`}
//                 alt={`Author ${authorIndex}`}
//                 className="h-10 w-10 object-cover rounded-full"
//               />
//             )}
//             <div>
//               {author.fullName}
//               {authorIndex < selectedAuthors.length - 1 && ', '}
//             </div>
//           </a>
//         ))}
//       </div>
//     );
//   };

//   const renderArticleYouTube = (youtubeLink) => {
//     if (!youtubeLink) return null;

//     return (
//       <div className="article-youtube-front-page">
//         <YouTube videoId={getYouTubeVideoId(youtubeLink)} />
//       </div>
//     );
//   };

//   const renderArticlePhotos = (photos, category) => {
//     if (!photos || photos.length === 0) return null;

//     const fileName = photos[0].split('/').pop();

//     return (
//       <div className={`article-photos ${category.id}-photos single-photo-front-page`}>
//         <div className="row">
//           <div className="overflow-hidden h-60 w-full">
//             <img
//               src={`https://api.theeverestnews.com/uploads/articles/${fileName}`}
//               alt="Photo"
//               className="object-cover h-full w-full"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const groupArticlesByCategory = (articles) => {
//     return articles.reduce((result, article) => {
//       const category = article.category;
//       if (!result[category]) {
//         result[category] = [];
//       }
//       result[category].push(article);
//       return result;
//     }, {});
//   };

//   const renderArticlesByCategory = () => {
//     if (!articles || articles.length === 0) {
//       return <p>{null}</p>;
//     }
//     const groupedArticles = groupArticlesByCategory(articles);

//     // Define the preferred order of categories
//     const preferredOrder = ["Breaking", "पर्यटन", /* Add other categories here */];

//     // Sort categories based on preferred order
//     const sortedCategories = Object.entries(groupedArticles).sort(([a], [b]) => {
//       const indexA = preferredOrder.indexOf(a);
//       const indexB = preferredOrder.indexOf(b);

//       if (indexA !== -1 && indexB !== -1) {
//         return indexA - indexB;
//       }

//       if (indexA !== -1) return -1;
//       if (indexB !== -1) return 1;

//       return a.localeCompare(b);
//     });

//     return (
//       <div className="mx-3 md:mx-10 lg:mx-20">
//         {sortedCategories.map(([category, articlesInCategory], index) => (
//           <React.Fragment key={category}>
//             <div className="text-lg font-semibold my-6">
//               {category !== "Breaking" && (
//                 <a href={`/category/${encodeURIComponent(category)}`}>
//                   <h1 className='text-3xl font-bold my-5 hover:text-[#25609A] duration-200 ease-in-out cursor-pointer'>
//                     {category}
//                   </h1>
//                 </a>
//               )}
//               {category === "Breaking"
//                 ? renderBreakingArticles(articlesInCategory)
//                 : renderRegularArticles(articlesInCategory)}
//             </div>
//             <AdvertisementComponent position={`middle`} />
//           </React.Fragment>
//         ))}
//       </div>
//     );
//   };

//   const renderBreakingArticles = (articles) => {
//     const breakingArticles = articles
//       .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
//       .slice(0, 3);
//  return breakingArticles.map((article, index) => (
//     <div className="article-card-front-page p-4 bg-white shadow-md rounded-md mb-6" key={index}>
//       <div className="article-details-front-page">
//         <a
//           href={`/article/${article._id}`}
//           onClick={() => handleArticleClick(article._id)}
//         >
//           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center cursor-pointer hover:text-[#25609A] transition duration-100 ease-in-out">
//             {article.headline}
//           </h2>
//         </a>
//         {article.subheadline && (
//           <div className="text-gray-700 text-center mt-2">
//             {article.subheadline}
//           </div>
//         )}
//         <div className="flex justify-center items-center gap-2 text-sm font-normal text-gray-700 mt-2">
//           <FaClock className="clock-icon-front-page mr-1" />
//           <span className="article-time-front-page">{formatTimeDifference(article.createdDate)}</span>
//           <span>{renderAuthorInfo(article.selectedAuthors)}</span>
//         </div>
//         <div className="flex justify-center mt-2">
//           {renderArticleYouTube(article.youtubeLink)}
//         </div>
//         <div className="flex justify-center items-center text-sm font-bold mt-2">
//           {renderTags(article.selectedTags)}
//         </div>
//       </div>
//       <div className="mt-6">
//         <AdvertisementComponent position="bottom" />
//       </div>
//     </div>
//   ));
// };

//   const renderRegularArticles = (articles) => {
//     const regularArticles = articles
//       .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
//       .slice(0, 6);

//     return (
//       <div className=''>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 h-full w-full">
//           {regularArticles.map((article, index) => (
//             <div key={index} className="flex flex-col h-full border rounded-lg">
//               <div className='px-2 py-3 cursor-pointer hover:text-[#25609A] duration-100 ease-in-out'>
//                 <h2 className="headline">
//                   <a
//                     href={`/article/${article._id}`}
//                     onClick={() => handleArticleClick(article._id)}
//                   >
//                     {article.headline}
                    
//                   </a>
//                 </h2>
//               </div>
//               <div className="flex flex-row justify-between items-center gap-4 px-2 pb-3">
//                 <div className='flex flex-row justify-center items-center gap-1 text-sm font-normal text-gray-700'>
//                   <FaClock className="clock-icon-front-page" />
//                   <span className="date">{formatTimeDifference(article.createdDate)}</span>
//                 </div>
//                 <div className='article-card-front-page'>
//                   <div className='article-details-front-page-regular'>
//                     {renderAuthorInfo(article.selectedAuthors)}
//                   </div>
//                 </div>
//               </div>
//               <div className="overflow-hidden">
//                 {renderArticlePhotos(article.photos, article.category)}
//                 <div className="youtube-video">
//                   {renderArticleYouTube(article.youtubeLink)}
//                 </div>
//               </div>
//               <div className="px-2 text-center my-2 font-bold text-sm">
//                 <span>{renderTags(article.selectedTags)}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="mt-6">
//         <AdvertisementComponent position="top" />
//       </div>
//       <div className="mb-5">
//         {renderArticlesByCategory()}
//         <div className="articles-container-sidebar-latest-advertisement-top">
//           <AdvertisementComponent position="below_category" />
//         </div>
//       </div>
//       <div className="flex flex-row flex-wrap lg:flex-nowrap">
      
//     <Suspense fallback={<div>Loading...</div>}>
//       <TrendingArticles />
//       <LatestUpdates />
//     </Suspense>
 
//       </div>
//       <div className="my-5">
//         <AdvertisementComponent position="below_category" />
//       </div>
//     </div>
//   );
// };

// const AdvertisementComponent = ({ position }) => {
//   const [advertisements, setAdvertisements] = useState([]);

//   useEffect(() => {
//     const fetchAdvertisements = async () => {
//       try {
//         const response = await axios.get(`https://api.theeverestnews.com/api/advertisements/${position}`);
//         setAdvertisements(response.data.advertisements);
//       } catch (error) {
//         console.error(`Error fetching ${position} advertisements:`, error);
//       }
//     };

//     fetchAdvertisements();
//   }, [position]);

//   const handleAdvertisementClick = (websiteLink) => {
//     try {
//       const trimmedLink = websiteLink.trim();
//       if (trimmedLink.match(/^https?:\/\//i)) {
//         window.open(trimmedLink, '_blank');
//       } else {
//         window.open(`http://${trimmedLink}`, '_blank');
//       }
//     } catch (error) {
//       console.error('Error opening link:', error);
//     }
//   };

//   return (
//     <div className='flex flex-row justify-center items-center'>
//       {advertisements.length > 0 ? (
//         <div>
//           {advertisements.map((advertisement) => (
//             <div key={advertisement._id} onClick={() => handleAdvertisementClick(advertisement.websiteLink)}>
//               <img className='rounded' src={`https://api.theeverestnews.com/${advertisement.imagePath}`} alt="Advertisement" />
//             </div>
//           ))}
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default ArticlePage;
 import React from 'react'
 
 const page = () => {
   return (
     <div>
       Page under maintainance
     </div>
   )
 }
 
 export default page
 