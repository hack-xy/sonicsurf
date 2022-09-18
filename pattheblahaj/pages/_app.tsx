import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position='bottom-right' autoClose={1500} style={{zIndex: 99999999999999}} />
    </>
  )
}

export default MyApp
