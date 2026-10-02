import Layout from "../components/layout";
import { motion } from "framer-motion";
import { NextPage } from "next";
import { ABOUT_PARAGRAPHS } from "../lib/siteContent";

const About: NextPage = () => {
  return (
    <Layout>
      <motion.div
        key="about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4"
      >
        <div className="space-y-4 text-center text-gray-800 dark:text-white">
          {ABOUT_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default About;
