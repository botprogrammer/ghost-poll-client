import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghost Poll",
  description:
    "Create anonymous polls that disappear after a set time. No login required.",
  generator: "Pranav Goswami",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
