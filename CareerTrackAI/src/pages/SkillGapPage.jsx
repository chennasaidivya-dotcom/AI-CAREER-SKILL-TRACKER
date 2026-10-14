import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CAREER_PATHS, LEARNING_RESOURCES } from '../data/mockData';
import Header from '../components/Header';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { Zap, Brain, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

export default function SkillGapPage() {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [selectedPath, setSelectedPath] = useState(user?.careerGoal || '');
  const [activeTab, setActiveTab] = useState('gap');

  const careerPath = CAREER_PATHS.find(c => c.id === (selectedPath || user?.careerGoal));
  const userSkills = user?.skills || [];

  const acquired = careerPath ? careerPath.requiredSkills.filter(s => userSkills.includes(s)) : [];
  const missing = careerPath ? careerPath.requiredSkills.filter(s => !userSkills.includes(s)) : [];
  const extra = careerPath ? userSkills.filter(s => !careerPath.requiredSkills.includes(s) && !careerPath.advancedSkills?.includes(s)) : [];

  const matchPercent = careerPath && careerPath.requiredSkills.length
    ? Math.round((acquired.length / careerPath.requiredSkills.length) * 100)
    : 0;

  // Per-skill bar chart
  const barData = careerPath
    ? careerPath.requiredSkills.map(s => ({
        skill: s.length > 14 ? s.slice(0, 14) + '…' : s,
        fullSkill: s,
        level: userSkills.includes(s) ? 85 + Math.floor(Math.random() * 15) : 0,
        target: 80,
      }))
    : [];

  // Radar data: skill categories vs match
  const radarData = CAREER_PATHS.map(cp => ({
    path: cp.title.split(' ').slice(0, 2).join(' '),
    match: cp.requiredSkills.filter(s => userSkills.includes(s)).length * 10 + 10,
    fullMark: 100,
  }));

  const runAnalysis = async () => {
    if (!careerPath) return;
    setAnalyzing(true);
    setAnalyzed(false);
    setAiMessages([]);

    const steps = [
      `🔍 Scanning your ${userSkills.length} registered skills…`,
      `📊 Comparing against ${careerPath.title} requirements (${careerPath.requiredSkills.length} skills)…`,
      `🧠 Running AI gap analysis model…`,
      `✨ Generating personalized recommendations…`,
      `✅ Analysis complete!`,
    ];

    for (const msg of steps) {
      await delay(600);
      setAiMessages(prev => [...prev, msg]);
    }

    setAnalyzing(false);
    setAnalyzed(true);
  };

  const recommendedResources = careerPath
    ? LEARNING_RESOURCES.filter(r => r.skills.some(s => missing.includes(s))).slice(0, 4)
    : [];

  return (
    <div>
      <Header title="Skill Gap Analysis" subtitle="AI-powered analysis of your career readiness" />
      <div className="page-container">

        {/* Career Path Selector */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="section-header">
            <h3 className="section-title">Select Career Path to Analyze</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {CAREER_PATHS.map(cp => (
              <div
                key={cp.id}
                onClick={() => { setSelectedPath(cp.id); setAnalyzed(false); setAiMessages([]); }}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${selectedPath === cp.id ? cp.color + '55' : 'var(--border)'}`,
                  background: selectedPath === cp.id ? cp.color + '11' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  textAlign: 'center',
                }}
                onMouseEnter={e => { if (selectedPath !== cp.id) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}}
                onMouseLeave={e => { if (selectedPath !== cp.id) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{cp.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: selectedPath === cp.id ? cp.color : 'var(--text-secondary)' }}>{cp.title}</div>
                {selectedPath === cp.id && <div style={{ width: 4, height: 4, borderRadius: '50%', background: cp.color, margin: '0.4rem auto 0' }} />}
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={runAnalysis}
            disabled={!selectedPath || analyzing}
            id="analyze-btn"
          >
            {analyzing ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Analyzing…</> : <><Brain size={16} /> Run AI Analysis</>}
          </button>
        </div>

        {/* AI Processing Animation */}
        {(analyzing || aiMessages.length > 0) && (
          <div className="ai-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="ai-header">
              <div className="ai-pulse" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-light)' }}>
                AI Analysis Engine
              </span>
              {analyzed && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Complete</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  fontSize: '0.85rem', color: i === aiMessages.length - 1 && !analyzed ? 'var(--text-primary)' : 'var(--text-secondary)',
                  opacity: 0,
                  animation: `fadeIn 0.4s ease ${i * 0.1}s forwards`,
                }}>
                  {i === aiMessages.length - 1 && analyzing
                    ? <div className="spinner" style={{ width: 14, height: 14, flexShrink: 0 }} />
                    : <CheckCircle2 size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  }
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {analyzed && careerPath && (
          <>
            {/* Score */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Match Score', value: `${matchPercent}%`, color: matchPercent >= 70 ? 'var(--green)' : matchPercent >= 40 ? 'var(--orange)' : 'var(--red)', icon: '🎯' },
                { label: 'Skills Acquired', value: acquired.length, color: 'var(--green)', icon: '✅' },
                { label: 'Skills Missing', value: missing.length, color: 'var(--red)', icon: '⚠️' },
                { label: 'Extra Skills', value: extra.length, color: 'var(--cyan)', icon: '⭐' },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, fontFamily: 'Plus Jakarta Sans' }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="tabs">
              {[['gap', 'Skill Gap'], ['chart', 'Proficiency Chart'], ['resources', 'Recommended Resources']].map(([id, label]) => (
                <button key={id} className={`tab-btn${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
              ))}
            </div>

            {activeTab === 'gap' && (
              <div className="grid-2">
                <div className="card">
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--green)' }}>
                    ✅ Acquired Skills ({acquired.length})
                  </h4>
                  <div className="chip-group">
                    {acquired.map(s => (
                      <span key={s} className="skill-tag acquired">
                        <CheckCircle2 size={12} /> {s}
                      </span>
                    ))}
                    {acquired.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No matching skills yet.</p>}
                  </div>
                </div>
                <div className="card">
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#f87171' }}>
                    ⚠️ Missing Skills ({missing.length})
                  </h4>
                  <div className="chip-group">
                    {missing.map(s => (
                      <span key={s} className="skill-tag gap">
                        <AlertTriangle size={12} /> {s}
                      </span>
                    ))}
                    {missing.length === 0 && <p style={{ color: 'var(--green)', fontSize: '0.85rem', fontWeight: 600 }}>🎉 You have all required skills!</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chart' && (
              <div className="card">
                <h4 style={{ marginBottom: '1.25rem' }}>Skill Proficiency vs Required Level</h4>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={barData} margin={{ left: 0, right: 20 }}>
                    <XAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      formatter={(v, name, props) => [v + '%', props.payload.fullSkill]}
                    />
                    <Bar dataKey="level" radius={[4, 4, 0, 0]} name="Your Level">
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.level > 0 ? '#6366f1' : '#ef444444'} />
                      ))}
                    </Bar>
                    <Bar dataKey="target" fill="rgba(255,255,255,0.06)" radius={[4, 4, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                  Purple = acquired skills · Faded red = missing skills · Gray = target level
                </p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="ai-pulse" />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    AI-selected resources to fill your {missing.length} skill gaps for {careerPath.title}
                  </p>
                </div>
                <div className="grid-auto">
                  {recommendedResources.map(r => (
                    <div key={r.id} className="card" style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                          <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>{r.type}</span>
                          <h4 style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{r.title}</h4>
                        </div>
                        <span style={{ fontSize: '1.5rem' }}>📖</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {r.platform} · {r.duration} · ⭐ {r.rating}
                      </p>
                      <div className="chip-group" style={{ marginBottom: '0.75rem' }}>
                        {r.skills.filter(s => missing.includes(s)).map(s => (
                          <span key={s} className="skill-tag gap" style={{ fontSize: '0.7rem' }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--green)' }}>{r.price}</span>
                        <button className="btn btn-secondary btn-sm">Enroll <ArrowRight size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                {recommendedResources.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">🎉</div>
                    <h3>No gaps to fill!</h3>
                    <p>You already have all the required skills for this path.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
