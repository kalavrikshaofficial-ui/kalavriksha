import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ParticleBackground from '../components/ParticleBackground';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [alert, setAlert] = useState(null);

  // Login form
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  // Register form
  const [regForm, setRegForm] = useState({
    fullname: '', username: '', email: '', dob: '', phone: '', password: '',
  });
  // Forgot password form
  const [forgotForm, setForgotForm] = useState({ email: '', dob: '', new_password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 6000);
  };

  const handleLogin = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...loginForm }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert('danger', data.error || 'Login failed.');
      } else {
        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch {
      showAlert('danger', 'A network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...regForm }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert('danger', data.error || 'Registration failed.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      showAlert('danger', 'A network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'forgot_password', ...forgotForm }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert('danger', data.error || 'Failed to reset password.');
      } else {
        setShowForgot(false);
        showAlert('success', 'Password restored. The new path awaits you.');
      }
    } catch {
      showAlert('danger', 'A network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head><title>Login | Kala Vriksha Mystical Wisdom</title></Head>
      <ParticleBackground />

      {/* Back home link */}
      <a
        href="/"
        onClick={e => { e.preventDefault(); router.push('/'); }}
        className="back-home position-fixed"
        style={{ top: 30, left: 30, zIndex: 200 }}
      >
        <i className="fas fa-arrow-left me-2" />Back to Wisdom
      </a>

      <div className="login-container">
        <div className="login-card">
          {/* Logo + Title */}
          <div className="text-center mb-4">
            <img
              src="/logo.png" alt="Shakthi Logo"
              className="brand-logo mb-3" style={{ height: 60 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <h2 className="gold-gradient-text d-block h1">KALA VRIKSHA</h2>
            <p className="text-light opacity-50">Join the Circle of Mystical Wisdom</p>
          </div>

          {/* Alert */}
          {alert && (
            <div
              className={`alert alert-${alert.type} alert-dismissible fade show bg-dark text-${alert.type} border-${alert.type} small mb-4`}
              role="alert"
            >
              <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`} />
              {alert.text}
              <button type="button" className="btn-close btn-close-white" onClick={() => setAlert(null)} />
            </div>
          )}

          {/* Tabs */}
          <ul className="nav nav-tabs justify-content-center" id="loginTabs">
            <li className="nav-item">
              <button
                className={`nav-link${tab === 'login' ? ' active' : ''}`}
                onClick={() => setTab('login')}
              >Login</button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link${tab === 'register' ? ' active' : ''}`}
                onClick={() => setTab('register')}
              >Register</button>
            </li>
          </ul>

          {/* Login pane */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label">Email or Username</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-user" /></span>
                  <input
                    type="text" className="form-control"
                    placeholder="Enter your credentials" required
                    value={loginForm.identifier}
                    onChange={e => setLoginForm({ ...loginForm, identifier: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-lock" /></span>
                  <input
                    type="password" className="form-control"
                    placeholder="••••••••" required
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="remember" />
                  <label className="form-check-label text-light opacity-75 small" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-link text-warning small text-decoration-none p-0"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="btn btn-glow w-100 py-3" disabled={submitting}>
                {submitting ? 'Entering...' : 'Enter the Temple'}
              </button>
            </form>
          )}

          {/* Register pane */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text" className="form-control" required
                    value={regForm.fullname}
                    onChange={e => setRegForm({ ...regForm, fullname: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text" className="form-control" required
                    value={regForm.username}
                    onChange={e => setRegForm({ ...regForm, username: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email" className="form-control" required
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date" className="form-control" required
                    value={regForm.dob}
                    onChange={e => setRegForm({ ...regForm, dob: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact No.</label>
                  <input
                    type="tel" className="form-control" placeholder="+91" required
                    value={regForm.phone}
                    onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password" className="form-control"
                  placeholder="Create a strong password" required
                  value={regForm.password}
                  onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-glow w-100 py-3" disabled={submitting}>
                {submitting ? 'Initiating...' : 'Initiate Journey'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-warning shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title gold-gradient-text">Restore Access</h5>
                <button
                  type="button" className="btn-close btn-close-white"
                  onClick={() => setShowForgot(false)}
                />
              </div>
              <form onSubmit={handleForgot}>
                <div className="modal-body">
                  <p className="small opacity-75 mb-4">
                    Enter your registered email and date of birth to reveal a new path.
                  </p>
                  <div className="mb-3">
                    <label className="form-label text-warning mb-1">Email Address</label>
                    <input
                      type="email" className="form-control" required
                      value={forgotForm.email}
                      onChange={e => setForgotForm({ ...forgotForm, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-warning mb-1">Date of Birth</label>
                    <input
                      type="date" className="form-control" required
                      value={forgotForm.dob}
                      onChange={e => setForgotForm({ ...forgotForm, dob: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-warning mb-1">New Password</label>
                    <input
                      type="password" className="form-control"
                      placeholder="Create a strong password" required
                      value={forgotForm.new_password}
                      onChange={e => setForgotForm({ ...forgotForm, new_password: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button" className="btn btn-secondary"
                    onClick={() => setShowForgot(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-glow" disabled={submitting}>
                    Restore Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { getSession } = await import('../lib/session');
  const session = getSession(req);
  if (session) {
    return {
      redirect: {
        destination: session.role === 'admin' ? '/admin' : '/dashboard',
        permanent: false,
      },
    };
  }
  return { props: {} };
}
