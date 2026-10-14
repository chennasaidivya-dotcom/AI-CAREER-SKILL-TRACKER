import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const ADMIN_EMAIL = 'admin@careertrack.ai';
const ADMIN_PASS = 'admin123';

// Seed demo user on first load
(function seedDemoUser() {
  const users = JSON.parse(localStorage.getItem('ct_users') || '[]');
  if (!users.find(u => u.email === 'demo@careertrack.ai')) {
    users.push({
      id: 9999,
      name: 'Alex Chen',
      email: 'demo@careertrack.ai',
      password: 'demo123',
      role: 'user',
      careerGoal: 'fullstack',
      education: "Bachelor's Degree",
      bio: 'Aspiring full-stack developer passionate about building great products.',
      interests: ['Web Development', 'Open Source', 'AI/ML'],
      skills: ['JavaScript', 'React', 'HTML/CSS', 'Git', 'SQL'],
      completedResources: [1, 4],
      joinDate: '2025-09-01',
    });
    localStorage.setItem('ct_users', JSON.stringify(users));
  }
})();


function generateToken(user) {
  // Simulated JWT payload (base64 encoded)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 86400000 // 24h
  }));
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ct_user');
    const token = localStorage.getItem('ct_token');
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        // Check token expiry
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now()) {
          setUser(parsed);
        } else {
          localStorage.removeItem('ct_user');
          localStorage.removeItem('ct_token');
        }
      } catch (_) {
        localStorage.removeItem('ct_user');
        localStorage.removeItem('ct_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const adminUser = { email, name: 'Admin User', role: 'admin', id: 0 };
      const token = generateToken(adminUser);
      localStorage.setItem('ct_user', JSON.stringify(adminUser));
      localStorage.setItem('ct_token', token);
      setUser(adminUser);
      return { success: true };
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem('ct_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      const token = generateToken(safeUser);
      localStorage.setItem('ct_user', JSON.stringify(safeUser));
      localStorage.setItem('ct_token', token);
      setUser(safeUser);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  }, []);

  const register = useCallback(async (name, email, password) => {
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('ct_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered.' };
    }
    const newUser = {
      id: Date.now(),
      name, email, password,
      role: 'user',
      careerGoal: null,
      education: '',
      interests: [],
      skills: [],
      completedResources: [],
      joinDate: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    localStorage.setItem('ct_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    const token = generateToken(safeUser);
    localStorage.setItem('ct_user', JSON.stringify(safeUser));
    localStorage.setItem('ct_token', token);
    setUser(safeUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ct_user');
    localStorage.removeItem('ct_token');
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('ct_user', JSON.stringify(updated));
      // Also update in users list
      const users = JSON.parse(localStorage.getItem('ct_users') || '[]');
      const idx = users.findIndex(u => u.id === updated.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem('ct_users', JSON.stringify(users));
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
