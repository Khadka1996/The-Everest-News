import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title:{
    default:"The Everest News",
    template:`%$ | The Everest News`,
  },
  description: "Stay Informed, Stay Ahead : Your Source For Todays News",
  verification:"google-site-verification=AIzaSyBxWzr_4tP9-dC_Zg7utqk-ODeUmlD--yo"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}