import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CAREER_PATHS, ALL_SKILLS } from '../data/mockData';
import Header from '../components/Header';
import { Save, User, Target, BookOpen, Plus, X, CheckCircle2 } from 'lucide-react';

const EDUCATION_OPTIONS = [
  'High School', "Associate's Degree", "Bachelor's Degree", "Master's Degree",
  'PhD', 'Bootcamp Graduate', 'Self-Taught', 'Currently Enrolled'
];

const INTEREST_OPTIONS = [
  'Web Development', 'Mobile Apps', 'AI/ML', 'Data Analysis', 'Cloud Computing',
  'Cybersecurity', 'Game Dev', 'Blockchain', 'UX Design', 'DevOps',
  'Open Source', 'Freelancing', 'Startups', 'Research', 'Teaching'
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const [skillSearch, setSkillSearch] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    education: user?.education || '',
    bio: user?.bio || '',
  });

  const interests = user?.interests || [];
  const skills = user?.skills || [];
  const careerGoal = user?.careerGoal || '';

  const showToast = (msg, color = 'var(--green)') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProfile = () => {
    updateProfile(form);
    showToast('✅ Profile saved successfully!');
  };

  const toggleInterest = (interest) => {
    const updated = interests.includes(interest)
      ? interests.filter(i => i !== interest)
      : [...interests, interest];
    updateProfile({ interests: updated });
  };

  const toggleSkill = (skill) => {
    const updated = skills.includes(skill)
      ? skills.filter(s => s !== skill)
      : [...skills, skill];
    updateProfile({ skills: updated });
  };

  const filteredSkills = ALL_SKILLS.filter(s =>
    !skillSearch || s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const careerPath = CAREER_PATHS.find(c => c.id === careerGoal);
  const acquired = careerPath ? careerPath.requiredSkills.filter(s => skills.includes(s)).length : 0;
  const progress = careerPath?.requiredSkills?.length
    ? Math.round((acquired / careerPath.requiredSkills.length) * 100)
    : 0;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div>
      <Header title="My Profile" subtitle="Manage your skills, interests, and career goal" />
      <div className="page-container">

        {/* Profile Header Card */}
        <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', fontWeight: 800, flexShrink: 0,
              boxShadow: '0 0 30px rgba(99,102,241,0.4)',
            }}>{initials}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{user?.role === 'admin' ? '🛡️ Admin' : '👤 Member'}</span>
                {careerPath && <span className="badge badge-purple">{careerPath.icon} {careerPath.title}</span>}
                <span className="badge badge-green">🎓 {user?.education || 'Education not set'}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)', fontFamily: 'Plus Jakarta Sans' }}>{progress}%</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Career Readiness</div>
              <div className="progress-bar" style={{ marginTop: '0.5rem', width: 120 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[['profile', '👤 Basic Info'], ['skills', '🛠️ Skills'], ['interests', '❤️ Interests'], ['goal', '🎯 Career Goal']].map(([id, label]) => (
            <button key={id} className={`tab-btn${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>Basic Information</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} id="profile-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Education Level</label>
              <select className="form-select" value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))} id="profile-education">
                <option value="">Select education level…</option>
                {EDUCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bio / About Me</label>
              <textarea className="form-textarea" placeholder="Tell us about yourself, your background, and your goals…"
                value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} id="profile-bio" />
            </div>
            <button className="btn btn-primary" onClick={saveProfile} id="save-profile">
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">My Skills</h3>
              <span className="badge badge-accent">{skills.length} selected</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select all the skills you currently have. This powers the AI skill gap analysis.
            </p>

            <div className="search-bar" style={{ marginBottom: '1.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>🔍</span>
              <input
                placeholder="Search skills…"
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                id="skill-search"
              />
              {skillSearch && <button onClick={() => setSkillSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14} /></button>}
            </div>

            {/* Currently Selected */}
            {skills.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  YOUR SKILLS
                </p>
                <div className="chip-group">
                  {skills.map(s => (
                    <span key={s} className="skill-tag acquired" onClick={() => toggleSkill(s)} style={{ cursor: 'pointer' }}>
                      <CheckCircle2 size={11} /> {s}
                      <X size={11} style={{ opacity: 0.6 }} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="divider" />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.75rem 0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ALL SKILLS — click to add
            </p>
            <div className="chip-group">
              {filteredSkills.map(s => (
                <span
                  key={s}
                  className={`skill-tag ${skills.includes(s) ? 'acquired' : ''}`}
                  onClick={() => toggleSkill(s)}
                  style={{ cursor: 'pointer' }}
                  id={`skill-${s.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                >
                  {skills.includes(s) ? <CheckCircle2 size={11} /> : <Plus size={11} />} {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests Tab */}
        {activeTab === 'interests' && (
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">My Interests</h3>
              <span className="badge badge-purple">{interests.length} selected</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Select topics that interest you — used by AI to refine career recommendations.
            </p>
            <div className="chip-group">
              {INTEREST_OPTIONS.map(i => (
                <span
                  key={i}
                  className={`skill-tag ${interests.includes(i) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(i)}
                  style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                >
                  {interests.includes(i) ? '✓' : '+'} {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Career Goal Tab */}
        {activeTab === 'goal' && (
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Career Goal</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Set your target career. The AI will build a personalized roadmap to get you there.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {CAREER_PATHS.map(cp => (
                <div
                  key={cp.id}
                  onClick={() => { updateProfile({ careerGoal: cp.id }); showToast(`✅ Goal set: ${cp.title}`); }}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${careerGoal === cp.id ? cp.color + '60' : 'var(--border)'}`,
                    background: careerGoal === cp.id ? cp.color + '12' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  id={`goal-${cp.id}`}
                >
                  {careerGoal === cp.id && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 20, height: 20, borderRadius: '50%',
                      background: cp.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: 'white', fontWeight: 800,
                    }}>✓</div>
                  )}
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cp.icon}</div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem', color: careerGoal === cp.id ? cp.color : 'var(--text-primary)' }}>{cp.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cp.description}</p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>
                    💰 {cp.avgSalary} avg
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast"><span style={{ color: toast.color }}>{toast.msg}</span></div>}
    </div>
  );
}
