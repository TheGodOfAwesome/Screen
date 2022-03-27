import { RecoilRoot } from 'recoil';
import { MoralisProvider } from "react-moralis";
import Layout from '../components/Layout';
import '../styles/globals.css'

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <RecoilRoot>
      <MoralisProvider appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID} serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MoralisProvider>
    </RecoilRoot>
  )
}

export default MyApp