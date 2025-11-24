import React, { useState } from 'react';
import { X, Save, Mail, User, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { useCourriers } from '../../hooks/useCourriers';
import type { Database } from '../../lib/supabase';

type CourrierInsert = Database['public']['Tables']['courriers']['Insert'];

interface CourrierFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CourrierForm: React.FC<CourrierFormProps> = ({ onClose, onSuccess }) => {
  const { createCourrier } = useCourriers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CourrierInsert>>({
    expediteur: '',
    destinataire: '',
    objet: '',
    type_courrier: 'entrant',
    statut: 'nouveau',
    date_courrier: new Date().toISOString().slice(0, 16),
    priorite: 'normale',
    contenu: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCourrier(formData as Omit<CourrierInsert, 'numero'>);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CourrierInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Nouveau Courrier</h2>
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
              <Mail className="w-5 h-5 mr-2" />
              1. Informations du Courrier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expéditeur *</label>
                <input
                  type="text"
                  required
                  value={formData.expediteur || ''}
                  onChange={(e) => handleChange('expediteur', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de l'expéditeur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinataire</label>
                <input
                  type="text"
                  value={formData.destinataire || ''}
                  onChange={(e) => handleChange('destinataire', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom du destinataire"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
                <input
                  type="text"
                  required
                  value={formData.objet || ''}
                  onChange={(e) => handleChange('objet', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Objet du courrier"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Type et Dates */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              2. Type et Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de courrier *</label>
                <select
                  required
                  value={formData.type_courrier || 'entrant'}
                  onChange={(e) => handleChange('type_courrier', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="entrant">Entrant</option>
                  <option value="sortant">Sortant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date du courrier *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date_courrier || ''}
                  onChange={(e) => handleChange('date_courrier', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de réception</label>
                <input
                  type="datetime-local"
                  value={formData.date_reception || ''}
                  onChange={(e) => handleChange('date_reception', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Priorité et Statut */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              3. Priorité et Statut
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={formData.priorite || 'normale'}
                  onChange={(e) => handleChange('priorite', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="normale">Normale</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={formData.statut || 'nouveau'}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="traite">Traité</option>
                  <option value="urgent">Urgent</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Contenu */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              4. Contenu du Courrier
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                rows={4}
                value={formData.contenu || ''}
                onChange={(e) => handleChange('contenu', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Contenu détaillé du courrier..."
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
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Création...' : 'Créer le Courrier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourrierForm;