import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import ParticleBackground from '../components/ParticleBackground';

export default function AdminPage({ user = {}, events: initEvents = [], registrations: initRegs = [], interactions: initInteractions = [] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('events'); // Changed default to events for better UX
  const [events, setEvents] = useState(initEvents || []);
  const [registrations, setRegistrations] = useState(initRegs || []);
  const [interactions] = useState(initInteractions || []);
  const [loading, setLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'offline', venue: '', classLink: '', whatsappLink: '', date: '', description: '', preacher: '', price: '' });
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingEvent, setEditingEvent] = useState(null); // holds the event being edited
  const [editSubmitting, setEditSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size should be less than 5MB', 'error');
      e.target.value = null;
      return;
    }
    // const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    // if (!ok) {
    //   showToast('Only JPG/PNG/WEBP images allowed', 'error');
    //   e.target.value = null;
    //   return;
    // }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const doLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    showToast('Logged out from the inner sanctuary.');
    router.push('/');
  };

  const addEvent = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('action', 'add');
      Object.entries(newEvent || {}).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        formData.append(k, String(v));
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const res = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setEvents(prev => [...prev, data.event]);
        setNewEvent({ title: '', type: 'offline', venue: '', classLink: '', whatsappLink: '', date: '', description: '', preacher: '', price: '' });
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview('');
        setShowAddEvent(false);
        showToast('Sacred event added to the records.');
      } else {
        showToast(data.error || 'Failed to add event.', 'error');
      }
    } catch (err) {
      console.error('[Admin] addEvent error:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const updateEvent = async e => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: editingEvent._id || editingEvent.id, ...editingEvent }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.map(ev => String(ev._id || ev.id) === String(data.event._id) ? data.event : ev));
        setEditingEvent(null);
        showToast('Event updated successfully.');
      } else {
        showToast(data.error || 'Update failed.', 'error');
      }
    } catch (err) {
      console.error('[Admin] updateEvent error:', err);
      showToast('Network error. Could not update event.', 'error');
    } finally {
      setEditSubmitting(false);
    }
  };

  const deleteEvent = async id => {
    if (!window.confirm('Do you wish to dissolve this event?')) return;
    try {
      const formData = new FormData();
      formData.append('action', 'delete');
      formData.append('eventId', id);
      
      const res = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.filter(e => String(e._id || e.id) !== String(id)));
        showToast('Event removed from existence.');
      }
    } catch (err) {
      console.error('[Admin] deleteEvent error:', err);
      showToast('Network error. Could not delete event.', 'error');
    }
  };

  const verifyPayment = async regId => {
    setLoading(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_payment', reg_id: regId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev => prev.map(r => String(r._id || r.id) === String(regId) ? { ...r, paymentStatus: 'verified', ...(data.reg || {}) } : r));
        showToast('Payment verified successfully.');
      } else {
        showToast(data.error || 'Verification failed.', 'error');
      }
    } catch (err) {
      console.error('[Admin] verifyPayment error:', err);
      showToast('Network error. Could not verify payment.', 'error');
    } finally {
      setLoading(false);
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
      <Head>
        <title>Admin | Kala Vriksha</title>
        <meta name="description" content="Kala Vriksha Admin Dashboard - manage events, registrations, and sacred community." />
        <meta name="robots" content="noindex" />
      </Head>
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
                        <label className="form-label">Event Title</label>
                        <input type="text" className="form-control" placeholder="e.g. Awakening the Inner Self" required
                          value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Type</label>
                        <select className="form-control" value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}>
                          <option value="offline">Offline</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label text-warning">Upload Event Image</label>
                        <input
                          type="file"
                          accept="*/*"
                          className="form-control"
                          onChange={handleImageChange}
                          style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(212,175,55,0.35)', color: '#fff' }}
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
                          />
                        )}
                      </div>
                      {newEvent.type === 'offline' && (
                        <div className="col-md-6">
                          <label className="form-label">Venue</label>
                          <input type="text" className="form-control" placeholder="e.g. Bangalore Heights" required
                            value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} />
                        </div>
                      )}
                      {newEvent.type === 'offline' && (
                        <div className="col-md-6">
                          <label className="form-label">WhatsApp Join Link</label>
                          <input type="url" className="form-control" placeholder="e.g. https://chat.whatsapp.com/..."
                            value={newEvent.whatsappLink} onChange={e => setNewEvent({ ...newEvent, whatsappLink: e.target.value })} />
                        </div>
                      )}
                      {newEvent.type === 'online' && (
                        <div className="col-md-6">
                          <label className="form-label">Class Link (GMeet/Zoom/Drive)</label>
                          <input
                            type="url"
                            className="form-control"
                            placeholder="e.g. https://meet.google.com/..."
                            value={newEvent.classLink}
                            onChange={e => setNewEvent({ ...newEvent, classLink: e.target.value })}
                          />
                        </div>
                      )}
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
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" placeholder="Deep dive into mystical roots..." required
                          value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
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
                        {['Title','Date','Type/Location','Preacher','Price','Action'].map(h => (
                          <th key={h} style={{ borderBottom: '2px solid var(--gold-accent)', color: 'var(--gold-primary)', padding: 15 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(events || []).length === 0 ? (
                        <tr><td colSpan="7" className="text-center opacity-50 py-4">No events have been manifested yet.</td></tr>
                      ) : events?.map(ev => (
                        <tr key={ev._id || ev.id}>
                          <td className="fw-bold" style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{ev.title || ev.name}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{new Date(ev.date).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            {ev.type === 'online' ? '🔗 Online' : `📍 ${ev.venue || 'N/A'}`}
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{ev.preacher}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>₹{ev.price || 'Free'}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                className="btn btn-sm"
                                style={{ color: '#d4af37', border: '1px solid #d4af37', background: 'transparent' }}
                                title="Edit Event"
                                onClick={() => setEditingEvent(
                                  editingEvent && String(editingEvent._id || editingEvent.id) === String(ev._id || ev.id)
                                    ? null
                                    : { ...ev, date: ev.date ? ev.date.slice(0, 10) : '' }
                                )}
                              >
                                <i className={`fas fa-${editingEvent && String(editingEvent._id || editingEvent.id) === String(ev._id || ev.id) ? 'times' : 'pen'}`} />
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{ color: '#ff4d4d', border: '1px solid #ff4d4d', background: 'transparent' }}
                                onClick={() => deleteEvent(ev._id || ev.id)}
                              >
                                <i className="fas fa-trash-alt" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Inline Edit Panel ── */}
              {editingEvent && (
                <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: 30, marginTop: 24 }}>
                  <h5 className="gold-gradient-text mb-4"><i className="fas fa-pen me-2" />Edit Event: {editingEvent.title}</h5>
                  <form onSubmit={updateEvent}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Event Title</label>
                        <input type="text" className="form-control" required
                          value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Type</label>
                        <select className="form-control" value={editingEvent.type} onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })}>
                          <option value="offline">Offline</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                      {editingEvent.type === 'offline' && (
                        <div className="col-md-6">
                          <label className="form-label">Venue</label>
                          <input type="text" className="form-control" placeholder="e.g. Bangalore Heights"
                            value={editingEvent.venue || ''} onChange={e => setEditingEvent({ ...editingEvent, venue: e.target.value })} />
                        </div>
                      )}
                      {editingEvent.type === 'offline' && (
                        <div className="col-md-6">
                          <label className="form-label">WhatsApp Join Link</label>
                          <input type="url" className="form-control" placeholder="e.g. https://chat.whatsapp.com/..."
                            value={editingEvent.whatsappLink || ''} onChange={e => setEditingEvent({ ...editingEvent, whatsappLink: e.target.value })} />
                        </div>
                      )}
                      {editingEvent.type === 'online' && (
                        <div className="col-md-6">
                          <label className="form-label">Class Link (GMeet/Zoom/Drive)</label>
                          <input type="url" className="form-control" placeholder="e.g. https://meet.google.com/..."
                            value={editingEvent.classLink || ''} onChange={e => setEditingEvent({ ...editingEvent, classLink: e.target.value })} />
                        </div>
                      )}
                      <div className="col-md-4">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" required
                          value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Preacher / Guide</label>
                        <input type="text" className="form-control" required
                          value={editingEvent.preacher} onChange={e => setEditingEvent({ ...editingEvent, preacher: e.target.value })} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Price (₹)</label>
                        <input type="number" className="form-control" required
                          value={editingEvent.price} onChange={e => setEditingEvent({ ...editingEvent, price: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" required
                          value={editingEvent.description} onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                      </div>
                      <div className="col-12 d-flex gap-3">
                        <button type="submit" className="btn btn-glow px-5" disabled={editSubmitting}>
                          {editSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setEditingEvent(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── INTERACTIONS ─────────────────────────────── */}
          {activeTab === 'interactions' && (
            <div>
              <h2 className="gold-gradient-text mb-4">Divine Interactions</h2>
              {(interactions || []).length === 0 ? (
                <p className="opacity-50 text-center">The silence is golden. No interactions yet.</p>
              ) : (
                <div className="row g-4">
                  {interactions?.map((msg, i) => (
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
                      {(registrations || []).length === 0 ? (
                        <tr><td colSpan="8" className="text-center opacity-50 py-4">No registrations submitted yet.</td></tr>
                      ) : registrations?.map(reg => {
                        // Support both populated objects and snapshot string fields
                        const evName = reg.eventId?.title || reg.eventName || 'N/A';
                        const uName = reg.userId?.name || reg.userName || 'N/A';
                        const uEmail = reg.userId?.email || reg.userEmail || '';
                        const uPhone = reg.userId?.phone || reg.userPhone || 'N/A';
                        const regDate = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A';
                        return (
                        <tr key={reg._id || reg.id}>
                          <td className="fw-bold text-warning" style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{evName}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            <div>{uName}</div>
                            <div className="small opacity-50">{uEmail}</div>
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>{uPhone}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle', color: '#17a2b8', fontFamily: 'monospace' }}>{reg.transactionId}</td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle', fontSize: '0.85rem', opacity: 0.75 }}>
                            {regDate}
                          </td>
                          <td style={{ padding: 15, borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' }}>
                            {reg.paymentScreenshot ? (
                              <button className="btn btn-sm btn-outline-info" onClick={() => {
                                const w = window.open('');
                                if(w) w.document.write(`<body style="background:#111;text-align:center;color:#fff;margin:0;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${reg.paymentScreenshot}" style="max-width:100%;max-height:100vh;"/><p style="position:absolute;bottom:10px;font-family:sans-serif;">Payment for ${evName}</p></body>`);
                              }}>View</button>
                            ) : '-'}
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
                              <button className="btn btn-sm btn-glow px-3 py-1 text-dark d-flex align-items-center" style={{ fontSize: '0.8rem' }} onClick={() => verifyPayment(reg._id || reg.id)} disabled={loading}>
                                {loading ? <Spinner size="0.8rem" color="#000" className="me-2" /> : null}
                                Verify
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-outline-secondary px-3 py-1" disabled style={{ fontSize: '0.8rem' }}>Done</button>
                            )}
                          </td>
                        </tr>
                      );
                      })}
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
  try {
    const { getSession } = await import('../lib/session');
    const { default: dbConnect } = await import('../lib/mongodb');
    const { default: Event } = await import('../models/Event');
    const { default: Registration } = await import('../models/Registration');

    const session = getSession(req);
    if (!session || session.role !== 'admin') {
      return { redirect: { destination: '/login', permanent: false } };
    }

    await dbConnect();
    
    const events = await Event.find().lean().then(docs => docs.map(d => ({ ...d, _id: d._id.toString() })));
    const registrations = await Registration.find().sort({ createdAt: -1 }).lean().then(docs => docs.map(d => ({ ...d, _id: d._id.toString() })));

    return { props: { user: session, events: JSON.parse(JSON.stringify(events)), registrations: JSON.parse(JSON.stringify(registrations)), interactions: [] } };
  } catch (err) {
    console.error('[Admin] getServerSideProps error:', err);
    return { props: { user: {}, events: [], registrations: [], interactions: [] } };
  }
}
