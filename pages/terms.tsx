import Layout from "../components/layout";
import { motion } from "framer-motion";
import { NextPage } from "next";
import Link from "next/link";
import { TERMS_PARAGRAPHS } from "../lib/siteContent";

const Terms: NextPage = () => {
  return (
    <Layout>
      <motion.div
        key="terms"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4 text-center text-gray-800 dark:text-white"
      >
        <h1 className="mb-6 text-2xl font-semibold tracking-widest">TERMS</h1>
        <div className="space-y-4">
          {TERMS_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 text-sm">
          Read the{" "}
          <Link className="underline" href="/privacy">
            Privacy page
          </Link>{" "}
          for information about browser storage and analytics.
        </p>
      </motion.div>
    </Layout>
  );
};

export default Terms;
