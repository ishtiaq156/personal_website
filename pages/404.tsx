import Layout from "../components/layout";
import { NextPage } from "next";
import Link from "next/link";

const NotFound: NextPage = () => {
  return (
    <Layout>
      <div className="px-4 text-center text-gray-800 dark:text-white">
        <h1 className="mb-4 text-2xl font-semibold tracking-widest">
          404 - NOT FOUND
        </h1>
        <p className="mb-4">
          The requested page does not exist. Agents and crawlers can recover by
          reading the sitemap, llms.txt, or the canonical homepage.
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <Link
            className="hover:text-sky-600 dark:hover:text-pink-500"
            href="/sitemap.xml"
          >
            Sitemap
          </Link>
          <Link
            className="hover:text-sky-600 dark:hover:text-pink-500"
            href="/llms.txt"
          >
            LLMs text
          </Link>
          <Link
            className="hover:text-sky-600 dark:hover:text-pink-500"
            href="/"
          >
            Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
