import { useState } from 'react';
import { Lock, ArrowRight, X } from 'lucide-react';

export default function SupervisorAuth({ onAuthSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'jalrakshak2026') {
      sessionStorage.setItem('supervisor_auth', 'true');
      onAuthSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500); // Reset for shake animation
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-transform ${error ? 'animate-shake' : ''}`}>
        <div className="bg-[#6FA8C6] p-6 relative">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="w-12 h-12 bg-card/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-teal" />
          </div>
          <h2 className="text-2xl font-bold text-white">Supervisor Access</h2>
          <p className="text-slate-300 mt-1 text-sm">Enter password to access the JalRakshak dashboard.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                error ? 'border-red-500 focus:ring-red-200' : 'border-border focus:ring-accent/20 focus:border-accent'
              }`}
              placeholder="••••••••"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">Incorrect password. Please try again.</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center group"
          >
            Access Dashboard
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
