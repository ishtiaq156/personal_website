import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LayoutGroup, MotionConfig } from "framer-motion";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    const registerServiceWorker = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });
    return () => window.removeEventListener("load", registerServiceWorker);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <Component {...pageProps} />
        <SpeedInsights />
        <Analytics />
      </LayoutGroup>
    </MotionConfig>
  );
}
