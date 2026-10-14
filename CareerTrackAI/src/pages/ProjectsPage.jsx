import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { PROJECT_IDEAS, CAREER_PATHS } from '../data/mockData';
import Header from '../components/Header';
import { Folder, Clock, Zap, Star, Filter, ExternalLink, CheckCircle2 } from 'lucide-react';

const diffColors = { Beginner: 'var(--green)', Intermediate: 'var(--orange)', Advanced: 'var(--purple)' };
const CATEGORIES = ['All', 'fullstack', 'datascience', 'devops', 'cybersecurity', 'ux'];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [toast, setToast] = useState(null);
  const userSkills = user?.skills || [];
  const careerPath = CAREER_PATHS.find(c => c.id === user?.careerGoal);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return PROJECT_IDEAS.filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const matchDiff = diffFilter === 'All' || p.difficulty === diffFilter;
      return matchCat && matchDiff;
    }).sort((a, b) => {
      // Sort by skill match
      const aMatch = a.skills.filter(s => userSkills.includes(s)).length;
      const bMatch = b.skills.filter(s => userSkills.includes(s)).length;
      return bMatch - aMatch;
    });
  }, [category, diffFilter, userSkills]);

  const matchPercent = (project) => {
    if (!project.skills?.length) return 0;
    return Math.round((project.skills.filter(s => userSkills.includes(s)).length / project.skills.length) * 100);
  };

  const catLabel = { fullstack: '💻 Full Stack', datascience: '📊 Data Science', devops: '⚙️ DevOps', cybersecurity: '🔐 Security', ux: '🎨 UX/UI' };

  return (
    <div>
      <Header title="Project Ideas" subtitle="Build real-world projects to accelerate your career" />
      <div className="page-container">

        <div className="ai-panel" style={{ marginBottom: '1.5rem' }}>
          <div className="ai-header">
            <div className="ai-pulse" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-light)' }}>AI Project Matching</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Projects are ranked by <strong style={{ color: 'var(--text-primary)' }}>skill match score</strong> — prioritizing ones you can start immediately with your current skills.
            {careerPath && ` Focus on <strong>${catLabel[careerPath.id] || careerPath.title}</strong> projects for maximum career impact.`}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCategory(c)}
                id={`cat-${c}`}
              >
                {c === 'All' ? '🌐 All' : catLabel[c] || c}
              </button>
            ))}
          </div>
          <div className="divider" style={{ width: 1, height: 30, margin: '0 0.25rem' }} />
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
            <button
              key={d}
              className={`btn btn-sm ${diffFilter === d ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setDiffFilter(d)}
              style={diffFilter === d && d !== 'All' ? { color: diffColors[d], borderColor: diffColors[d] + '44' } : {}}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid-auto">
          {filtered.map(p => {
            const score = matchPercent(p);
            const canStart = score >= 50;

            return (
              <div key={p.id} className="card" style={{
                border: canStart ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--border)',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: diffColors[p.difficulty] + '20', color: diffColors[p.difficulty], border: `1px solid ${diffColors[p.difficulty]}30` }}>
                      {p.difficulty}
                    </span>
                    <span className="badge badge-accent">{catLabel[p.category] || p.category}</span>
                  </div>
                  <div style={{ fontSize: '1.5rem' }}>
                    {p.category === 'fullstack' ? '💻' : p.category === 'datascience' ? '📊' : p.category === 'devops' ? '⚙️' : p.category === 'cybersecurity' ? '🔐' : '🎨'}
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>{p.description}</p>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {p.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--orange)' }}>
                    <Star size={12} /> {p.impact}
                  </span>
                </div>

                {/* Skills */}
                <div className="chip-group" style={{ marginBottom: '1rem' }}>
                  {p.skills.map(s => (
                    <span key={s} className={`skill-tag ${userSkills.includes(s) ? 'acquired' : 'gap'}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                      {userSkills.includes(s) ? '✓' : '○'} {s}
                    </span>
                  ))}
                </div>

                {/* Match bar */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Skill match</span>
                    <span style={{ color: canStart ? 'var(--green)' : 'var(--orange)', fontWeight: 700 }}>{score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${score}%`,
                      background: canStart
                        ? 'linear-gradient(90deg, var(--green), #34d399)'
                        : 'linear-gradient(90deg, var(--orange), #fbbf24)'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className={`btn btn-sm ${canStart ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1 }}
                    onClick={() => showToast(`🚀 "${p.title}" added to your project list!`)}
                    id={`start-${p.id}`}
                  >
                    {canStart ? '🚀 Start Project' : '📋 Save for Later'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No projects found</h3>
            <p>Try changing the category or difficulty filter.</p>
          </div>
        )}
      </div>

      {toast && <div className="toast"><span style={{ color: 'var(--green)' }}>{toast}</span></div>}
    </div>
  );
}
