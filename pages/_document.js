import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="apple-mobile-web-app-status-bar" content="#ffffff" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="Ishtiaq Syed" />
          <meta name="application-name" content="Ishtiaq Syed" />
          <meta
            name="description"
            content="Personal Website for Ishtiaq Ul Haq Syed - Software Engineer."
          />

          <meta property="og:url" content="https://ishtiaqsyed.com" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Ishtiaq Syed" />
          <meta
            property="og:description"
            content="Personal Website for Ishtiaq Ul Haq Syed - Software Engineer."
          />

          <meta
            property="og:image"
            content="https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v3/ishtiaqsyed.com/Ishtiaq%20Ul%20Haq%20Syed/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fdocuments%2Fed4429bf-2af3-45f3-bcaf-737ceda1fae6.jpg%3Ftoken%3DpuPyH3z7IEO4MJlaSRyrIJsE7gkvDAg91_LdMHncllo%26height%3D200%26width%3D200%26expires%3D33245144912/og.png"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="ishtiaqsyed.com" />
          <meta property="twitter:url" content="https://ishtiaqsyed.com" />
          <meta name="twitter:title" content="Ishtiaq Syed" />
          <meta
            name="twitter:description"
            content="Personal Website for Ishtiaq Ul Haq Syed - Software Engineer."
          />

          <meta
            name="twitter:image"
            content="https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v3/ishtiaqsyed.com/Ishtiaq%20Ul%20Haq%20Syed/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fdocuments%2Fed4429bf-2af3-45f3-bcaf-737ceda1fae6.jpg%3Ftoken%3DpuPyH3z7IEO4MJlaSRyrIJsE7gkvDAg91_LdMHncllo%26height%3D200%26width%3D200%26expires%3D33245144912/og.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
