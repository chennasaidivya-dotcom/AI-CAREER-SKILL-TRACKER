import { useAuth } from '../context/AuthContext';
import { CAREER_PATHS, LEARNING_RESOURCES } from '../data/mockData';
import Header from '../components/Header';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart
} from 'recharts';
import { TrendingUp, Target, BookOpen, Folder, CheckCircle2, Clock, Zap } from 'lucide-react';

const progressHistory = [
  { month: 'May', skills: 2, resources: 1 },
  { month: 'Jun', skills: 3, resources: 2 },
  { month: 'Jul', skills: 4, resources: 4 },
  { month: 'Aug', skills: 5, resources: 5 },
  { month: 'Sep', skills: 6, resources: 7 },
  { month: 'Oct', skills: 7, resources: 8 },
];

function getSkillScore(acquiredSkills, required) {
  if (!required?.length) return 0;
  const matched = required.filter(s => (acquiredSkills || []).includes(s)).length;
  return Math.round((matched / required.length) * 100);
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.8rem'
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const careerPath = CAREER_PATHS.find(c => c.id === user?.careerGoal);
  const userSkills = user?.skills || [];
  const completedResources = user?.completedResources || [];

  const acquiredCount = careerPath
    ? careerPath.requiredSkills.filter(s => userSkills.includes(s)).length
    : 0;
  const totalRequired = careerPath?.requiredSkills?.length || 0;
  const progress = totalRequired ? Math.round((acquiredCount / totalRequired) * 100) : 0;

  // Radar chart data across all career paths
  const radarData = CAREER_PATHS.map(cp => ({
    career: cp.title.split(' ')[0],
    match: getSkillScore(userSkills, cp.requiredSkills),
  }));

  const recentResources = LEARNING_RESOURCES
    .filter(r => r.skills.some(s => userSkills.includes(s)))
    .slice(0, 3);

  const missingSkills = careerPath
    ? careerPath.requiredSkills.filter(s => !userSkills.includes(s))
    : [];

  return (
    <div>
      <Header
        title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
        subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />
      <div className="page-container">

        {/* Stats Row */}
        <div className="stats-grid">
          <div className="stat-card accent">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <TrendingUp size={20} style={{ color: 'var(--accent-light)' }} />
            </div>
            <div className="stat-value gradient-text">{progress}%</div>
            <div className="stat-label">Career Path Progress</div>
            <span className="stat-change up">↑ Active streak</span>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--purple)' }} />
            </div>
            <div className="stat-value" style={{ color: 'var(--purple)' }}>{userSkills.length}</div>
            <div className="stat-label">Skills Acquired</div>
            <span className="stat-change neutral">{acquiredCount}/{totalRequired} required</span>
          </div>
          <div className="stat-card green">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <BookOpen size={20} style={{ color: 'var(--green)' }} />
            </div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{completedResources.length}</div>
            <div className="stat-label">Resources Completed</div>
            <span className="stat-change up">Keep learning!</span>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Target size={20} style={{ color: 'var(--orange)' }} />
            </div>
            <div className="stat-value" style={{ color: 'var(--orange)' }}>{missingSkills.length}</div>
            <div className="stat-label">Skills to Learn</div>
            <span className="stat-change neutral">Skill gaps</span>
          </div>
        </div>

        {/* No career path prompt */}
        {!careerPath && (
          <div className="ai-panel" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Set Your Career Goal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Visit your Profile to choose a career path and get personalized AI recommendations.
            </p>
            <a href="/profile" className="btn btn-primary">Set Career Goal</a>
          </div>
        )}

        <div className="grid-2">
          {/* Progress Chart */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Learning Progress</h3>
              <span className="badge badge-green">↑ Growing</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={progressHistory}>
                <defs>
                  <linearGradient id="skillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="skills" name="Skills" stroke="#6366f1" fill="url(#skillGrad)" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
                <Area type="monotone" dataKey="resources" name="Resources" stroke="#8b5cf6" fill="url(#resGrad)" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Career Match Radar */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Career Match Radar</h3>
              <span className="badge badge-accent">AI Analysis</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="career" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                <Radar name="Match" dataKey="match" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }} className="grid-2">
          {/* Skill Gap Overview */}
          {careerPath && (
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">Skill Gap Overview</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{careerPath.title}</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span>Overall progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{progress}%</span>
                </div>
                <div className="progress-bar thick">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
                {careerPath.requiredSkills.map(skill => {
                  const has = userSkills.includes(skill);
                  return (
                    <div key={skill} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                      background: has ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.05)',
                      border: `1px solid ${has ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)'}`,
                    }}>
                      <span style={{ fontSize: '0.83rem', color: has ? 'var(--green)' : 'var(--text-secondary)' }}>
                        {skill}
                      </span>
                      {has
                        ? <CheckCircle2 size={15} style={{ color: 'var(--green)' }} />
                        : <span style={{ fontSize: '0.72rem', color: 'var(--red)', background: 'rgba(239,68,68,0.1)', padding: '0.15rem 0.45rem', borderRadius: 4 }}>Missing</span>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Resources */}
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Recommended for You</h3>
              <a href="/resources" style={{ fontSize: '0.8rem', color: 'var(--accent-light)' }}>View all →</a>
            </div>
            {recentResources.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>Add skills to get recommendations</h3>
                <p>Update your profile with your current skills.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentResources.map(r => (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '0.85rem', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                    transition: 'all 200ms', cursor: 'pointer'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99,102,241,0.15)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem'
                    }}>📖</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.platform} · {r.duration} · ⭐ {r.rating}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600, flexShrink: 0 }}>{r.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* AI Tip */}
            <div className="ai-panel" style={{ marginTop: '1rem' }}>
              <div className="ai-header">
                <div className="ai-pulse" />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-light)' }}>AI Insight</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {careerPath
                  ? `You're ${100 - progress}% away from covering all required skills for ${careerPath.title}. Focus on ${missingSkills[0] || 'advanced topics'} next!`
                  : 'Set a career goal to receive personalized AI insights and recommendations.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
