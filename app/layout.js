import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "MediQuery AI — Medicine Information Lookup",
  description:
    "Look up any medicine instantly. Get dosage, side effects, interactions, and manufacturing details powered by Google Gemini AI.",
  keywords: ["medicine", "drug info", "AI", "health", "pharmacology"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#E0E5EC]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
