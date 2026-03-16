import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ParticleBackground from '../components/ParticleBackground';
import useReveal from '../components/useReveal';

/* ─── Stat Counter ─────────────────────────────────────────────── */
function StatCounter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          let c = 0;
          const inc = target / 200;
          const t = setInterval(() => {
            c += inc;
            if (c >= target) { setCount(target); clearInterval(t); }
            else setCount(Math.ceil(c));
          }, 8);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span className="stat-number" ref={ref}>{count.toLocaleString()}</span>;
}

/* ─── Contact Form ─────────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form reveal">
      {status === 'sent' && (
        <div className="alert alert-success mb-4">
          Your wisdom has been received! We&apos;ll connect soon.
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-danger mb-4">
          The connection was interrupted. Please try again.
        </div>
      )}
      <div className="mb-4">
        <input
          type="text" className="form-control"
          placeholder="Your Sacred Name" required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <input
          type="email" className="form-control"
          placeholder="Your Gateway (Email)" required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <textarea
          className="form-control" rows="4"
          placeholder="Your Intentions (Message)" required
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="btn btn-glow w-100"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send Wisdom'}
      </button>
    </form>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function HomePage({ events, user }) {
  useReveal();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const { status, msg } = router.query;

  useEffect(() => {
    if (status && msg) {
      setAlertMsg({ type: status, text: decodeURIComponent(msg) });
      const t = setTimeout(() => setAlertMsg(null), 5000);
      return () => clearTimeout(t);
    }
  }, [status, msg]);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  const copyUPI = () => {
    navigator.clipboard.writeText('ashishsony45@ybl').then(() => {
      alert('UPI ID copied to clipboard!');
    });
  };

  const pillars = [
    { icon: 'fa-om', title: 'Spiritual', sub: 'Connection to Divine' },
    { icon: 'fa-brain', title: 'Psychological', sub: 'Inner Peace & Clarity' },
    { icon: 'fa-coins', title: 'Wealth', sub: 'Abundance & Prosperity' },
    { icon: 'fa-heartbeat', title: 'Health', sub: 'Vitality & Balance' },
  ];

  const founders = [
    {
      img: '/ashish_new.jpg', name: 'Ashish S',
      role: 'Founder & Visionary',
      bio: "Ashish's journey began with a deep exploration of ancient Vedic philosophies. His vision is to bridge the gap between traditional wisdom and modern lifestyle, creating a path for holistic growth.",
      email: 'ashishsony45@gmail.com', phone: '+91 8792625630',
    },
    {
      img: '/anurag_new.jpg', name: 'Anurag Sony',
      role: 'Co-Founder & Spiritual Lead',
      bio: 'With over a decade of experience in mindfulness and psychological counseling, Anurag ensures that every aspect of Kala Vriksha is rooted in empathy, peace, and sacred balance.',
      email: 'anuragssony@gmail.com', phone: '+91 6363367179',
    },
  ];

  const team = [
    {
      img: '/ishfaq_new.jpg', name: 'Ishfaq Nazir Khanday',
      role: 'Assistant Professor',
      bio: 'Dr B R Ambedkar School of Economics University Bengaluru. Providing academic depth to the roots of Kala Vriksha.',
      email: 'kalavriksha.official@gmail.com',
    },
    {
      img: '/vijendra_new.jpg', name: 'Vijendra (Aryaputran)',
      role: 'Community Health Officer & Psychologist',
      bio: 'Bridging the gap between mental health and community well-being with compassionate psychological expertise.',
      email: 'kalavriksha.official@gmail.com',
    },
  ];

  const faqs = [
    {
      id: 'q1',
      q: 'What is the secret of Kala Vriksha?',
      a: 'The secret of Kala Vriksha lies in the belief that every human mind is like a sacred tree. When the roots are nourished with awareness, wisdom, and inner balance, the tree of life grows strong and bears the fruits of peace, clarity, and prosperity. Kala Vriksha is a space where ancient spiritual understanding meets modern psychological insights. Through guided learning, meditation practices, mental wellness techniques, and financial wisdom, we help individuals reconnect with their inner strength.',
    },
    {
      id: 'q2',
      q: 'How can I join the sacred circle?',
      a: 'Joining the Kala Vriksha Sacred Circle is the first step toward your journey of transformation. You can become a part of our community by registering through our platform and enrolling in our online or offline sessions. Our programs are designed to help individuals cultivate mindfulness, emotional strength, spiritual awareness, and financial clarity. Once you join, you will gain access to guided workshops, healing sessions, meditation practices, and practical frameworks.',
    },
  ];

  return (
    <>
      <Head>
        <title>Kala Vriksha | Mystical Wisdom</title>
      </Head>
      <ParticleBackground />

      {/* Alert banner */}
      {alertMsg && (
        <div
          className="container mt-5 pt-5"
          style={{ zIndex: 1000, position: 'relative' }}
        >
          <div
            className={`alert alert-${alertMsg.type === 'success' ? 'success' : 'warning'} alert-dismissible fade show border-${alertMsg.type === 'success' ? 'success' : 'warning'} bg-dark text-${alertMsg.type === 'success' ? 'success' : 'warning'} p-4`}
            style={{ backdropFilter: 'blur(10px)', borderRadius: 15, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
          >
            <strong>Mystical Update:</strong> {alertMsg.text}
            <button type="button" className="btn-close btn-close-white" onClick={() => setAlertMsg(null)} />
          </div>
        </div>
      )}

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top py-3">
        <div className="container">
          <a
            className="navbar-brand gold-gradient-text"
            href="#hero"
            onClick={e => { e.preventDefault(); scrollTo('hero'); }}
            style={{ fontSize: '1.8rem' }}
          >
            <img
              src="/logo.png" alt="Logo" className="brand-logo"
              onError={e => { e.target.style.display = 'none'; }}
            />
            KALA VRIKSHA
          </a>
          <button
            className="navbar-toggler" type="button"
            onClick={() => setNavOpen(v => !v)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse justify-content-end${navOpen ? ' show' : ''}`}>
            <ul className="navbar-nav">
              {['hero','pillars','events','founders','team','payment','faq'].map(s => (
                <li className="nav-item" key={s}>
                  <a
                    className="nav-link px-3" href={`#${s}`}
                    onClick={e => { e.preventDefault(); scrollTo(s); }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </a>
                </li>
              ))}
              <li className="nav-item">
                <a
                  className="nav-link px-3 btn btn-outline-warning ms-lg-3"
                  href="#contact"
                  onClick={e => { e.preventDefault(); scrollTo('contact'); }}
                >
                  Contact
                </a>
              </li>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <li className="nav-item">
                      <Link
                        href="/admin"
                        className="nav-link px-3 btn btn-outline-info ms-lg-3 mt-2 mt-lg-0"
                      >
                        Admin
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link
                      href="/dashboard"
                      className="nav-link px-3 btn btn-glow ms-lg-3 mt-2 mt-lg-0"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link px-3 btn btn-outline-danger ms-lg-2 mt-2 mt-lg-0"
                      href="#"
                      onClick={async e => {
                        e.preventDefault();
                        await fetch('/api/logout', { method: 'POST' });
                        router.push('/');
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link
                    href="/login"
                    className="nav-link px-3 btn btn-glow ms-lg-3 mt-2 mt-lg-0"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section id="hero" className="mystical-section">
        <div className="container hero-content">
          <h1 className="reveal">
            The <span className="gold-gradient-text">Kala Vriksha</span>
          </h1>
          <p className="reveal">
            Where mystical wisdom meets sacred growth. Dive into the deep roots of existence.
          </p>
          <a
            href="#stats"
            className="btn btn-glow reveal mt-3"
            onClick={e => { e.preventDefault(); scrollTo('stats'); }}
          >
            Explore Now
          </a>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section id="stats" className="mystical-section">
        <div className="container">
          <div className="row text-center reveal">
            {[
              { target: 15000, label: 'Lives To Be Touched' },
              { target: 4,     label: 'Sacred Pillars' },
              { target: 50,    label: 'Years of Wisdom' },
            ].map(s => (
              <div className="col-md-4 mb-4" key={s.label}>
                <div className="stat-card">
                  <StatCounter target={s.target} />
                  <p className="text-uppercase text-light opacity-75">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────────────── */}
      <section id="pillars" className="mystical-section bg-dark bg-opacity-50">
        <div className="container position-relative">
          <h2 className="text-center gold-gradient-text mb-5 display-4 reveal">
            The Four Sacred Pillars
          </h2>
          <div
            className="position-absolute top-50 start-50 translate-middle opacity-25"
            style={{ zIndex: 0, pointerEvents: 'none' }}
          >
            <img
              src="/pillar_icons.png" alt="Sacred Icons"
              className="img-fluid reveal"
              style={{ maxHeight: 400, filter: 'blur(2px)' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="row reveal position-relative" style={{ zIndex: 1 }}>
            {pillars.map(p => (
              <div className="col-lg-3 col-md-6 text-center" key={p.title}>
                <div className="pillar-card">
                  <div className="pillar-circle">
                    <i className={`fas ${p.icon} pillar-icon`} />
                    <h3>{p.title}</h3>
                    <p className="small text-light opacity-50">{p.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section id="testimonials" className="mystical-section">
        <div className="container">
          <h2 className="text-center gold-gradient-text mb-5 display-4 reveal">
            Echoes of Wisdom
          </h2>
          <div
            id="testimonialCarousel"
            className="carousel slide reveal"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="testimonial-card">
                  <p>&ldquo;The wisdom of Kala Vriksha transformed my life. I finally found the clarity I was seeking for years.&rdquo;</p>
                  <h4>- Aria Thorne</h4>
                </div>
              </div>
              <div className="carousel-item">
                <div className="testimonial-card">
                  <p>&ldquo;A truly mystical experience. The sacred pillars provide a roadmap to real inner peace.&rdquo;</p>
                  <h4>- Julian Vane</h4>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev" type="button"
              data-bs-target="#testimonialCarousel" data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon opacity-50" />
            </button>
            <button
              className="carousel-control-next" type="button"
              data-bs-target="#testimonialCarousel" data-bs-slide="next"
            >
              <span className="carousel-control-next-icon opacity-50" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Events ────────────────────────────────────────────── */}
      <section id="events" className="mystical-section bg-dark bg-opacity-25">
        <div className="container">
          <h2 className="text-center gold-gradient-text mb-5 display-4 reveal">
            Sacred Gatherings
          </h2>
          <div className="row g-4 reveal">
            {events.length === 0 ? (
              <div className="col-12 text-center text-light opacity-50">
                <p>No upcoming gatherings at this moment. Stay tuned to the whispers of the universe.</p>
              </div>
            ) : events.map(ev => (
              <div className="col-md-4" key={ev.id}>
                <div className="founder-card h-100">
                  <div className="mb-3">
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Upcoming</span>
                  </div>
                  <h3 className="gold-gradient-text">{ev.name}</h3>
                  <p className="designation mb-3">
                    <i className="fas fa-calendar-day me-2" />
                    {new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="designation mb-3">
                    <i className="fas fa-map-marker-alt me-2" />{ev.venue}
                  </p>
                  <p className="designation mb-3">
                    <i className="fas fa-user-tie me-2" />Guide: {ev.preacher}
                  </p>
                  <p className="about-text">{ev.about}</p>
                  <div className="mt-auto">
                    <a
                      href="#payment"
                      className="btn btn-outline-warning w-100"
                      onClick={e => { e.preventDefault(); scrollTo('payment'); }}
                    >
                      Reserve Spot
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founders ──────────────────────────────────────────── */}
      <section id="founders" className="mystical-section">
        <div className="container">
          <h2 className="text-center gold-gradient-text mb-2 display-4 reveal">
            Our Vision &amp; Guardians
          </h2>
          <div className="company-vision reveal">
            <p>
              Kala Vriksha is a sanctuary for those seeking to harmonize their spiritual, psychological,
              and physical well-being. Rooted in ancient wisdom and nurtured by modern insights, we
              provide the tools for profound personal transformation. Guided by the four sacred pillars,
              we help you uncover the deep roots of your existence.
            </p>
          </div>
          <div className="row g-4 reveal">
            {founders.map(f => (
              <div className="col-md-6" key={f.name}>
                <div className="founder-card">
                  <div className="founder-img-wrapper">
                    <img
                      src={f.img} alt={f.name} className="founder-img"
                      onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=D4AF37&color=000&size=180`;
                      }}
                    />
                  </div>
                  <h3>{f.name}</h3>
                  <p className="designation">{f.role}</p>
                  <p className="about-text">{f.bio}</p>
                  <a href={`mailto:${f.email}`} className="founder-email">
                    <i className="fas fa-envelope" /> {f.email}
                  </a>
                  <br />
                  <a href={`tel:${f.phone.replace(/\s/g,'')}`} className="founder-email mt-2">
                    <i className="fas fa-phone" /> {f.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      <section id="team" className="mystical-section bg-dark bg-opacity-25">
        <div className="container">
          <h2 className="text-center gold-gradient-text mb-5 display-4 reveal">
            Our Core Team
          </h2>
          <div className="row g-4 reveal">
            {team.map(t => (
              <div className="col-md-6" key={t.name}>
                <div className="founder-card">
                  <div className="founder-img-wrapper">
                    <img
                      src={t.img} alt={t.name} className="founder-img"
                      onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=D4AF37&color=000&size=180`;
                      }}
                    />
                  </div>
                  <h3>{t.name}</h3>
                  <p className="designation">{t.role}</p>
                  <p className="about-text">{t.bio}</p>
                  <a href={`mailto:${t.email}`} className="founder-email">
                    <i className="fas fa-envelope" /> {t.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment ───────────────────────────────────────────── */}
      <section id="payment" className="mystical-section">
        <div className="container">
          <h2 className="text-center gold-gradient-text mb-5 display-4 reveal">
            Sacred Exchange
          </h2>
          <div className="payment-card reveal">
            <div className="row align-items-center">
              <div className="col-lg-5 text-center mb-4 mb-lg-0">
                <div className="position-relative d-inline-block mb-4" style={{ height: 200 }}>
                  <div
                    className="qr-wrapper mx-auto"
                    style={{ transform: 'scale(0.8)', transformOrigin: 'top center', marginBottom: 0 }}
                  >
                    <img
                      src="/payment_qr.png" alt="PhonePe Payment QR Code"
                      style={{ width: 220, height: 220, objectFit: 'contain', borderRadius: 15 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="mb-1 text-light opacity-50">Official UPI ID:</p>
                  <div className="upi-id-box" onClick={copyUPI} style={{ cursor: 'pointer' }}>
                    <span className="upi-text">ashishsony45@ybl</span>
                    <i className="fas fa-copy text-warning" />
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="payment-steps">
                  <h4 className="gold-gradient-text mb-4">How to Register:</h4>
                  {[
                    'Scan the PhonePe QR code or use the UPI ID to initiate your sacred exchange.',
                    'Note down your Transaction ID and take a Screenshot of the successful payment.',
                    'Click the button below to fill the initiation form with your details and transaction proof.',
                  ].map((step, i) => (
                    <div className="step-item" key={i}>
                      <div className="step-number">{i + 1}</div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSf_pINJjs4RRSWATs3VosjuWd8jNDgGoOvwXoSbtWMjRh4sHw/viewform?usp=publish-editor"
                  target="_blank" rel="noreferrer"
                  className="btn btn-glow google-form-btn"
                >
                  <i className="fab fa-google me-2" /> Complete Registration Form
                </a>
                <p className="payment-notice">
                  <i className="fas fa-info-circle me-1" />
                  Your participation will be confirmed via email within 24 hours of form submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" className="mystical-section bg-dark bg-opacity-25">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="text-center gold-gradient-text mb-5 display-4 reveal">
            Mystical FAQ
          </h2>
          <div className="accordion reveal" id="faqAccordion">
            {faqs.map(item => (
              <div className="accordion-item" key={item.id}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${item.id}`}
                  >
                    {item.q}
                  </button>
                </h2>
                <div id={item.id} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body text-white">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────── */}
      <section id="contact" className="mystical-section">
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 className="text-center gold-gradient-text mb-5 display-4 reveal">
            Connect with the Source
          </h2>
          <ContactForm />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-5 text-center bg-black border-top border-warning opacity-75">
        <div className="container">
          <h3 className="gold-gradient-text mb-3">Kala Vriksha</h3>
          <div className="mb-4">
            <a
              href="https://www.instagram.com/kalavriksha.official?igsh=MjQ3eGxld3gxaG9k"
              className="text-warning h4 mx-3" target="_blank" rel="noreferrer"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://www.facebook.com/share/18KWCUMqE3/"
              className="text-warning h4 mx-3" target="_blank" rel="noreferrer"
            >
              <i className="fab fa-facebook" />
            </a>
          </div>
          <p className="text-light opacity-50">
            &copy; 2026 Kala Vriksha Sacred Wisdom. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Back to Top */}
      <a
        href="#hero" id="back-to-top"
        className={showBackTop ? 'show' : ''}
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      >
        <i className="fas fa-arrow-up" />
      </a>
    </>
  );
}

/* ─── Server-side props ─────────────────────────────────────────── */
export async function getServerSideProps({ req }) {
  const { readData } = await import('../lib/data');
  const { getSession } = await import('../lib/session');
  const events = readData('events');
  const session = getSession(req);
  return { props: { events, user: session } };
}
