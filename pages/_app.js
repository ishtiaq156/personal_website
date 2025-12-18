import { LayoutGroup } from "framer-motion";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";

function MyApp({ Component }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope,
            );
          },
          function (err) {
            console.error("ServiceWorker registration failed: ", err);
          },
        );
      });
    }
  }, []);

  return (
    <LayoutGroup>
      <Component />
    </LayoutGroup>
  );
}

export default MyApp;
