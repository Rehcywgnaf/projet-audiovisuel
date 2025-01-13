import React from 'react';
import { Users, Settings, PlusCircle } from 'lucide-react';
import { Team } from '../Teams/types';

interface NavigationProps {
  teams: Team[];
  onTeamSelect: (teamId: string) => void;
  selectedTeamId?: string;
}

export function Navigation({ teams, onTeamSelect, selectedTeamId }: NavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <div className="flex items-center gap-4">
        <Users className="w-6 h-6" />
        <select 
          className="border rounded-md px-3 py-1"
          value={selectedTeamId}
          onChange={(e) => onTeamSelect(e.target.value)}
        >
          <option value="">Toutes les équipes</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <PlusCircle className="w-4 h-4" />
          <span>Nouvelle équipe</span>
        </button>
      </div>
    </div>
  );
}