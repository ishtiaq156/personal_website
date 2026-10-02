import Layout from "../components/layout";
import { motion } from "framer-motion";
import { NextPage } from "next";
import {
  CONTACT_EMAIL,
  CONTACT_PARAGRAPHS,
  CONTACT_PHONE,
} from "../lib/siteContent";

const Contact: NextPage = () => {
  return (
    <Layout>
      <motion.div
        key="contact"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4 text-center text-gray-800 dark:text-white"
      >
        <h1 className="mb-6 text-2xl font-semibold tracking-widest">CONTACT</h1>
        <div className="space-y-4">
          {CONTACT_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 mt-6 text-sm">
          <a
            className="hover:text-sky-600 dark:hover:text-pink-500"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          <a
            className="hover:text-sky-600 dark:hover:text-pink-500"
            href="https://wa.me/16605287013"
            rel="noopener noreferrer"
            target="_blank"
          >
            {CONTACT_PHONE}
          </a>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Contact;
