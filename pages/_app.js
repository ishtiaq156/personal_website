import 'tailwindcss/tailwind.css'
import { LayoutGroup } from 'framer-motion'
import { useEffect } from 'react'

function MyApp({ Component }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {},
          function (err) {}
        )
      })
    }
  }, [])

  return (
    <LayoutGroup>
      <Component />
    </LayoutGroup>
  )
}

export default MyApp
