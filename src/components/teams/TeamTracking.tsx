import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Film, Calendar, AlertTriangle } from 'lucide-react';

const ValidationError = ({ errors }) => {
  if (!errors || (Array.isArray(errors) && errors.length === 0)) return null;
  
  const errorMessages = Array.isArray(errors) ? errors : [errors];
  
  return (
    <div className="flex items-start gap-2 mt-1">
      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
      <div className="flex-1">
        {errorMessages.map((error, index) => (
          <p key={index} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
    </div>
  );
};

const validateMember = (data) => {
  const errors = {};

  if (!data.name || data.name.length < 2) {
    errors.name = ['Le nom doit contenir au moins 2 caractères'];
  } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(data.name)) {
    errors.name = ['Le nom ne doit contenir que des lettres'];
  }

  if (!data.role || data.role.length === 0) {
    errors.role = ['Le rôle est requis'];
  }

  const availability = parseInt(data.availability);
  if (isNaN(availability) || availability < 0 || availability > 100) {
    errors.availability = ['La disponibilité doit être entre 0 et 100%'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default function TeamTracking() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    availability: '100',
    currentProjects: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [teams, setTeams] = useState([
    {
      name: 'Équipe Technique',
      members: [
        {
          name: 'Jean Dupont',
          role: 'Directeur Technique',
          availability: '80',
          currentProjects: ['Documentaire Nature'],
          nextAvailable: '15 Feb 2024'
        },
        {
          name: 'Marie Martin',
          role: 'Cadreur',
          availability: '100',
          currentProjects: ['Web-série Innovation'],
          nextAvailable: 'Disponible'
        }
      ]
    },
    {
      name: 'Production',
      members: [
        {
          name: 'Pierre Dubois',
          role: 'Producteur',
          availability: '50',
          currentProjects: ['Documentaire Nature', 'Web-série Innovation'],
          nextAvailable: '1 Mar 2024'
        }
      ]
    }
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validation en temps réel
    const { errors } = validateMember({
      ...formData,
      [name]: value
    });
    setFormErrors(prev => ({
      ...prev,
      [name]: errors[name]
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { isValid, errors } = validateMember(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Par défaut, ajout à l'équipe technique
    const updatedTeams = teams.map(team => {
      if (team.name === 'Équipe Technique') {
        return {
          ...team,
          members: [...team.members, {
            ...formData,
            currentProjects: [],
            nextAvailable: 'Disponible'
          }]
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setShowAddForm(false);
    setFormData({
      name: '',
      role: '',
      availability: '100',
      currentProjects: []
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleAvailabilityChange = (teamIndex, memberIndex, newAvailability) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].members[memberIndex].availability = newAvailability;
    setTeams(updatedTeams);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suivi des Équipes</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          {showAddForm ? 'Fermer' : 'Ajouter membre'}
        </button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h2 className="text-xl font-bold">Ajouter un membre</h2>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                <ValidationError errors={formErrors.name} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Rôle
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className={`w-full p-2 border rounded ${formErrors.role ? 'border-red-500' : 'border-gray-300'}`}
                />
                <ValidationError errors={formErrors.role} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Disponibilité (%)
                </label>
                <input
                  type="number"
                  name="availability"
                  min="0"
                  max="100"
                  value={formData.availability}
                  onChange={handleFormChange}
                  className={`w-full p-2 border rounded ${formErrors.availability ? 'border-red-500' : 'border-gray-300'}`}
                />
                <ValidationError errors={formErrors.availability} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter le membre'}
              </button>

              <ValidationError errors={formErrors.submit} />
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team, teamIndex) => (
          <Card key={teamIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member, memberIndex) => (
                  <div key={memberIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-sm ${
                          parseInt(member.availability) > 80 
                            ? 'bg-green-100 text-green-800'
                            : parseInt(member.availability) > 40
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        onClick={() => handleAvailabilityChange(teamIndex, memberIndex, member.availability)}
                      >
                        {member.availability}% dispo
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Film className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Projets actifs:</span>
                        <div className="flex gap-1">
                          {member.currentProjects.map((project, p) => (
                            <span key={p} className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Prochaine disponibilité:</span>
                        <span className={member.nextAvailable === 'Disponible' ? 'text-green-600' : ''}>
                          {member.nextAvailable}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}