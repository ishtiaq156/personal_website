import Link from 'next/link'
import Head from 'next/head'
import { faDev, faGithub, faLinkedinIn, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faBlog, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import dynamic from 'next/dynamic'

const DarkModeToggle = dynamic(() => import('dark-mode-toggle-animation'), { ssr: false })

export default function Layout({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.getElementsByTagName('html')[0].classList.add('dark')
    } else {
      document.getElementsByTagName('html')[0].classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.getElementsByTagName('html')[0].classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.getElementsByTagName('html')[0].classList.remove('dark')
      localStorage.theme = 'light'
    }
  }, [theme])

  const toggleDarkMode = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <div
      className='flex flex-col items-center justify-center w-screen h-screen text-gray-800 transition duration-1000 ease-in-out dark:text-white dark:bg-blueGray-700'>
      <Head>
        <title>Ishtiaq Syed</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div
        style={{ minWidth: '24rem', maxWidth: '37rem' }}
        className='flex flex-col items-center justify-center w-2/3'>
        <div className='fixed cursor-pointer top-3 right-3'>
          <DarkModeToggle
            mode={theme === 'dark' ? 'sun' : 'moon'}
            onClick={toggleDarkMode}
            width='3rem'
            moonColor='#334155'
            sunColor='white'
            animationDuration={1} />
        </div>
        <motion.div layoutId='nav' className='flex flex-wrap justify-center leading-6'>
          <Link href='/'>
            <button
              className='w-24 py-1 text-xs leading-6 tracking-widest border border-gray-300 rounded-full dark:hover:border-pink-500 dark:border-white focus:outline-none hover:text-lightBlue-600 hover:border-lightBlue-600 dark:hover:text-pink-500'>
              HOME
            </button>
          </Link>
          <Link href='/about'>
            <button
              className='w-24 py-1 mx-2 text-xs leading-6 tracking-widest border border-gray-300 rounded-full dark:hover:border-pink-500 dark:border-white focus:outline-none hover:text-lightBlue-600 hover:border-lightBlue-600 dark:hover:text-pink-500'>
              ABOUT
            </button>
          </Link>
        </motion.div>
        <motion.div
          layoutId='border-div'
          className='flex flex-col items-center justify-center w-full py-8 my-6 border-t border-b border-gray-300 dark:border-white'>
          <AnimatePresence exitBeforeEnter>{children}</AnimatePresence>
        </motion.div>
        <motion.div layoutId='social-icons' className='flex items-center justify-center'>
          <a
            className='text-gray-400 dark:text-white hover:text-lightBlue-600 dark:hover:text-pink-500'
            href='https://github.com/ishtiaq156'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub'>
            <FontAwesomeIcon className='mr-6 text-2xl' icon={faGithub} />
          </a>
          <a
            className='text-gray-400 dark:text-white hover:text-lightBlue-600 dark:hover:text-pink-500'
            href='https://twitter.com/ishtiaq156'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Twitter'>
            <FontAwesomeIcon className='mr-6 text-2xl' icon={faTwitter} />
          </a>
          <a
            className='text-gray-400 dark:text-white hover:text-lightBlue-600 dark:hover:text-pink-500'
            href='https://www.linkedin.com/in/ishtiaq-syed5456/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='LinkedIn'>
            <FontAwesomeIcon className='mr-6 text-2xl' icon={faLinkedinIn} />
          </a>
          <a
            className='text-gray-400 dark:text-white hover:text-lightBlue-600 dark:hover:text-pink-500'
            href='https://dev.to/ishtiaq156'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Dev.to'>
            <FontAwesomeIcon className='mr-6 text-2xl' icon={faDev} />
          </a>
          <a
            className='text-gray-400 dark:text-white hover:text-lightBlue-600 dark:hover:text-pink-500'
            href='https://blog.ishtiaqsyed.com'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Blog'>
            <FontAwesomeIcon className='mr-6 text-2xl' icon={faBlog} />
          </a>
          <a
            className='text-gray-400 dark:text-white hover:text-lightBlue-600 dark:hover:text-pink-500'
            href='mailto:hi@ishtiaqsyed.com'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Email'>
            <FontAwesomeIcon className='mr-6 text-2xl' icon={faEnvelope} />
          </a>
          <a
            className='text-gray-400 dark:text-white hover:text-lightBlue-600 dark:hover:text-pink-500'
            href='https://wa.me/16605287013'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='WhatsApp'>
            <FontAwesomeIcon className='mr-6 text-2xl' icon={faWhatsapp} />
          </a>
        </motion.div>
      </div>
    </div>
  )
}
