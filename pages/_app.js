import 'tailwindcss/tailwind.css'
import { AnimateSharedLayout } from 'framer-motion'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
          },
          function(err) {
          },
        )
      })
    }
  }, [])

  return (
    <AnimateSharedLayout>
      <Component {...pageProps} />
    </AnimateSharedLayout>
  )
}

export default MyApp
