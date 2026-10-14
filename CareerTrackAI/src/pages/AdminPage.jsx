import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_USERS, CAREER_PATHS, LEARNING_RESOURCES } from '../data/mockData';
import Header from '../components/Header';
import {
  Users, BookOpen, TrendingUp, Shield, Search, MoreVertical,
  CheckCircle2, XCircle, Trash2, Edit2, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  if (user?.role !== 'admin') {
    return (
      <div>
        <Header title="Access Denied" />
        <div className="page-container">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h3>Admin Access Required</h3>
            <p>You don't have permission to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Load real registered users from localStorage too
  const storedUsers = JSON.parse(localStorage.getItem('ct_users') || '[]').map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    careerGoal: u.careerGoal,
    completedSkills: (u.skills || []).length,
    totalSkills: 8,
    joinDate: u.joinDate || new Date().toISOString().split('T')[0],
    status: 'Active',
    role: u.role || 'user',
  }));

  const allUsers = [...ADMIN_USERS, ...storedUsers];

  const showToast = (msg, color = 'var(--green)') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredUsers = allUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Chart data
  const careerDistribution = CAREER_PATHS.map(cp => ({
    name: cp.title.split(' ')[0],
    users: allUsers.filter(u => u.careerGoal === cp.id).length,
    fill: cp.color,
  })).filter(d => d.users > 0);

  const progressData = [
    { range: '0-25%', count: allUsers.filter(u => (u.completedSkills / (u.totalSkills || 1)) < 0.25).length },
    { range: '25-50%', count: allUsers.filter(u => { const r = u.completedSkills / (u.totalSkills || 1); return r >= 0.25 && r < 0.5; }).length },
    { range: '50-75%', count: allUsers.filter(u => { const r = u.completedSkills / (u.totalSkills || 1); return r >= 0.5 && r < 0.75; }).length },
    { range: '75-100%', count: allUsers.filter(u => (u.completedSkills / (u.totalSkills || 1)) >= 0.75).length },
  ];

  return (
    <div>
      <Header title="Admin Panel" subtitle="Manage users, monitor progress, and control content" />
      <div className="page-container">

        {/* Admin Stats */}
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Users', value: allUsers.length, icon: <Users size={20} />, color: 'var(--accent-light)', bg: 'rgba(99,102,241,0.15)' },
            { label: 'Active Users', value: allUsers.filter(u => u.status !== 'Inactive').length, icon: <CheckCircle2 size={20} />, color: 'var(--green)', bg: 'rgba(16,185,129,0.15)' },
            { label: 'Learning Resources', value: LEARNING_RESOURCES.length, icon: <BookOpen size={20} />, color: 'var(--cyan)', bg: 'rgba(6,182,212,0.15)' },
            { label: 'Career Paths', value: CAREER_PATHS.length, icon: <TrendingUp size={20} />, color: 'var(--purple)', bg: 'rgba(139,92,246,0.15)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[['overview', '📊 Overview'], ['users', '👥 Users'], ['resources', '📚 Resources']].map(([id, label]) => (
            <button key={id} className={`tab-btn${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid-2">
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Career Path Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={careerDistribution} dataKey="users" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {careerDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Progress Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={progressData}>
                  <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Recent User Activity</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Career Goal</th>
                      <th>Progress</th>
                      <th>Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.slice(0, 5).map(u => {
                      const cp = CAREER_PATHS.find(c => c.id === u.careerGoal);
                      const prog = Math.round((u.completedSkills / (u.totalSkills || 8)) * 100);
                      return (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                              }}>
                                {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{u.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{cp ? <span>{cp.icon} {cp.title}</span> : <span style={{ color: 'var(--text-muted)' }}>Not set</span>}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div className="progress-bar" style={{ width: 80 }}>
                                <div className="progress-fill" style={{ width: `${prog}%` }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-light)' }}>{prog}%</span>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>{u.joinDate}</td>
                          <td>
                            <span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                              {u.status}
                            </span>
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="section-header" style={{ marginBottom: '1.25rem' }}>
              <h3 className="section-title">User Management</h3>
              <button className="btn btn-primary btn-sm" onClick={() => showToast('User invite sent! (Demo)')}>
                <Plus size={14} /> Invite User
              </button>
            </div>

            <div className="search-bar" style={{ marginBottom: '1.25rem' }}>
              <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} id="admin-user-search" />
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Career Goal</th>
                    <th>Skills Progress</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const cp = CAREER_PATHS.find(c => c.id === u.careerGoal);
                    const prog = Math.round((u.completedSkills / (u.totalSkills || 8)) * 100);
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                            }}>
                              {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-accent'}`}>{u.role}</span></td>
                        <td style={{ fontSize: '0.82rem' }}>{cp ? `${cp.icon} ${cp.title}` : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="progress-bar" style={{ width: 70 }}>
                              <div className="progress-fill" style={{ width: `${prog}%` }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--accent-light)' }}>{prog}%</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>{u.joinDate}</td>
                        <td><span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{u.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Editing ${u.name}…`)} title="Edit">
                              <Edit2 size={13} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => showToast(`${u.name} removed (Demo)`, 'var(--red)')} title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="card">
            <div className="section-header" style={{ marginBottom: '1.25rem' }}>
              <h3 className="section-title">Learning Resources</h3>
              <button className="btn btn-primary btn-sm" onClick={() => showToast('Resource added! (Demo)')}>
                <Plus size={14} /> Add Resource
              </button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Platform</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Price</th>
                    <th>Skills</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {LEARNING_RESOURCES.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem', maxWidth: 200 }}>{r.title}</td>
                      <td style={{ fontSize: '0.8rem' }}>{r.platform}</td>
                      <td><span className="badge badge-accent">{r.type}</span></td>
                      <td style={{ color: 'var(--orange)', fontWeight: 600, fontSize: '0.82rem' }}>⭐ {r.rating}</td>
                      <td style={{ color: 'var(--green)', fontWeight: 600, fontSize: '0.82rem' }}>{r.price}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: 200 }}>
                          {r.skills.slice(0, 2).map(s => <span key={s} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{s}</span>)}
                          {r.skills.length > 2 && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>+{r.skills.length - 2}</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Editing "${r.title}"`)}>
                            <Edit2 size={13} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => showToast(`Removed (Demo)`, 'var(--red)')}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast"><span style={{ color: toast.color }}>{toast.msg}</span></div>}
    </div>
  );
}
