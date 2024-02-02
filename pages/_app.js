// pages/_app.js

import "@/styles/globals.css";
import Link from 'next/link';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>NTC 市场</title> {/* Set the title for all pages */}
      </Head>
      <header style={{ backgroundColor: '#f0f0f0', padding: '10px 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <h1 style={{ margin: '0' }} className="text-4xl font-bold">NTC Market</h1> {/* Title */}
        <nav className="border-b p-6">
          <Link href="/" style={{ margin: '0 10px' }}>Home</Link>
          <Link href="/create-item" style={{ margin: '0 10px' }}>出售</Link>
          <Link href="/my-assets" style={{ margin: '0 10px' }}>存货</Link>
          <Link href="/creator-dashboard" style={{ margin: '0 10px' }}>管理</Link>
        </nav>
      </header>
      <Component {...pageProps} />
    </>
  );
}

