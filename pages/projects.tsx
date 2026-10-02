import Layout from "../components/layout";
import { NextPage } from "next";
import { PROJECTS_PARAGRAPHS } from "../lib/siteContent";

const Projects: NextPage = () => {
  return (
    <Layout>
      <div className="px-4 text-center text-gray-800 dark:text-white">
        <h1 className="mb-6 text-2xl font-semibold tracking-widest">
          PROJECTS
        </h1>
        <div className="space-y-4">
          {PROJECTS_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
