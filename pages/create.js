import Head from 'next/head';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import 'react-datetime/css/react-datetime.css';
import CreateEvent from '../components/CreateEvent';

export default function Create() {

    return (
        <div>
            <Head>
                <title>Lore</title>
                <meta name="description" content="" />
                <meta property="og:image" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <CreateEvent/>
        </div>
    )
}