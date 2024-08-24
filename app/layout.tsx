import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import './globals.css';
import { Metadata } from "next";
import Provider from "./Provider";
import '@rainbow-me/rainbowkit/styles.css';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'LiveDocs',
  description: 'Your go-to collaborative editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
