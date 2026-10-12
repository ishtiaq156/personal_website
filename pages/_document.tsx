import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="color-scheme" content="light dark" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Ishtiaq Syed" />
        <meta name="application-name" content="Ishtiaq Syed" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
  const saved = localStorage.getItem("theme");
  const dark = saved === "dark" || saved === '\"dark\"' ||
    (saved !== "light" && saved !== '\"light\"' && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", dark ? "#334155" : "#ffffff");
} catch {
  document.documentElement.classList.toggle("dark", matchMedia("(prefers-color-scheme: dark)").matches);
}`}
        </Script>
      </body>
    </Html>
  );
}
