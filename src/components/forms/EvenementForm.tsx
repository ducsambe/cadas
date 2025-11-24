import React, { useState } from 'react';
import { X, Save, Calendar, User, MapPin, Users, FileText, Target } from 'lucide-react';
import { useEvenements } from '../../hooks/useEvenements';
import type { Database } from '../../lib/supabase';

type EvenementInsert = Database['public']['Tables']['evenements']['Insert'];

interface EvenementFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const EvenementForm: React.FC<EvenementFormProps> = ({ onClose, onSuccess }) => {
  const { createEvenement } = useEvenements();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<EvenementInsert>>({
    titre: '',
    description: '',
    type_evenement: 'reunion',
    date_debut: '',
    date_fin: '',
    lieu: '',
    participants_prevus: 0,
    participants_confirmes: 0,
    statut: 'planifie',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvenement(formData as EvenementInsert);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof EvenementInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Nouvel Événement</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Informations de base */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              1. Informations de l'Événement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  required
                  value={formData.titre || ''}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Titre de l'événement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'événement *</label>
                <select
                  required
                  value={formData.type_evenement || 'reunion'}
                  onChange={(e) => handleChange('type_evenement', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="reunion">Réunion</option>
                  <option value="formation">Formation</option>
                  <option value="audit">Audit</option>
                  <option value="conference">Conférence</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={formData.statut || 'planifie'}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="planifie">Planifié</option>
                  <option value="confirme">Confirmé</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description détaillée de l'événement"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dates et Lieu */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              2. Dates et Lieu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure début *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date_debut || ''}
                  onChange={(e) => handleChange('date_debut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure fin *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date_fin || ''}
                  onChange={(e) => handleChange('date_fin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
                <input
                  type="text"
                  required
                  value={formData.lieu || ''}
                  onChange={(e) => handleChange('lieu', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Lieu de l'événement"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Participants */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              3. Participants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants prévus</label>
                <input
                  type="number"
                  min="0"
                  value={formData.participants_prevus || 0}
                  onChange={(e) => handleChange('participants_prevus', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants confirmés</label>
                <input
                  type="number"
                  min="0"
                  value={formData.participants_confirmes || 0}
                  onChange={(e) => handleChange('participants_confirmes', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              4. Notes et Observations
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Notes et observations sur l'événement..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Création...' : 'Créer l\'Événement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvenementForm;