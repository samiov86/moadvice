import { Fraunces, Inter } from "next/font/google";

/**
 * Shared by both root layouts. Declaring next/font twice would download and
 * emit two copies of each face.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const fontClassNames = `${inter.variable} ${fraunces.variable}`;
