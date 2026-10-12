import Link from "next/link";
import Head from "next/head";
import {
  faDev,
  faGithub,
  faLinkedinIn,
  faXTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faBlog, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useSyncExternalStore, ReactNode } from "react";
import { useRouter } from "next/router";
import DarkModeIcon from "./dark-mode-icon";
import {
  INDEXABLE_PAGES,
  PROFILE_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "../lib/siteContent";

type LayoutProps = {
  children: ReactNode;
};

type Theme = "light" | "dark";
const THEME_CHANGE_EVENT = "site-theme-change";
let temporaryTheme: Theme | null = null;

function readTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  if (temporaryTheme !== null) return temporaryTheme;

  try {
    const saved = window.localStorage.getItem("theme");
    if (saved === "dark" || saved === '"dark"') return "dark";
    if (saved === "light" || saved === '"light"') return "light";
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToTheme(onChange: () => void) {
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  const onStorage = (event: StorageEvent) => {
    if (event.key === "theme" || event.key === null) {
      temporaryTheme = null;
      onChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  preference.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    preference.removeEventListener("change", onChange);
  };
}

export default function Layout({ children }: LayoutProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    readTheme,
    () => "light",
  );
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const routePath = router.asPath?.split(/[?#]/)[0] ?? "/";
  const canonicalPath = routePath === "/" ? "" : routePath.replace(/\/+$/, "");
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const page = INDEXABLE_PAGES.find(({ path }) => path === canonicalPath);
  const pageTitle = canonicalPath
    ? `${page?.title ?? SITE_NAME} | ${SITE_NAME}`
    : SITE_TITLE;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", readTheme() === "dark");
  }, [theme]);

  const toggleDarkMode = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    temporaryTheme = nextTheme;
    try {
      window.localStorage.setItem("theme", nextTheme);
    } catch {
      // The theme still works for this visit if storage is unavailable.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen text-gray-800 transition duration-1000 ease-in-out motion-reduce:transition-none dark:text-white dark:bg-slate-700">
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="theme-color"
          content={theme === "dark" ? "#334155" : "#ffffff"}
          key="theme-color"
        />
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="describedby" href="/llms.txt" type="text/plain" />
        <link rel="privacy-policy" href={`${SITE_URL}/privacy`} />
        <link rel="terms-of-service" href={`${SITE_URL}/terms`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:image" content={PROFILE_IMAGE_URL} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={PROFILE_IMAGE_URL} />
      </Head>
      <div
        style={{ minWidth: "24rem", maxWidth: "37rem" }}
        className="flex flex-col items-center justify-center w-2/3"
      >
        <button
          type="button"
          className="fixed top-3 right-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          onClick={toggleDarkMode}
          aria-label="Dark mode"
          aria-pressed={theme === "dark"}
        >
          <DarkModeIcon
            mode={theme === "dark" ? "sun" : "moon"}
            reducedMotion={shouldReduceMotion ?? false}
          />
        </button>
        <motion.div
          layoutId="nav"
          className="flex flex-wrap justify-center leading-6"
        >
          <Link
            href="/"
            className="flex items-center justify-center w-24 h-12 -my-2"
          >
            <span className="w-24 py-1 text-xs leading-6 tracking-widest text-center border border-gray-300 rounded-full dark:hover:border-pink-500 dark:border-white focus:outline-none hover:text-sky-600 hover:border-sky-600 dark:hover:text-pink-500">
              HOME
            </span>
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-center w-24 h-12 mx-2 -my-2"
          >
            <span className="w-24 py-1 text-xs leading-6 tracking-widest text-center border border-gray-300 rounded-full dark:hover:border-pink-500 dark:border-white focus:outline-none hover:text-sky-600 hover:border-sky-600 dark:hover:text-pink-500">
              ABOUT
            </span>
          </Link>
        </motion.div>
        <motion.main
          layoutId="border-div"
          className="flex flex-col items-center justify-center w-full py-8 my-6 border-t border-b border-gray-300 dark:border-white"
        >
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </motion.main>
        <motion.div
          layoutId="social-icons"
          className="flex items-center justify-center"
        >
          <a
            className="text-gray-400 dark:text-white hover:text-sky-600 dark:hover:text-pink-500"
            href="https://github.com/ishtiaq156"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FontAwesomeIcon className="mr-6 text-2xl" icon={faGithub} />
          </a>
          <a
            className="text-gray-400 dark:text-white hover:text-sky-600 dark:hover:text-pink-500"
            href="https://x.com/ishtiaq156"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (formerly Twitter)"
          >
            <FontAwesomeIcon className="mr-6 text-2xl" icon={faXTwitter} />
          </a>
          <a
            className="text-gray-400 dark:text-white hover:text-sky-600 dark:hover:text-pink-500"
            href="https://www.linkedin.com/in/ishtiaq156"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FontAwesomeIcon className="mr-6 text-2xl" icon={faLinkedinIn} />
          </a>
          <a
            className="text-gray-400 dark:text-white hover:text-sky-600 dark:hover:text-pink-500"
            href="https://dev.to/ishtiaq156"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Dev.to"
          >
            <FontAwesomeIcon className="mr-6 text-2xl" icon={faDev} />
          </a>
          <a
            className="text-gray-400 dark:text-white hover:text-sky-600 dark:hover:text-pink-500"
            href="https://blog.ishtiaqsyed.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Blog"
          >
            <FontAwesomeIcon className="mr-6 text-2xl" icon={faBlog} />
          </a>
          <a
            className="text-gray-400 dark:text-white hover:text-sky-600 dark:hover:text-pink-500"
            href="mailto:hi@ishtiaqsyed.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
          >
            <FontAwesomeIcon className="mr-6 text-2xl" icon={faEnvelope} />
          </a>
          <a
            className="text-gray-400 dark:text-white hover:text-sky-600 dark:hover:text-pink-500"
            href="https://wa.me/16605287013"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FontAwesomeIcon className="mr-6 text-2xl" icon={faWhatsapp} />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
