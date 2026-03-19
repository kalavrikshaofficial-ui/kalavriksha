import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ParticleBackground from '../components/ParticleBackground';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';

/* ── Affirmations ─────────────────────────────────────── */
const AFFIRMATIONS = [
  'You are calm, focused and capable.',
  'Peace begins with a smile.',
  'I am letting go of all my worries and fears.',
  'Today, I choose joy.',
  'I radiate love, peace, and happiness.',
  'Every breath I take fills me with harmony.',
  'I am in tune with the universe.',
  'My mind is at peace, my heart is open.',
  'I release all that no longer serves me.',
  'I am worthy of love, light, and abundance.',
];

/* ── Breathing ────────────────────────────────────────── */
function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('Ready');
  const [scale, setScale] = useState(1);
  const [timer, setTimer] = useState('00:00');
  const iv = useRef(null);
  const phaseIdx = useRef(0);
  const secLeft = useRef(4);
  const totalSec = useRef(0);

  const stop = () => {
    clearInterval(iv.current);
    setRunning(false); setPhase('Ready'); setScale(1); setTimer('00:00');
    phaseIdx.current = 0; secLeft.current = 4; totalSec.current = 0;
  };

  const start = () => {
    setRunning(true);
    phaseIdx.current = 0; secLeft.current = 4; totalSec.current = 0;
    setPhase('Inhale...'); setScale(1.5);
    iv.current = setInterval(() => {
      secLeft.current--;
      totalSec.current++;
      const m = String(Math.floor(totalSec.current / 60)).padStart(2, '0');
      const s = String(totalSec.current % 60).padStart(2, '0');
      setTimer(`${m}:${s}`);
      if (secLeft.current <= 0) {
        phaseIdx.current = (phaseIdx.current + 1) % 3;
        if (phaseIdx.current === 0) { secLeft.current = 4; setPhase('Inhale...'); setScale(1.5); }
        else if (phaseIdx.current === 1) { secLeft.current = 4; setPhase('Hold...'); }
        else { secLeft.current = 6; setPhase('Exhale...'); setScale(1); }
      }
    }, 1000);
  };

  useEffect(() => () => clearInterval(iv.current), []);

  return (
    <div className="glass-panel text-center h-100 py-5">
      <h4 className="mb-4 text-warning">Breathing Guide (4-4-6)</h4>
      <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
        <div
          style={{
            width: 150, height: 150,
            background: 'radial-gradient(circle,#d4af37,#b8860b)',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(212,175,55,0.4)',
            transform: `scale(${scale})`,
            transition: 'transform 4s ease-in-out',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ color: '#0f0f0f', fontWeight: 700, fontSize: '1.1rem' }}>{phase}</div>
          <div style={{ color: '#0f0f0f', fontWeight: 700, fontFamily: 'monospace' }}>{timer}</div>
        </div>
      </div>
      <button
        className={`btn ${running ? 'btn-danger' : 'btn-glow'} rounded-pill px-4 py-2 mt-4`}
        onClick={running ? stop : start}
      >
        <i className={`fas fa-${running ? 'stop' : 'play'} me-2`} />
        {running ? 'Stop Exercise' : 'Start Exercise'}
      </button>
    </div>
  );
}

