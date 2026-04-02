import '../styles/globals.css';
import '../styles/style.css';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { ToastProvider } from '../components/Toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Critical Runtime Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center', background: '#0f0f0f', color: '#D4AF37', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Sacred Space Interrupted</h2>
          <p>The cosmic energies are realigning. Please refresh the page or return later.</p>
          <button className="btn btn-glow mt-4" onClick={() => window.location.reload()}>Realign Energies</button>
        </div>
      );
    }
    return this.props.children;
  }
}



export default function App({ Component, pageProps }) {
  // Hydration guard: prevent server/client mismatch from causing blank screen
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {!mounted ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a1f0e',
          color: '#D4AF37',
          fontFamily: "'Playfair Display', serif"
        }}>
          <div className="spinner-border mb-3" role="status"></div>
          <p>Preparing the sacred space...</p>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
      </ToastProvider>
    </ErrorBoundary>
  );
}
