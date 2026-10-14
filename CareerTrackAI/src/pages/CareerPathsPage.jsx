import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CAREER_PATHS } from '../data/mockData';
import Header from '../components/Header';
import { CheckCircle2, TrendingUp, DollarSign, Zap, ChevronDown, ChevronUp, Star } from 'lucide-react';

const demandColors = {
  'Very High': 'var(--green)',
  'High': 'var(--cyan)',
  'Moderate': 'var(--orange)',
};

export default function CareerPathsPage() {
  const { user, updateProfile } = useAuth();
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState(null);
  const userSkills = user?.skills || [];

  const showToast = (msg, color = 'var(--green)') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const selectPath = (id) => {
    updateProfile({ careerGoal: id });
    showToast(`✅ Career goal set to "${CAREER_PATHS.find(c => c.id === id)?.title}"!`);
  };

  const matchScore = (cp) => {
    if (!cp.requiredSkills?.length) return 0;
    return Math.round((cp.requiredSkills.filter(s => userSkills.includes(s)).length / cp.requiredSkills.length) * 100);
  };

  return (
    <div>
      <Header title="Career Paths" subtitle="Explore roles and find your perfect fit" />
      <div className="page-container">

        <div className="ai-panel" style={{ marginBottom: '1.75rem' }}>
          <div className="ai-header">
            <div className="ai-pulse" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-light)' }}>AI Career Matching</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Based on your <strong style={{ color: 'var(--text-primary)' }}>{userSkills.length} skills</strong>, we've ranked the best career matches for you. Click on any path to explore required skills, salary, and demand.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...CAREER_PATHS]
            .sort((a, b) => matchScore(b) - matchScore(a))
            .map((cp) => {
              const score = matchScore(cp);
              const isSelected = user?.careerGoal === cp.id;
              const isOpen = expanded === cp.id;
              const acquired = cp.requiredSkills.filter(s => userSkills.includes(s));
              const missing = cp.requiredSkills.filter(s => !userSkills.includes(s));

              return (
                <div key={cp.id} className="card" style={{
                  border: isSelected ? `1px solid ${cp.color}55` : '1px solid var(--border)',
                  background: isSelected ? `${cp.color}08` : 'var(--bg-card)',
                }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                    onClick={() => setExpanded(isOpen ? null : cp.id)}>
                    {/* Icon */}
                    <div style={{
                      width: 56, height: 56, borderRadius: 'var(--radius-md)',
                      background: `${cp.color}20`, border: `1px solid ${cp.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem', flexShrink: 0,
                    }}>
                      {cp.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{cp.title}</h3>
                        {isSelected && <span className="badge badge-accent">⭐ Your Goal</span>}
                        <span style={{ fontSize: '0.72rem', color: demandColors[cp.demand] || 'var(--text-secondary)', fontWeight: 600 }}>
                          ● {cp.demand} Demand
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{cp.description}</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <DollarSign size={13} style={{ color: 'var(--green)' }} />
                          <span style={{ color: 'var(--green)', fontWeight: 600 }}>{cp.avgSalary}</span> avg salary
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: 200 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>Match</span>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${cp.color}, ${cp.color}aa)` }} />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cp.color, flexShrink: 0 }}>{score}%</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      {!isSelected ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          id={`select-${cp.id}`}
                          onClick={(e) => { e.stopPropagation(); selectPath(cp.id); }}
                        >
                          Set as Goal
                        </button>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => { e.stopPropagation(); updateProfile({ careerGoal: null }); }}
                        >
                          Remove
                        </button>
                      )}
                      {isOpen ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isOpen && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                      <div className="grid-2">
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                            REQUIRED SKILLS
                          </h4>
                          <div className="chip-group">
                            {cp.requiredSkills.map(s => (
                              <span key={s} className={`skill-tag ${userSkills.includes(s) ? 'acquired' : 'gap'}`}>
                                {userSkills.includes(s) ? <CheckCircle2 size={11} /> : '○'} {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                            ADVANCED SKILLS
                          </h4>
                          <div className="chip-group">
                            {cp.advancedSkills?.map(s => (
                              <span key={s} className={`skill-tag ${userSkills.includes(s) ? 'acquired' : ''}`} style={{ opacity: 0.8 }}>
                                {userSkills.includes(s) ? <CheckCircle2 size={11} /> : '◆'} {s}
                              </span>
                            ))}
                          </div>

                          {/* Mini roadmap */}
                          <div style={{ marginTop: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                              QUICK ROADMAP
                            </h4>
                            <div className="roadmap-timeline">
                              {['Learn core fundamentals', `Build 2-3 portfolio projects`, 'Complete a certification', 'Apply for junior roles'].map((step, i) => (
                                <div key={i} className="roadmap-item">
                                  <div className={`roadmap-dot ${i < acquired.length / 2 ? 'done' : i === Math.floor(acquired.length / 2) ? 'active' : ''}`}>
                                    {i < acquired.length / 2 ? '✓' : ''}
                                  </div>
                                  <p style={{ fontSize: '0.82rem', color: i < acquired.length / 2 ? 'var(--green)' : 'var(--text-secondary)' }}>{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {toast && (
        <div className="toast">
          <span style={{ color: toast.color }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
