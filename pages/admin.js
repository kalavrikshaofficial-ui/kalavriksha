import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ParticleBackground from '../components/ParticleBackground';

export default function AdminPage({ user, events: initEvents, registrations: initRegs, interactions: initInteractions }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState(initEvents);
  const [registrations, setRegistrations] = useState(initRegs);
  const [interactions] = useState(initInteractions);
  const [successMsg, setSuccessMsg] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', venue: '', date: '', about: '', preacher: '', price: '' });
  const [submitting, setSubmitting] = useState(false);

  const showSuccess = msg => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const doLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  const addEvent = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...newEvent }),
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => [...prev, data.event]);
        setNewEvent({ name: '', venue: '', date: '', about: '', preacher: '', price: '' });
        setShowAddEvent(false);
        showSuccess('Sacred event added to the records.');
      }
    } catch {
      alert('Failed to add event.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEvent = async id => {
    if (!window.confirm('Do you wish to dissolve this event?')) return;
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    if ((await res.json()).success) {
      setEvents(prev => prev.filter(e => e.id !== id));
      showSuccess('Event removed from existence.');
    }
  };

  const verifyPayment = async regId => {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_payment', reg_id: regId }),
    });
    if ((await res.json()).success) {
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, paymentStatus: 'verified' } : r));
      showSuccess('Payment verified successfully.');
    }
  };

  const pendingCount = registrations.filter(r => r.paymentStatus !== 'verified').length;

  const tabs = [
    { id: 'dashboard',     icon: 'fa-chart-line',      label: 'Insights Dashboard' },
    { id: 'events',        icon: 'fa-calendar-alt',    label: 'Sacred Events' },
    { id: 'interactions',  icon: 'fa-comment-dots',    label: 'Interactions' },
    { id: 'payments',      icon: 'fa-receipt',         label: 'Payment Records' },
  ];

  return (
    <>
      <Head><title>High Priest&apos;s Sanctum | Admin | Kala Vriksha</title></Head>
      <ParticleBackground />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Admin Sidebar */}
        <aside style={{
          width: 280, minHeight: '100vh', position: 'fixed',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.1)', padding: 30,
        }}>
          <div className="mb-5 text-center">
            <img src="/logo.png" style={{ height: 50 }} className="mb-3"
              onError={e => { e.target.style.display = 'none'; }} alt="Logo" />
            <h4 className="gold-gradient-text">SANCTUM</h4>
            <p className="small opacity-50">High Priest {user.fullname}</p>
          </div>
          <ul className="nav flex-column">
            {tabs.map(t => (
              <li className="nav-item" key={t.id}>
                <a
                  className={`nav-link-admin${activeTab === t.id ? ' active' : ''}`}
                  style={{
                    color: activeTab === t.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)',
                    textDecoration: 'none', padding: '15px 20px', borderRadius: 12,
                    display: 'block', marginBottom: 10, transition: '0.3s',
                    background: activeTab === t.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab(t.id)}
                >
                  <i className={`fas ${t.icon} me-2`} /> {t.label}
                </a>
              </li>
            ))}
            <li className="mt-5">
              <Link href="/" className="nav-link-admin" style={{ color: '#17a2b8', textDecoration: 'none', padding: '15px 20px', display: 'block', borderRadius: 12 }}>
                <i className="fas fa-eye me-2" /> View Site
              </Link>
              <button
                onClick={doLogout}
                style={{ background: 'none', border: 'none', color: '#ff4757', padding: '15px 20px', display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer', borderRadius: 12 }}
              >
                <i className="fas fa-sign-out-alt me-2" /> Exit Sanctum
              </button>
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main style={{ marginLeft: 280, padding: 40, flex: 1 }}>
          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show bg-dark text-success border-success mb-4">
              {successMsg}
              <button type="button" className="btn-close btn-close-white" onClick={() => setSuccessMsg('')} />
            </div>
          )}

          {/* ── INSIGHTS DASHBOARD ───────────────────────── */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="gold-gradient-text">Insights Dashboard</h2>
                <div className="small opacity-50">Live data from Sacred Spreadsheet</div>
              </div>

              {/* Stats row */}
              <div className="row g-4 mb-4">
                {[
                  { label: 'Total Events', val: events.length, icon: 'fa-calendar-alt', color: 'text-warning' },
                  { label: 'Registrations', val: registrations.length, icon: 'fa-users', color: 'text-info' },
                  { label: 'Pending Verifications', val: pendingCount, icon: 'fa-clock', color: 'text-warning' },
                  { label: 'Contact Messages', val: interactions.length, icon: 'fa-envelope', color: 'text-success' },
                ].map(s => (
                  <div className="col-md-3" key={s.label}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 25, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                      <i className={`fas ${s.icon} fa-2x ${s.color} mb-3`} />
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold-secondary)' }}>{s.val}</div>
                      <p className="text-white-50 small mt-1 mb-0">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Sheets Embed */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--gold-primary)', borderRadius: 20, padding: 0, overflow: 'hidden', height: '60vh' }}>
                <iframe
                  src="https://docs.google.com/spreadsheets/d/1veWxcWF8pLVZij_e8sUEwUpUyWqtMKJ2hZhzbQbIWUI/htmlembed?widget=true&headers=false"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Sacred Spreadsheet"
                />
              </div>
              <div className="text-center mt-4">
                <a
                  href="https://docs.google.com/spreadsheets/d/1veWxcWF8pLVZij_e8sUEwUpUyWqtMKJ2hZhzbQbIWUI/edit?usp=sharing"
                  target="_blank" rel="noreferrer"
                  className="btn btn-glow btn-sm mx-2"
                >
                  <i className="fas fa-edit me-1" /> Edit Data
                </a>
              </div>
            </div>
          )}

          {/* ── EVENTS ───────────────────────────────────── */}
          {activeTab === 'events' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="gold-gradient-text">Sacred Events</h2>
                <button className="btn btn-glow" onClick={() => setShowAddEvent(v => !v)}>
                  <i className={`fas fa-${showAddEvent ? 'times' : 'plus'} me-2`} />
                  {showAddEvent ? 'Cancel' : 'Manifest Event'}
                </button>
              </div>

              {/* Add Event Form */}
              {showAddEvent && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 30, marginBottom: 30 }}>
                  <h5 className="gold-gradient-text mb-4">Manifest New Event</h5>
                  <form onSubmit={addEvent}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Event Name</label>
                        <input type="text" className="form-control" placeholder="e.g. Awakening the Inner Self" required
                          value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Venue</label>
                        <input type="text" className="form-control" placeholder="Bangalore Heights" required
                          value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" required
                          value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Preacher / Guide</label>
                        <input type="text" className="form-control" placeholder="e.g. Swami Atmananda" required
                          value={newEvent.preacher} onChange={e => setNewEvent({ ...newEvent, preacher: e.target.value })} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Price (₹)</label>
                        <input type="number" className="form-control" placeholder="e.g. 499" required
                          value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">About Event</label>
                        <textarea className="form-control" rows="3" placeholder="Deep dive into mystical roots..."
                          value={newEvent.about} onChange={e => setNewEvent({ ...newEvent, about: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-glow px-5" disabled={submitting}>
                          {submitting ? 'Manifesting...' : 'Manifest Now'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden' }}>
                <div className="table-responsive">
                  <table className="table" style={{ color: '#fff', marginBottom: 0 }}>
                    <thead>
                      <tr>
                        {['Title','Date','Venue','Preacher','Price','Status','Action'].map(h => (
                          <th key={h} style={{ borderBottom: '2px solid var(--gold-accent)', color: 'var(--gold-primary)', padding: 15 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {events.length === 0 ? (
                        <tr><td colSpan="7" className="text-center opacity-50 py-4">No events have been manifested yet.</td></tr>
                      ) : events.map(ev => (
                        <tr key={ev.id}>
                          <td className="fw-bold" style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{ev.name}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{new Date(ev.date).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{ev.venue}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{ev.preacher}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>₹{ev.price || 'Free'}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            <span style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--gold-secondary)', border: '1px solid var(--gold-primary)', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem' }}>
                              {ev.status ? ev.status.charAt(0).toUpperCase() + ev.status.slice(1) : 'Upcoming'}
                            </span>
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            <button
                              className="btn btn-sm"
                              style={{ color: '#ff4d4d', border: '1px solid #ff4d4d', background: 'transparent' }}
                              onClick={() => deleteEvent(ev.id)}
                            >
                              <i className="fas fa-trash-alt" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── INTERACTIONS ─────────────────────────────── */}
          {activeTab === 'interactions' && (
            <div>
              <h2 className="gold-gradient-text mb-4">Divine Interactions</h2>
              {interactions.length === 0 ? (
                <p className="opacity-50 text-center">The silence is golden. No interactions yet.</p>
              ) : (
                <div className="row g-4">
                  {interactions.map((msg, i) => (
                    <div className="col-md-6" key={i}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 30, backdropFilter: 'blur(10px)' }}>
                        <div className="d-flex justify-content-between mb-3">
                          <h5 className="text-warning">{msg.name}</h5>
                          <small className="opacity-50">
                            {new Date(msg.date).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                        <p className="mb-2"><i className="fas fa-envelope me-2 opacity-50" />{msg.email}</p>
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 10, fontSize: '0.9rem' }}>
                          &ldquo;{msg.message}&rdquo;
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PAYMENTS ─────────────────────────────────── */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="gold-gradient-text mb-4">Registration &amp; Payment Portals</h2>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden' }}>
                <div className="table-responsive">
                  <table className="table align-middle" style={{ color: '#fff', marginBottom: 0 }}>
                    <thead>
                      <tr>
                        {['Event Name','User Info','Phone','Txn ID','Date','Proof','Status','Action'].map(h => (
                          <th key={h} style={{ borderBottom: '2px solid var(--gold-accent)', color: 'var(--gold-primary)', padding: 15 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.length === 0 ? (
                        <tr><td colSpan="8" className="text-center opacity-50 py-4">No registrations submitted yet.</td></tr>
                      ) : registrations.map(reg => (
                        <tr key={reg.id}>
                          <td className="fw-bold text-warning" style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{reg.eventName}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            <div>{reg.userName}</div>
                            <div className="small opacity-50">{reg.userEmail}</div>
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{reg.userPhone}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle', color: '#17a2b8', fontFamily: 'monospace' }}>{reg.transactionId}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle', fontSize: '0.85rem', opacity: 0.75 }}>
                            {new Date(reg.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            {reg.proofPath ? (
                              <a href={reg.proofPath} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info">
                                <i className="fas fa-image" /> View
                              </a>
                            ) : <span className="opacity-50 small">No file</span>}
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            {reg.paymentStatus === 'verified' ? (
                              <span style={{ background: 'rgba(46,204,113,0.2)', color: '#2ecc71', border: '1px solid #2ecc71', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem' }}>Verified</span>
                            ) : (
                              <span style={{ background: 'rgba(255,193,7,0.2)', color: '#ffc107', border: '1px solid #ffc107', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem' }}>Pending</span>
                            )}
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            {reg.paymentStatus !== 'verified' ? (
                              <button className="btn btn-sm btn-glow px-3 py-1 text-dark" style={{ fontSize: '0.8rem' }} onClick={() => verifyPayment(reg.id)}>
                                Verify
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-outline-secondary px-3 py-1" disabled style={{ fontSize: '0.8rem' }}>Done</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { getSession } = await import('../lib/session');
  const { readData } = await import('../lib/data');

  const session = getSession(req);
  if (!session || session.role !== 'admin') {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const events = readData('events');
  const registrations = readData('registrations')
    .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
  const interactions = readData('interactions')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return { props: { user: session, events, registrations, interactions } };
}
