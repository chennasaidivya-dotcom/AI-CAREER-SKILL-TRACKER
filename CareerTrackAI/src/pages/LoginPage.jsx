import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const demoLogin = async (type) => {
    setLoading(true);
    setError('');
    let e, p;
    if (type === 'admin') { e = 'admin@careertrack.ai'; p = 'admin123'; }
    else { e = 'demo@careertrack.ai'; p = 'demo123'; }
    const result = await login(e, p);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Create demo user if doesn't exist
      const { register } = useAuth();
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div className="logo-icon">🚀</div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.1rem' }}>
              Career<span style={{ color: 'var(--accent-light)' }}>Track</span>
              <span style={{ color: 'var(--purple)' }}> AI</span>
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Your AI-Powered<br />
            <span className="gradient-text">Career Compass</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 380 }}>
            Identify skill gaps, discover learning paths, and land your dream job with personalized AI guidance.
          </p>

          <div className="feature-list">
            {[
              { icon: '🎯', title: 'Skill Gap Analysis', desc: 'AI identifies exactly what skills you need to reach your goal.' },
              { icon: '🗺️', title: 'Career Roadmaps', desc: 'Visual, step-by-step paths tailored to your background.' },
              { icon: '📚', title: 'Curated Resources', desc: 'Top courses and projects matched to your skill gaps.' },
            ].map(f => (
              <div className="feature-item" key={f.title}>
                <div className="feature-icon-wrap">{f.icon}</div>
                <div className="feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '10%', right: '-60px',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '-30px',
          width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)',
        }} />
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-title">Welcome back</div>
          <div className="auth-subtitle">Sign in to continue your journey →</div>

          {error && (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                id="login-email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  id="login-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="login-submit">
              {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="auth-divider">or try a demo</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              className="btn btn-ghost"
              id="demo-user-btn"
              onClick={() => { setEmail('demo@careertrack.ai'); setPassword('demo123'); }}
            >
              👤 Demo User
            </button>
            <button
              className="btn btn-ghost"
              id="demo-admin-btn"
              onClick={() => { setEmail('admin@careertrack.ai'); setPassword('admin123'); }}
            >
              🛡️ Admin
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
