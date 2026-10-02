import Layout from "../components/layout";
import { motion } from "framer-motion";
import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FULL_NAME,
  LAST_MODIFIED,
  PROFILE_IMAGE_URL,
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
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        name: SITE_TITLE,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        dateModified: LAST_MODIFIED,
        author: { "@id": personId },
        about: { "@id": personId },
        isPartOf: { "@id": websiteId },
        primaryImageOfPage: PROFILE_IMAGE_URL,
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center">
          <Image
            width="200"
            height="200"
            className="w-32 h-32 mb-8 rounded-full"
            src="/ishtiaq.jpeg"
            alt="Photo of Ishtiaq"
          />
          <h1 className="mx-auto text-2xl font-semibold tracking-widest text-center sm:text-3xl">
            ISHTIAQ UL HAQ SYED
          </h1>
          <hr className="w-16 my-8 border-gray-300" />
          <h2 className="text-lg tracking-widest text-center">
            SOFTWARE ENGINEER
          </h2>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Home;
