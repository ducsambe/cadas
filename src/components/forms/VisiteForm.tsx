import React, { useState } from 'react';
import { X, Save, User, MapPin, Calendar, UserCheck, Target, FileText } from 'lucide-react';
import { useVisites } from '../../hooks/useVisites';
import type { Database } from '../../lib/supabase';

type VisiteInsert = Database['public']['Tables']['visites']['Insert'];

interface VisiteFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const VisiteForm: React.FC<VisiteFormProps> = ({ onClose, onSuccess }) => {
  const { createVisite } = useVisites();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<VisiteInsert>>({
    type_visite: 'client',
    client_nom: '',
    client_societe: '',
    client_qualite: '',
    lieu_visite: '',
    adresse: '',
    ville: '',
    region: '',
    date_debut: '',
    date_fin: '',
    objectif: '',
    priorite: 'normale',
    statut: 'planifiee'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createVisite(formData as Omit<VisiteInsert, 'numero'>);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof VisiteInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Planifier une Visite</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section 1: Type et Dates */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              1. Type de Visite et Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de visite *</label>
                <select
                  required
                  value={formData.type_visite || 'client'}
                  onChange={(e) => handleChange('type_visite', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="client">Client</option>
                  <option value="partenaire">Partenaire</option>
                  <option value="inspection">Inspection terrain</option>
                  <option value="controle">Contrôle qualité</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure début *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date_debut || ''}
                  onChange={(e) => handleChange('date_debut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date et heure fin *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date_fin || ''}
                  onChange={(e) => handleChange('date_fin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Client/Contact */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              2. Client/Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du client *</label>
                <input
                  type="text"
                  required
                  value={formData.client_nom || ''}
                  onChange={(e) => handleChange('client_nom', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nom complet du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Société</label>
                <input
                  type="text"
                  value={formData.client_societe || ''}
                  onChange={(e) => handleChange('client_societe', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nom de la société"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualité</label>
                <select
                  value={formData.client_qualite || ''}
                  onChange={(e) => handleChange('client_qualite', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Propriétaire">Propriétaire</option>
                  <option value="Mandataire">Mandataire</option>
                  <option value="Promoteur">Promoteur</option>
                  <option value="Géomètre">Géomètre</option>
                  <option value="Directeur">Directeur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Lieu de la Visite */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              3. Lieu de la Visite
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de visite *</label>
                <input
                  type="text"
                  required
                  value={formData.lieu_visite || ''}
                  onChange={(e) => handleChange('lieu_visite', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Terrain, Bureau, Chantier, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={formData.adresse || ''}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Adresse complète"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  value={formData.ville || ''}
                  onChange={(e) => handleChange('ville', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Yaoundé, Douala, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
                <input
                  type="text"
                  value={formData.region || ''}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Centre, Littoral, etc."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Objectif */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              4. Objectif de la Visite
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objectif</label>
              <textarea
                rows={3}
                value={formData.objectif || ''}
                onChange={(e) => handleChange('objectif', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Décrivez l'objectif de cette visite..."
              />
            </div>
          </div>

          {/* Section 5: Priorité et Statut */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              5. Priorité et Statut
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={formData.priorite || 'normale'}
                  onChange={(e) => handleChange('priorite', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="normale">Normale</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={formData.statut || 'planifiee'}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="planifiee">Planifiée</option>
                  <option value="confirmee">Confirmée</option>
                  <option value="en_cours">En cours</option>
                  <option value="realisee">Réalisée</option>
                </select>
              </div>
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
              <span>{loading ? 'Planification...' : 'Planifier la Visite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisiteForm;