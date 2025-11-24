import React, { useState } from 'react';
import { X, Save, Package, DollarSign, MapPin, Truck } from 'lucide-react';
import { useStock } from '../../hooks/useStock';
import type { Database } from '../../lib/supabase';

type StockItemInsert = Database['public']['Tables']['stock_items']['Insert'];

interface StockItemFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  editItem?: Database['public']['Tables']['stock_items']['Row'];
}

const StockItemForm: React.FC<StockItemFormProps> = ({ onClose, onSuccess, editItem }) => {
  const { createStockItem, updateStockItem } = useStock();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<StockItemInsert>>({
    nom: editItem?.nom || '',
    description: editItem?.description || '',
    categorie: editItem?.categorie || 'bureautique',
    quantite: editItem?.quantite || 0,
    seuil_alerte: editItem?.seuil_alerte || 10,
    prix_unitaire: editItem?.prix_unitaire || 0,
    fournisseur: editItem?.fournisseur || '',
    localisation: editItem?.localisation || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editItem) {
        await updateStockItem(editItem.id, formData);
      } else {
        await createStockItem(formData as Omit<StockItemInsert, 'code_article'>);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof StockItemInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8" />
              <h2 className="text-2xl font-bold">
                {editItem ? 'Modifier Article' : 'Nouvel Article de Stock'}
              </h2>
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
              <Package className="w-5 h-5 mr-2" />
              Informations de l'Article
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'article *</label>
                <input
                  type="text"
                  required
                  value={formData.nom || ''}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de l'article"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <select
                  required
                  value={formData.categorie || 'bureautique'}
                  onChange={(e) => handleChange('categorie', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bureautique">Bureautique</option>
                  <option value="technique">Technique</option>
                  <option value="informatique">Informatique</option>
                  <option value="mobilier">Mobilier</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description détaillée de l'article"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Quantités et Prix */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Quantités et Prix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantité *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantite || 0}
                  onChange={(e) => handleChange('quantite', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seuil d'alerte *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.seuil_alerte || 10}
                  onChange={(e) => handleChange('seuil_alerte', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prix_unitaire || 0}
                  onChange={(e) => handleChange('prix_unitaire', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Fournisseur et Localisation */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Fournisseur et Localisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
                <input
                  type="text"
                  value={formData.fournisseur || ''}
                  onChange={(e) => handleChange('fournisseur', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Nom du fournisseur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                <input
                  type="text"
                  value={formData.localisation || ''}
                  onChange={(e) => handleChange('localisation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Emplacement dans le magasin"
                />
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
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Sauvegarde...' : editItem ? 'Modifier' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockItemForm;