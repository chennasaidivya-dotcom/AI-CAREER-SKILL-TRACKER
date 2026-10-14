import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { LEARNING_RESOURCES, CAREER_PATHS } from '../data/mockData';
import Header from '../components/Header';
import { Search, CheckCircle2, BookOpen, ExternalLink, Star, Filter } from 'lucide-react';

const PLATFORMS = ['All', 'Udemy', 'Coursera', 'edX / Harvard', 'A Cloud Guru', 'IBM / Coursera', 'TCM Security', 'ByteByteGo'];
const TYPES = ['All', 'Course', 'Specialization', 'Certification Prep', 'Certificate', 'Book + Course'];

export default function ResourcesPage() {
  const { user, updateProfile } = useAuth();
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [type, setType] = useState('All');
  const [toast, setToast] = useState(null);

  const completedResources = user?.completedResources || [];
  const careerPath = CAREER_PATHS.find(c => c.id === user?.careerGoal);

  const showToast = (msg, color = 'var(--green)') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleComplete = (id) => {
    const updated = completedResources.includes(id)
      ? completedResources.filter(r => r !== id)
      : [...completedResources, id];
    updateProfile({ completedResources: updated });
    showToast(completedResources.includes(id) ? 'Resource unmarked' : '✅ Marked as completed!');
  };

  const filtered = useMemo(() => {
    return LEARNING_RESOURCES.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !search || r.title.toLowerCase().includes(q)
        || r.platform.toLowerCase().includes(q)
        || r.skills.some(s => s.toLowerCase().includes(q));
      const matchPlat = platform === 'All' || r.platform === platform;
      const matchType = type === 'All' || r.type === type;
      return matchSearch && matchPlat && matchType;
    });
  }, [search, platform, type]);

  const recommended = useMemo(() => {
    if (!careerPath) return [];
    const missingSkills = careerPath.requiredSkills.filter(s => !(user?.skills || []).includes(s));
    return LEARNING_RESOURCES
      .filter(r => r.skills.some(s => missingSkills.includes(s)))
      .map(r => r.id);
  }, [careerPath, user?.skills]);

  const levelColor = { Beginner: 'var(--green)', 'Beginner to Advanced': 'var(--cyan)', Intermediate: 'var(--orange)', Advanced: 'var(--purple)' };

  return (
    <div>
      <Header title="Learning Resources" subtitle="Curated courses and certifications to close your skill gaps" />
      <div className="page-container">

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
          <div className="stat-card green">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--green)' }} />
            </div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{completedResources.length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <BookOpen size={20} style={{ color: 'var(--accent-light)' }} />
            </div>
            <div className="stat-value">{LEARNING_RESOURCES.length}</div>
            <div className="stat-label">Total Resources</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Star size={20} style={{ color: 'var(--orange)' }} />
            </div>
            <div className="stat-value" style={{ color: 'var(--orange)' }}>{recommended.length}</div>
            <div className="stat-label">Recommended for You</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-bar" style={{ flex: '1 1 200px', minWidth: 200 }}>
              <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                placeholder="Search by title, skill, or platform…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="resource-search"
              />
            </div>
            <select className="form-select" style={{ flex: '0 0 160px', width: 160 }}
              value={platform} onChange={e => setPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="form-select" style={{ flex: '0 0 180px', width: 180 }}
              value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid-auto">
          {filtered.map(r => {
            const done = completedResources.includes(r.id);
            const isRec = recommended.includes(r.id);

            return (
              <div key={r.id} className="card" style={{
                border: done ? '1px solid rgba(16,185,129,0.25)' : isRec ? '1px solid rgba(99,102,241,0.25)' : '1px solid var(--border)',
                position: 'relative',
                opacity: done ? 0.9 : 1,
              }}>
                {isRec && !done && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: 100, padding: '0.15rem 0.55rem',
                    fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-light)',
                  }}>✦ Recommended</div>
                )}
                {done && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(16,185,129,0.15)', borderRadius: 100,
                    padding: '0.15rem 0.55rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--green)',
                  }}>✓ Completed</div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99,102,241,0.12)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                  }}>📖</div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '0.2rem' }}>{r.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.platform}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem', alignItems: 'center' }}>
                  <span className="badge badge-accent">{r.type}</span>
                  <span style={{ fontSize: '0.72rem', color: levelColor[r.level] || 'var(--text-muted)', fontWeight: 600 }}>
                    {r.level}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>⏱ {r.duration}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--orange)', fontWeight: 600 }}>⭐ {r.rating}</span>
                </div>

                <div className="chip-group" style={{ marginBottom: '1rem' }}>
                  {r.skills.map(s => (
                    <span key={s} className="skill-tag" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>{s}</span>
                  ))}
                </div>

                <div className="divider" />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--green)' }}>{r.price}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn btn-sm ${done ? 'btn-ghost' : 'btn-secondary'}`}
                      onClick={() => toggleComplete(r.id)}
                      id={`complete-${r.id}`}
                    >
                      {done ? '↩ Undo' : <><CheckCircle2 size={13} /> Mark Done</>}
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No resources found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {toast && <div className="toast"><span style={{ color: toast.color }}>{toast.msg}</span></div>}
    </div>
  );
}
