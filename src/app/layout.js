import { Dancing_Script, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["700"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Para Malu ❤️",
  description: "Un detalle especial para vos",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${dancingScript.variable} ${montserrat.variable} ${playfairDisplay.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
