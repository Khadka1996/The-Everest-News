"use client";
import React, { useState, useEffect } from "react";
import LowerHeading from "./Components/Footer/LowerHeading";
import BottomHeader from "./Components/Header/BottomHeader";
import MiddleHeader from "./Components/Header/MiddleHeader";
import TopHeader from "./Components/Header/TopHeader";
import Video from "./ImageVideo/Video";
import FooterBottom from "./Components/Footer/FooterBottom";
import TrendingArticles from "./Pages/ArticlePage";

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [showFooterBottom, setShowFooterBottom] = useState(false);
  const [showLowerHeading, setShowLowerHeading] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowVideo(true), 2000);
    setTimeout(() => setShowFooterBottom(true), 3000);
    setTimeout(() => setShowLowerHeading(true), 3000);
  }, []);

  return (
    <main>
      {/* Header Section */}
      <header>
        <TopHeader />
        <MiddleHeader />
        <BottomHeader />
      </header>

      {/* Main Content */}
      <section>
        <TrendingArticles />
      </section>

      {/* Delayed Content */}
      <section>
        {showVideo && <Video />}
        {showFooterBottom && <FooterBottom />}
        {showLowerHeading && <LowerHeading />}
      </section>
    </main>
  );
}
