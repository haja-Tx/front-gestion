import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from './components/header'
import Footer from './components/footer'
import { ThemeProvider } from 'next-themes'
import dynamic from 'next/dynamic'
import { SWRConfig } from 'swr'
import fetchJson from '../lib/fetchJson'

function MyApp({ Component, pageProps }: AppProps) {
  const ProgressBar = dynamic(() => import('./components/progressBar'), { ssr: true });
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
    <ThemeProvider enableSystem={true} attribute="class">
    <div className="flex min-h-screen flex-col items-center justify-center">
        <Head>
          <title>OrderLock</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <ProgressBar />
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <Component {...pageProps} />
        </main>
        <Footer/>
    </div>
    </ThemeProvider>
    </SWRConfig>
    )
  
}

export default MyApp
