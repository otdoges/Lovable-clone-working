import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from "@/components/ui/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI HTML Generator - Build something Lovable",
  description: "Create beautiful HTML pages and websites by chatting with AI. Generate, preview, and download HTML files instantly.",
  keywords: ["AI", "HTML", "generator", "web development", "no-code", "lovable"],
  authors: [{ name: "AI HTML Generator" }],
  creator: "AI HTML Generator",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-html-generator.vercel.app",
    title: "AI HTML Generator - Build something Lovable",
    description: "Create beautiful HTML pages and websites by chatting with AI",
    siteName: "AI HTML Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI HTML Generator - Build something Lovable",
    description: "Generate HTML with AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="lovable-ai-theme"
        >
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