/* ── Calm Me Chat ─────────────────────────────────────── */
function CalmMeChat({ fullname }) {
  const firstName = fullname ? fullname.split(' ')[0] : 'Seeker';
  const [messages, setMessages] = useState([
    { from: 'ai', text: `Namaste, ${firstName}. I am here to listen. How are you feeling in this present moment?` },
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  const getReply = msg => {
    const m = msg.toLowerCase();
    if (m.includes('anxious') || m.includes('stress'))
      return "I understand that anxiety can be overwhelming. Let's take a slow breath together. Try the breathing exercise — inhale for 4, hold for 4, exhale for 6. Repeat. You are safe.";
    if (m.includes('sleep') || m.includes('tired'))
      return "Your body and mind need rest to bloom. Focus on your breath and let go of today's worries. Close your eyes and imagine a peaceful forest.";
    if (m.includes('sad') || m.includes('depress'))
      return "Sadness is like a cloud passing across the sun of your spirit. The light is still within you. Allow me to offer an affirmation: I radiate love, peace, and happiness.";
    if (m.includes('angry') || m.includes('frustrat'))
      return "Anger is a fire — it warms if controlled, burns if unchecked. Take three deep breaths. Acknowledge the feeling, then gently release it.";
    if (m.includes('meditat') || m.includes('spiritual'))
      return "Wonderful that you seek stillness. Begin by sitting comfortably, closing your eyes, and focusing on the rhythm of your breath. Let thoughts pass like clouds.";
    return "I hear your words. Continue to trust your inner journey. Is there anything else you want to share from your heart?";
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'ai', text: getReply(text) }]);
    }, 900);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      className="glass-panel p-0 overflow-hidden d-flex flex-column"
      style={{ height: '65vh', border: '1px solid rgba(212,175,55,0.3)' }}
    >
      <div className="p-3 border-bottom border-secondary bg-dark bg-opacity-75 d-flex align-items-center">
        <div
          className="rounded-circle bg-warning p-2 d-flex justify-content-center align-items-center me-3"
          style={{ width: 45, height: 45, minWidth: 45 }}
        >
          <i className="fas fa-peace text-dark fs-4" />
        </div>
        <div>
          <h5 className="mb-0 text-warning">Spiritual Guide</h5>
          <small className="text-success">
            <i className="fas fa-circle px-1" style={{ fontSize: 8 }} />Always listening
          </small>
        </div>
      </div>

      <div
        className="flex-grow-1 p-4 overflow-auto"
        ref={chatRef}
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`d-flex mb-4${m.from === 'user' ? ' justify-content-end align-items-center' : ''}`}
          >
            {m.from === 'ai' && (
              <div
                className="rounded-circle bg-warning p-2 d-flex justify-content-center align-items-center me-3"
                style={{ width: 35, height: 35, minWidth: 35, alignSelf: 'flex-end' }}
              >
                <i className="fas fa-peace text-dark small" />
              </div>
            )}
            <div
              className={`p-3 rounded-3 ${m.from === 'ai' ? 'bg-dark bg-opacity-75 text-light border border-secondary' : 'bg-warning text-dark'}`}
              style={{ maxWidth: '80%', borderBottomLeftRadius: m.from === 'ai' ? 0 : undefined, borderBottomRightRadius: m.from === 'user' ? 0 : undefined }}
            >
              {m.text}
            </div>
            {m.from === 'user' && (
              <div
                className="rounded-circle bg-dark border border-warning p-2 d-flex justify-content-center align-items-center ms-3"
                style={{ width: 35, height: 35, minWidth: 35, alignSelf: 'flex-end' }}
              >
                <i className="fas fa-user text-warning small" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-top border-secondary bg-dark bg-opacity-75">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary py-3 px-4 rounded-start-pill"
            placeholder="Type your feelings or problems here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
          />
          <button className="btn btn-glow rounded-end-pill px-4" onClick={send}>
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Modal ────────────────────────────────────── */
function PaymentModal({ event, user, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [phone, setPhone] = useState(user.phone || '');
  const [txnId, setTxnId] = useState('');
  const [method, setMethod] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        e.target.value = null;
        return;
      }
      setScreenshotFile(file);
    }
  };

  const confirm = async () => {
    if (!phone.trim()) { showToast('Please provide your phone number', 'error'); return; }
    if (!txnId.trim()) { showToast('Please enter your Transaction ID', 'error'); return; }
    if (!screenshotFile) { showToast('Please upload your payment screenshot', 'error'); return; }

    setSubmitting(true);
    try {
      // 1. Upload proof
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      const base64File = await toBase64(screenshotFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64File }),
      });
      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || 'Proof upload failed');
      }
      const uploadData = await uploadRes.json();

      // 2. Register
      const payload = {
        action: 'register',
        eventId: event._id || event.id,
        eventName: event.title || event.name,
        eventDate: event.date,
        userName: user.fullname,
        userEmail: user.email,
        userPhone: phone,
        transactionId: txnId,
        paymentScreenshot: uploadData.url
      };

      const res = await fetch('/api/registrations', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(`Registration submitted for ${event.title || event.name}! Your proof is being verified.`);
        onClose();
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch (err) {
      console.error('[Payment] Error:', err);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content bg-dark text-light border-warning shadow-lg"
          style={{ borderRadius: 20 }}
        >
          <div className="modal-header border-secondary">
            <h5 className="modal-title text-warning">Event Registration &amp; Payment</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Event Summary */}
            <div className="text-center mb-4">
              <i className="fas fa-om fa-3x text-warning mb-3" />
              <h4 className="mb-2">{event.title || event.name}</h4>
              <p className="text-white-50 small mb-1">
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h5 className="text-success mt-2 fw-bold">₹{event.price || '499'}</h5>
            </div>

            {/* User Details */}
            <div className="glass-panel p-3 mb-4">
              <h5 className="text-warning mb-3">
                <i className="fas fa-credit-card me-2" />Payment Details
              </h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small text-white-50">Full Name</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" value={user.fullname} readOnly />
                </div>
                <div className="col-12">
                  <label className="form-label small text-white-50">Email</label>
                  <input type="email" className="form-control bg-dark text-light border-secondary" value={user.email} readOnly />
                </div>
                <div className="col-12">
                  <label className="form-label small text-white-50">Phone Number</label>
                  <input
                    type="tel" className="form-control bg-dark text-light border-secondary"
                    placeholder="+91 XXXXXXXXXX"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-panel p-3 mb-4">
              <h6 className="text-warning mb-3">Payment Method</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-warning" onClick={() => setMethod('upi')}>
                  <i className="fas fa-mobile-alt me-2" />Pay via PhonePe/UPI
                </button>
                <button className="btn btn-outline-warning" onClick={() => setMethod('qr')}>
                  <i className="fas fa-qrcode me-2" />Scan PhonePe QR Code
                </button>
              </div>
            </div>

            {method && (
              <div className="glass-panel p-3 mb-4 text-center">
                {method === 'upi' ? (
                  <>
                    <p className="text-warning mb-3">Official UPI ID: <strong>ashishsony45@ybl</strong></p>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => navigator.clipboard.writeText('ashishsony45@ybl').then(() => showToast('UPI ID copied!'))}
                    >
                      <i className="fas fa-copy me-1" />Copy UPI ID
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      src="/payment_qr.png" alt="QR"
                      style={{ width: 200, borderRadius: 12 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <p className="text-warning mt-3 small">Scan &amp; pay ₹{event.price || '499'}</p>
                  </>
                )}
              </div>
            )}

            {/* Upload Proof */}
            <div className="glass-panel p-3 mb-4">
              <h6 className="text-warning mb-3">
                <i className="fas fa-file-invoice me-2" />Transaction Details
              </h6>
              <div className="mb-3">
                <label className="form-label small text-white-50">Transaction ID</label>
                <input
                  type="text" className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. T1234567890"
                  value={txnId} onChange={e => setTxnId(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-white-50">Upload Payment Screenshot</label>
                <input
                  type="file" accept="*/*" className="form-control bg-dark text-light border-secondary"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer border-secondary flex-column">
            <button
              className="btn btn-glow w-100 mb-2 d-flex align-items-center justify-content-center"
              onClick={confirm}
              disabled={submitting}
            >
              {submitting ? <Spinner size="1.2rem" color="#000" className="me-2" /> : (
                <i className="fas fa-check-circle me-2" />
              )}
              {submitting ? 'Submitting...' : 'Confirm Payment & Register'}
            </button>
            <button className="btn btn-outline-secondary w-100" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard Page ───────────────────────────────────── */
export default function DashboardPage({ user = {}, events = [], registrations: initRegs = [] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [affirmation, setAffirmation] = useState('"You are calm, focused and capable."');
  const [paymentModal, setPaymentModal] = useState(null);
  const [registrations, setRegistrations] = useState(initRegs || []);
  const [journalDate, setJournalDate] = useState('');
  const [journalText, setJournalText] = useState('');

  useEffect(() => {
    setJournalDate(new Date().toISOString().slice(0, 10));
  }, []);

  const doLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    showToast('Logged out. Your journey continues within.');
    router.push('/');
  };

  const registeredEventIds = (registrations || []).map(r => r?.eventId);
  const firstName = (user?.fullname || 'Seeker').split(' ')[0];

  const navItems = [
    { id: 'overview', icon: 'fa-th-large', label: 'Dashboard' },
    { id: 'events', icon: 'fa-calendar-alt', label: 'Events' },
    { id: 'wellness', icon: 'fa-seedling', label: 'Daily Wellness' },
    { id: 'calmme', icon: 'fa-peace', label: 'Calm Me' },
    { id: 'payment-history', icon: 'fa-file-invoice-dollar', label: 'Payment History' },
    { id: 'settings', icon: 'fa-user-cog', label: 'Profile Settings' },
  ];

  const downloadReceipt = async (reg) => {
    // Resolve fields from populated objects or snapshot fields
    const event = reg?.eventId;
    const isOnline = event?.type?.toLowerCase?.() === 'online';
    const participant = reg.userId?.name || reg.userName || 'N/A';
    const eventTitle = reg.eventId?.title || reg.eventName || 'N/A';
    const eventDateRaw = reg.eventId?.date || reg.eventDate || null;
    const eventDateStr = eventDateRaw ? new Date(eventDateRaw).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';
    const registeredOn = reg.createdAt ? new Date(reg.createdAt).toLocaleString('en-IN') : 'N/A';
    const status = reg.paymentStatus === 'verified' ? 'Confirmed' : 'Pending';
    const classLink = isOnline && event?.classLink ? event.classLink : null;

    // TEMP debug
    console.log('Event:', event);
    console.log('ClassLink:', classLink);

    // Build an off-screen receipt div
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;left:-9999px;top:0;width:595px;background:#fff;color:#333;font-family:Arial,sans-serif;padding:40px;box-sizing:border-box;';
    div.innerHTML = `
      <div style="text-align:center;border-bottom:3px solid #D4AF37;padding-bottom:20px;margin-bottom:20px">
        <h1 style="color:#D4AF37;margin:0;font-size:28px;letter-spacing:2px">KALA VRIKSHA</h1>
        <p style="margin:4px 0;color:#666;font-size:13px">Sacred Wisdom · Holistic Growth</p>
        <h2 style="margin:10px 0 0;font-size:18px">Payment Receipt</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:30px">
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;width:40%">Participant</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold">${participant}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666">Event</td><td style="padding:10px 0;border-bottom:1px solid #eee">${eventTitle}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666">Event Date</td><td style="padding:10px 0;border-bottom:1px solid #eee">${eventDateStr}</td></tr>
        ${classLink ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666">Class Link</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="${classLink}" target="_blank" rel="noreferrer" style="color:#0d6efd;text-decoration:underline;word-break:break-all">${classLink}</a></td></tr>` : ''}
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666">Transaction ID</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-family:monospace">${reg.transactionId}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666">Registered On</td><td style="padding:10px 0;border-bottom:1px solid #eee">${registeredOn}</td></tr>
        <tr><td style="padding:10px 0;color:#666">Status</td><td style="padding:10px 0;color:${status === 'Confirmed' ? '#2ecc71' : '#f39c12'};font-weight:bold">${status}</td></tr>
      </table>
      <div style="text-align:center;color:#999;font-size:12px;border-top:1px solid #eee;padding-top:20px">
        <p>Thank you for joining Kala Vriksha. May peace guide your journey.</p>
        <p>This is a system generated receipt.</p>
      </div>`;
    document.body.appendChild(div);

    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      if (classLink) {
        const pageH = pdf.internal.pageSize.getHeight();
        const pageW = pdf.internal.pageSize.getWidth();
        let yPos = Math.min(pageH - 80, pdfHeight + 30);
        if (!Number.isFinite(yPos) || yPos < 40) yPos = pageH - 80;

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Class Link:', 40, yPos);

        yPos += 16;
        pdf.setTextColor(13, 110, 253);
        pdf.textWithLink('Click here to Join Class', 40, yPos, { url: classLink });
        pdf.setTextColor(0, 0, 0);
      }
      pdf.save(`KalaVriksha_Receipt_${reg.transactionId}.pdf`);
    } finally {
      document.body.removeChild(div);
    }
  };

  const afterPayment = async () => {
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) setRegistrations(await res.json());
    } catch (err) {
      console.error('[Dashboard] afterPayment fetch error:', err);
    }
  };

  return (
    <>
      <Head><title>Dashboard | Kala Vriksha</title></Head>
      <ParticleBackground />


      <div className="dashboard-container">
        {/* Mobile toggle */}
        <button
          className="sidebar-toggle-btn d-lg-none"
          onClick={() => setSidebarOpen(v => !v)}
        >
          <i className="fas fa-bars" />
        </button>

        {/* Sidebar */}
        <aside className={`dashboard-sidebar${sidebarOpen ? ' show' : ''}`} id="sidebar">
          <div className="sidebar-logo">
            <img
              src="/logo.png" alt="Logo" style={{ height: 40 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <span>KALA VRIKSHA</span>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <a
                key={item.id}
                className={`nav-link-item${activeSection === item.id ? ' active' : ''}`}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              >
                <i className={`fas ${item.icon}`} /> <span>{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={doLogout}>
              <i className="fas fa-sign-out-alt" /> <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="dashboard-main">
          {/* Top Nav */}
          <header className="top-nav glass-panel mb-4 p-3 d-flex justify-content-between align-items-center">
            <div className="search-bar position-relative" style={{ width: 300 }}>
              <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control bg-dark border-secondary text-light ps-5 rounded-pill"
                placeholder="Search resources..."
              />
            </div>
            <div className="d-flex align-items-center gap-4">
              <div className="user-profile dropdown">
                <div
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=D4AF37&color=000`}
                    alt="Avatar"
                    className="rounded-circle border border-warning"
                    width="40" height="40"
                  />
                  <span className="ms-2 d-none d-md-inline text-light fw-bold">
                    {firstName} <i className="fas fa-chevron-down ms-1 small" />
                  </span>
                </div>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setActiveSection('settings')}
                    >
                      <i className="fas fa-user-circle me-2" />Profile Settings
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={doLogout}>
                      <i className="fas fa-sign-out-alt me-2" />Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </header>

          {/* ── OVERVIEW ─────────────────────────────────── */}
          {activeSection === 'overview' && (
            <section>
              <h2 className="section-title mb-4">Welcome back, {firstName} ✨</h2>
              <div className="row g-4 mb-5">
                {[
                  { sec: 'wellness', icon: 'fa-om', color: 'text-warning', label: 'Start Meditation' },
                  { sec: 'wellness', icon: 'fa-star', color: 'text-success', label: 'Daily Affirmation' },
                  { sec: 'calmme',  icon: 'fa-spa', color: 'text-primary',  label: 'Calm Me' },
                ].map(c => (
                  <div className="col-md-4" key={c.label}>
                    <div
                      className="quick-access-card glass-panel text-center p-4"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveSection(c.sec)}
                    >
                      <div className="icon-circle mb-3 mx-auto">
                        <i className={`fas ${c.icon} fa-2x ${c.color}`} />
                      </div>
                      <h5>{c.label}</h5>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row g-4">
                {/* Wellness Progress */}
                <div className="col-lg-5">
                  <div className="glass-panel h-100">
                    <h4 className="mb-4">Wellness Progress</h4>
                    {[
                      { icon: 'fa-fire', col: 'text-warning', bg: 'bg-warning', val: 0, label: 'Meditation Streak', unit: 'Days' },
                      { icon: 'fa-pen-nib', col: 'text-info', bg: 'bg-info', val: 0, label: 'Journaling Streak', unit: 'Days' },
                      { icon: 'fa-wind', col: 'text-success', bg: 'bg-success', val: 0, label: 'Completed Breathing Sessions', unit: '' },
                    ].map(s => (
                      <div className="stat-item d-flex align-items-center mb-4" key={s.label}>
                        <div className={`stat-icon p-3 rounded-circle ${s.bg} bg-opacity-10 me-3`}>
                          <i className={`fas ${s.icon} ${s.col} fs-4`} />
                        </div>
                        <div>
                          <span className="d-block h3 mb-0">{s.val} {s.unit}</span>
                          <span className="small text-white-50">{s.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events Summary */}
                <div className="col-lg-7">
                  <div className="glass-panel h-100">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">Upcoming Events</h4>
                      <button
                        className="btn btn-outline-gold btn-sm"
                        onClick={() => setActiveSection('events')}
                      >
                        View All
                      </button>
                    </div>
                    {events.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="fas fa-calendar-times fa-2x text-warning mb-3 opacity-50" />
                        <p className="text-white-50">No upcoming events available</p>
                      </div>
                    ) : events.slice(0, 4).map(ev => (
                      <div key={ev._id || ev.id} className="d-flex align-items-center p-3 mb-3 border border-secondary border-opacity-50 rounded-3">
                        <div className="bg-dark text-center p-2 rounded-3 me-3 border border-warning" style={{ minWidth: 55 }}>
                          <span className="d-block small text-warning text-uppercase">
                            {new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="d-block fs-4 fw-bold">{new Date(ev.date).getDate()}</span>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1">{ev.title || ev.name}</h5>
                          <p className="text-white-50 small mb-0">
                            <i className={`fas ${ev.type === 'online' ? 'fa-video' : 'fa-map-marker-alt'} text-warning me-1`} />
                            {ev.type === 'online' ? 'Online' : ev.venue}
                          </p>
                        </div>
                        {registeredEventIds.includes(ev._id || ev.id) ? (
                          <button className="btn btn-secondary btn-sm" disabled>Registered</button>
                        ) : (
                          <button className="btn btn-glow btn-sm" onClick={() => setPaymentModal(ev)}>
                            Register
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── EVENTS ───────────────────────────────────── */}
          {activeSection === 'events' && (
            <section>
              <h2 className="section-title mb-4">Events Directory</h2>
              <div className="row g-4">
                {events.length === 0 ? (
                  <div className="col-12">
                    <div className="glass-panel text-center py-5">
                      <i className="fas fa-calendar-times fa-3x text-warning mb-4 opacity-50" />
                      <h4>No Events Available</h4>
                      <p className="text-white-50">Check back later for upcoming spiritual events.</p>
                    </div>
                  </div>
                ) : events.map(ev => (
                  <div className="col-md-6 col-lg-4" key={ev._id || ev.id}>
                    <div className="card bg-dark text-light border-secondary h-100 overflow-hidden" style={{ borderRadius: 20 }}>
                      <div className="position-relative">
                        <div style={{ 
                          width: '100%', 
                          height: '250px', 
                          overflow: 'hidden',
                          borderRadius: '12px 12px 0 0'
                        }}>
                          <img
                            src={ev.image && ev.image.trim() !== ""
                              ? ev.image
                              : "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400"}
                            alt={ev.title || "Event"}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              backgroundColor: '#1a2a1a',
                              borderRadius: '12px 12px 0 0',
                              display: 'block',
                            }}
                          />
                        </div>
                        <span className="position-absolute top-0 end-0 bg-warning text-dark px-3 py-1 m-3 rounded-pill fw-bold">
                          ₹{ev.price || '499'}
                        </span>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-2">
                          <span className={`badge ${ev.type === 'online' ? 'bg-info text-dark' : 'bg-success text-white'} px-2 py-1 rounded-pill small`}>
                            {ev.type === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <h4 className="card-title text-warning">{ev.title || ev.name}</h4>
                        <p className="card-text text-white-50 small">{ev.description || ev.about}</p>
                        <ul className="list-unstyled mb-4 small">
                          <li className="mb-2"><i className="fas fa-user-tie text-warning me-2" /><strong>Guide:</strong> {ev.preacher}</li>
                          <li className="mb-2"><i className="far fa-calendar-alt text-warning me-2" /><strong>Date:</strong> {new Date(ev.date).toLocaleDateString('en-IN')}</li>
                          <li className="mb-2"><i className={`fas ${ev.type === 'online' ? 'fa-video' : 'fa-map-marker-alt'} text-warning me-2`} /><strong>Location:</strong> {ev.type === 'online' ? 'Online Event' : ev.venue}</li>
                        </ul>
                        {registeredEventIds.includes(ev._id || ev.id) ? (
                          <button className="btn btn-secondary w-100" disabled>Already Registered</button>
                        ) : (
                          <button className="btn btn-glow w-100" onClick={() => setPaymentModal(ev)}>
                            Register &amp; Pay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── WELLNESS ─────────────────────────────────── */}
          {activeSection === 'wellness' && (
            <section>
              <h2 className="section-title mb-4">Daily Wellness</h2>
              <div className="row g-4">
                {/* Affirmations */}
                <div className="col-lg-6">
                  <div className="glass-panel text-center h-100 d-flex flex-column justify-content-center py-5">
                    <i className="fas fa-quote-left fa-3x mb-4 text-warning opacity-50" />
                    <h3
                      className="mb-5 text-light px-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      &ldquo;{affirmation}&rdquo;
                    </h3>
                    <button
                      className="btn btn-outline-gold rounded-pill px-4 py-2 mx-auto"
                      style={{ maxWidth: 280 }}
                      onClick={() => setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)])}
                    >
                      <i className="fas fa-sync-alt me-2" />Generate New Affirmation
                    </button>
                  </div>
                </div>

                {/* Breathing */}
                <div className="col-lg-6">
                  <BreathingExercise />
                </div>

                {/* Journal */}
                <div className="col-12">
                  <div className="glass-panel">
                    <h4 className="text-warning mb-4">
                      <i className="fas fa-book-open me-2" />Daily Journal
                    </h4>
                    <div className="row mt-3">
                      <div className="col-md-3 mb-3">
                        <input
                          type="date"
                          className="form-control bg-dark text-light border-secondary"
                          value={journalDate}
                          onChange={e => setJournalDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <textarea
                      className="form-control bg-dark text-light border-secondary mb-3 p-3 rounded-3"
                      rows="6"
                      placeholder="Write your thoughts here... How are you feeling today? Let your soul speak."
                      value={journalText}
                      onChange={e => setJournalText(e.target.value)}
                    />
                    <button
                      className="btn btn-glow px-4 rounded-pill"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const entries = JSON.parse(localStorage.getItem('kv_journal') || '[]');
                          entries.push({ date: journalDate, text: journalText, saved: new Date().toISOString() });
                          localStorage.setItem('kv_journal', JSON.stringify(entries));
                          showSuccess('Journal entry saved!');
                        }
                      }}
                    >
                      <i className="fas fa-save me-2" />Save Entry
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── CALM ME ──────────────────────────────────── */}
          {activeSection === 'calmme' && (
            <section>
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <h2 className="section-title text-center mb-4">
                    Calm Me <i className="fas fa-leaf text-success ms-2" />
                  </h2>
                  <p className="text-center text-white-50 mb-4">
                    Your virtual spiritual guide is here to listen and guide you back to peace.
                  </p>
                  <CalmMeChat fullname={user.fullname} />
                </div>
              </div>
            </section>
          )}

          {/* ── PAYMENT HISTORY ──────────────────────────── */}
          {activeSection === 'payment-history' && (
            <section>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2 className="section-title mb-0">Payment History</h2>
              </div>
              <div className="glass-panel p-0 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0 custom-table-ui align-middle">
                    <thead className="border-bottom border-secondary">
                      <tr>
                        <th className="py-3 px-4 text-warning fw-normal">Event Name</th>
                        <th className="py-3 px-4 text-warning fw-normal">Payment ID</th>
                        <th className="py-3 px-4 text-warning fw-normal">Date</th>
                        <th className="py-3 px-4 text-warning fw-normal">Amount</th>
                        <th className="py-3 px-4 text-warning fw-normal">Status</th>
                        <th className="py-3 px-4 text-warning fw-normal">Join</th>
                        <th className="py-3 px-4 text-warning fw-normal text-end">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(registrations || []).length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-white-50">
                            No transaction history found.
                          </td>
                        </tr>
                      ) : registrations?.map(reg => {
                        const ev = events.find(e => (e._id || e.id) === (reg.eventId?._id || reg.eventId));
                        const evTitle = reg.eventId?.title || reg.eventName || 'N/A';
                        const regDateStr = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : 'N/A';
                        const amount = ev?.price || reg.eventId?.price || '499';
                        return (
                          <tr key={reg._id || reg.id}>
                            <td className="px-4 py-3 fw-bold">{evTitle}</td>
                            <td className="px-4 py-3 text-white-50" style={{ fontFamily: 'monospace' }}>{reg.transactionId}</td>
                            <td className="px-4 py-3">{regDateStr}</td>
                            <td className="px-4 py-3 text-success">₹{amount}</td>
                            <td className="px-4 py-3">
                              {reg.paymentStatus === 'verified'
                                ? <span className="badge bg-success px-3 py-2 rounded-pill">Confirmed</span>
                                : <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Pending</span>
                              }
                            </td>
                            <td className="px-4 py-3">
                              {(() => {
                                const isConfirmed = reg.paymentStatus === 'verified' || reg.paymentStatus === 'confirmed';
                                const eventType = (reg.eventType || reg.eventId?.type || '').toLowerCase().trim();
                                const joinLink = eventType === 'online' ? reg.classLink || reg.eventId?.classLink : reg.whatsappLink || reg.eventId?.whatsappLink;

                                console.log('JOIN DEBUG:', {
                                  event: reg.eventName || reg.eventId?.title,
                                  isConfirmed,
                                  eventType,
                                  classLink: reg.classLink,
                                  whatsappLink: reg.whatsappLink,
                                  joinLink,
                                  rawEventId: reg.eventId
                                });

                                if (isConfirmed && joinLink && joinLink.trim() !== '') {
                                  return (
                                    <a
                                      href={joinLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-success rounded-pill px-3"
                                      style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                    >
                                      {eventType === 'online' ? '🔗 Join Class' : '💬 WhatsApp'}
                                    </a>
                                  );
                                }
                                return <span className="text-white-50">—</span>;
                              })()}
                            </td>
                            <td className="px-4 py-3 text-end">
                              {reg.paymentStatus === 'verified' ? (
                                <button
                                  className="btn btn-sm btn-outline-light rounded-pill px-3"
                                  onClick={() => downloadReceipt(reg)}
                                >
                                  <i className="fas fa-file-invoice me-1" />Receipt
                                </button>
                              ) : (
                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" disabled>
                                  <i className="fas fa-file-invoice me-1" />Receipt
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ── SETTINGS ─────────────────────────────────── */}
          {activeSection === 'settings' && (
            <section>
              <h2 className="section-title mb-4">Profile Settings</h2>
              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="glass-panel text-center h-100 d-flex flex-column justify-content-center py-5">
                    <div className="position-relative d-inline-block mx-auto mb-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=D4AF37&color=000&size=150`}
                        className="rounded-circle border border-3 border-warning"
                        alt="Profile"
                        width="150" height="150"
                      />
                    </div>
                    <h3 className="mb-1 text-warning">{user.fullname}</h3>
                    <p className="text-white-50">Sacred Seeker</p>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="glass-panel text-light">
                    <h5 className="mb-3 text-warning border-bottom border-secondary pb-2">
                      <i className="fas fa-id-card me-2" />Personal Information
                    </h5>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-white-50 small">Full Name</label>
                        <input type="text" className="form-control border-secondary bg-dark text-light rounded-3" defaultValue={user.fullname} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white-50 small">Email</label>
                        <input type="email" className="form-control border-secondary bg-dark text-light rounded-3" defaultValue={user.email} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white-50 small">Phone Number</label>
                        <input type="text" className="form-control border-secondary bg-dark text-light rounded-3" defaultValue={user.phone || ''} />
                      </div>
                    </div>

                    <h5 className="mb-3 text-warning border-bottom border-secondary pb-2">
                      <i className="fas fa-lock me-2" />Security
                    </h5>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-white-50 small">New Password</label>
                        <input type="password" className="form-control border-secondary bg-dark text-light rounded-3" placeholder="Leave blank to keep current" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white-50 small">Confirm Password</label>
                        <input type="password" className="form-control border-secondary bg-dark text-light rounded-3" placeholder="Leave blank to keep current" />
                      </div>
                    </div>

                    <h5 className="mb-3 text-warning border-bottom border-secondary pb-2">
                      <i className="fas fa-sliders-h me-2" />Preferences
                    </h5>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="form-check form-switch mb-3">
                          <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                          <label className="form-check-label ms-2" htmlFor="emailNotif">
                            Email Notifications For Events
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white-50 small">Daily Meditation Reminder Time</label>
                        <input type="time" className="form-control border-secondary bg-dark text-light rounded-3" defaultValue="08:00" />
                      </div>
                    </div>

                    <div className="text-end mt-5">
                      <button className="btn btn-glow px-5 rounded-pill" onClick={() => showToast('Settings saved!')}>
                        <i className="fas fa-save me-2" />Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <PaymentModal
          event={paymentModal}
          user={user}
          onClose={() => setPaymentModal(null)}
          onSuccess={async msg => {
            showToast(msg);
            await afterPayment();
          }}
        />
      )}
    </>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const { getSession } = await import('../lib/session');
    const session = getSession(req);
    if (!session) {
      return { redirect: { destination: '/login', permanent: false } };
    }

    const { default: dbConnect } = await import('../lib/mongodb');
    const { default: Event } = await import('../models/Event');
    const { default: Registration } = await import('../models/Registration');

    await dbConnect();

    const events = await Event.find().sort({ date: 1 }).lean()
      .then(docs => docs.map(d => ({ ...d, _id: d._id.toString() })));

    const userRegs = await Registration.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .populate('eventId', 'title date price type classLink whatsappLink')
      .lean()
      .then(docs => docs.map(d => ({
        ...d,
        _id: d._id.toString(),
        eventId: d.eventId ? { ...d.eventId, _id: d.eventId._id?.toString() } : d.eventId,
        // Flatten event join fields directly onto the registration for easy access
        classLink: d.eventId?.classLink || '',
        whatsappLink: d.eventId?.whatsappLink || '',
        eventType: d.eventId?.type || '',
      })));

    return {
      props: {
        user: session,
        events: JSON.parse(JSON.stringify(events)),
        registrations: JSON.parse(JSON.stringify(userRegs))
      }
    };
  } catch (err) {
    console.error('[Dashboard] getServerSideProps error:', err);
    return { props: { user: {}, events: [], registrations: [] } };
  }
}
