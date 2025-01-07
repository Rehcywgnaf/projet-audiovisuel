import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Film, Calendar, PiggyBank, Users, Eye } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projets', icon: Film },
    { href: '/planning', label: 'Planning', icon: Calendar },
    { href: '/budget', label: 'Budget', icon: PiggyBank },
    { href: '/teams', label: 'Équipes', icon: Users },
    { href: '/watch', label: 'Veille', icon: Eye }
  ];

  return (
    <nav className="w-64 h-screen bg-white border-r fixed left-0 top-0 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">SAPAV</h1>
      </div>
      <div className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link 
              key={href} 
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}