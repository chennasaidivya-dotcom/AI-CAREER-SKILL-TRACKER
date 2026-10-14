import { useAuth } from '../context/AuthContext';
import { Bell, Sparkles } from 'lucide-react';
import { CAREER_PATHS } from '../data/mockData';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const careerPath = CAREER_PATHS.find(c => c.id === user?.careerGoal);

  return (
    <header className="header">
      <div className="header-left">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="header-right">
        {careerPath && (
          <div className="header-badge">
            <span>{careerPath.icon}</span>
            <span>{careerPath.title}</span>
          </div>
        )}
        <div style={{
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 200ms',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <Bell size={16} style={{ color: 'var(--accent-light)' }} />
        </div>
      </div>
    </header>
  );
}
