import { Inter } from "next/font/google";
import "../styles/main.scss";
import Providers from "@/context/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BuyLog",
  description: "Multi-Vendor Ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark"> {/* You can dynamically toggle dark/light mode later */}
      <head>
        {/* You can add custom favicon, SEO meta tags here */}
      </head>
      <body className={inter.className}>
        <Providers>
          {children} {/* All app components have access to your context providers */}
        </Providers>
      </body>
    </html>
  );
}
