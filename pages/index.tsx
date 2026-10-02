import Layout from "../components/layout";
import { motion } from "framer-motion";
import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FULL_NAME,
  HOME_INTRO,
  HOME_SECTIONS,
  LAST_MODIFIED,
  PROFILE_IMAGE_URL,
  PROFILE_LINKS,
  SAME_AS_URLS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "../lib/siteContent";

const Home: NextPage = () => {
  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: FULL_NAME,
        alternateName: SITE_NAME,
        jobTitle: "Software Engineer",
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        image: PROFILE_IMAGE_URL,
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        sameAs: SAME_AS_URLS,
        knowsAbout: [
          "Software engineering",
          "Web application development",
          "Mobile application development",
          "Frontend engineering",
          "Product engineering",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": personId },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#webpage`,
        name: SITE_TITLE,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        dateModified: LAST_MODIFIED,
        author: { "@id": personId },
        about: { "@id": personId },
        isPartOf: { "@id": websiteId },
        primaryImageOfPage: PROFILE_IMAGE_URL,
        mainEntity: HOME_SECTIONS.map(({ heading, paragraphs }) => ({
          "@type": "Question",
          name: heading,
          acceptedAnswer: {
            "@type": "Answer",
            text: paragraphs.join(" "),
          },
        })),
      },
    ],
  };

  return (
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <motion.div
        key="home"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center w-full px-4">
          <picture>
            <source srcSet="/ishtiaq.webp" type="image/webp" />
            <Image
              width={200}
              height={200}
              className="w-32 h-32 mb-8 rounded-full"
              src="/ishtiaq.jpeg"
              alt="Photo of Ishtiaq"
              loading="eager"
              fetchPriority="high"
              unoptimized
            />
          </picture>
          <h1 className="mx-auto text-2xl font-semibold tracking-widest text-center sm:text-3xl">
            ISHTIAQ UL HAQ SYED
          </h1>
          <p className="mt-3 text-center">{HOME_INTRO}</p>
          <p className="mt-3 text-sm text-center">
            By{" "}
            <Link href="/about" rel="author">
              {FULL_NAME}
            </Link>
            {" | Last updated "}
            <time dateTime={LAST_MODIFIED}>{LAST_MODIFIED}</time>
          </p>
          <hr className="w-16 my-8 border-gray-300" />
          <p className="mb-8 text-lg tracking-widest text-center">
            SOFTWARE ENGINEER
          </p>
        </div>
        <div className="w-full px-4 space-y-8 text-gray-800 dark:text-white">
          {HOME_SECTIONS.map(({ heading, paragraphs }) => (
            <section key={heading}>
              <h2 className="mb-3 text-lg font-semibold">{heading}</h2>
              <div className="space-y-3">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {heading.startsWith("Where can readers") && (
                <ul className="mt-3 space-y-1 list-disc list-inside">
                  {PROFILE_LINKS.map(({ name, url, description }) => (
                    <li key={url}>
                      <a
                        className="underline underline-offset-2 hover:text-sky-600 dark:hover:text-pink-500"
                        href={url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {name}
                      </a>
                      : {description}
                    </li>
                  ))}
                </ul>
              )}
              {heading.startsWith("How can people contact") && (
                <p className="mt-3">
                  <a
                    className="underline underline-offset-2"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                  {" | "}
                  <a
                    className="underline underline-offset-2"
                    href="https://wa.me/16605287013"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    WhatsApp
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Home;
