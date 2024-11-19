import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain,
  Globe2,
  Users,
  Calendar,
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../utils/auth/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { to: "/app", icon: Brain, label: "Dashboard" },
    { to: "/app/sites", icon: Globe2, label: "Sites" },
    { to: "/app/personas", icon: Users, label: "Personas" },
    { to: "/app/templates", icon: Calendar, label: "Templates" },
    { to: "/app/schedules", icon: Calendar, label: "Schedules" },
    { to: "/app/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <nav className="bg-white dark:bg-dark-paper border-b border-gray-200 dark:border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-dark-primary">
                  Intensify
                </span>
              </div>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive
                          ? 'border-b-2 border-primary-500 text-gray-900 dark:text-dark-primary'
                          : 'text-gray-500 dark:text-dark-secondary hover:border-gray-300 dark:hover:border-dark hover:text-gray-700 dark:hover:text-dark-primary'
                      }`
                    }
                    end={to === "/app"}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="button-secondary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}