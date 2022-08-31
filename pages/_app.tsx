import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from './components/header'
import Footer from './components/footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <div className="flex min-h-screen flex-col items-center justify-center">
        <Head>
          <title>OrderLock</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <Component {...pageProps} />
        </main>
        <Footer/>
    </div>
    </>
    )
  
}

export default MyApp
