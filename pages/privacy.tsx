import Layout from "../components/layout";
import { motion } from "framer-motion";
import { NextPage } from "next";
import { CONTACT_EMAIL, PRIVACY_PARAGRAPHS } from "../lib/siteContent";

const Privacy: NextPage = () => {
  return (
    <Layout>
      <motion.div
        key="privacy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4 text-center text-gray-800 dark:text-white"
      >
        <h1 className="mb-6 text-2xl font-semibold tracking-widest">PRIVACY</h1>
        <div className="space-y-4">
          {PRIVACY_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 text-sm">
          Privacy questions can be sent to{" "}
          <a
            className="hover:text-sky-600 dark:hover:text-pink-500"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </motion.div>
    </Layout>
  );
};

export default Privacy;
