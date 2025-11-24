import React, { useState } from 'react';
import { 
  Package, 
  Monitor, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  Wrench,
  BarChart3,
  ShoppingCart,
  Warehouse,
  Settings
} from 'lucide-react';
import { User } from '../../../types';
import { useStock } from '../../../hooks/useStock';
import { useEquipments } from '../../../hooks/useEquipments';
import StockItemForm from '../../forms/StockItemForm';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

interface LogisticsDashboardProps {
  user: User;
  activeSection: string;
}

const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({ user, activeSection }) => {
  const { stockItems, stats: stockStats, refreshStockItems } = useStock();
  const { equipments, stats: equipmentStats, refreshEquipments } = useEquipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showStockForm, setShowStockForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const stats = {
    stock: stockStats,
    equipements: equipmentStats
  };

  const stockData = [
    { name: 'Bureautique', value: stockStats.categories.bureautique, color: '#3B82F6' },
    { name: 'Technique', value: stockStats.categories.technique, color: '#10B981' },
    { name: 'Informatique', value: stockStats.categories.informatique, color: '#F59E0B' },
    { name: 'Mobilier', value: stockStats.categories.mobilier, color: '#EF4444' }
  ];

  const equipmentData = [
    { name: 'Fonctionnel', value: equipmentStats.fonctionnel, color: '#10B981' },
    { name: 'Maintenance', value: equipmentStats.maintenance, color: '#F59E0B' },
    { name: 'Panne', value: equipmentStats.panne, color: '#EF4444' }
  ];

  const monthlyStock = [
    { month: 'Jan', entrees: 120, sorties: 95, stock: 1180 },
    { month: 'Fév', entrees: 140, sorties: 110, stock: 1210 },
    { month: 'Mar', entrees: 100, sorties: 85, stock: 1225 },
    { month: 'Avr', entrees: 160, sorties: 135, stock: 1250 }
  ];

  const commandes = [
    { id: 1, numero: 'CMD-2024-001', fournisseur: 'Papeterie Centrale', montant: 125000, statut: 'en_cours', date: '2024-01-20', articles: 5 },
    { id: 2, numero: 'CMD-2024-002', fournisseur: 'Tech Supply', montant: 75000, statut: 'livree', date: '2024-01-18', articles: 3 },
    { id: 3, numero: 'CMD-2024-003', fournisseur: 'Office Pro', montant: 200000, statut: 'validee', date: '2024-01-22', articles: 8 }
  ];

  const getStockStatusColor = (statut: string) => {
    switch (statut) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'faible': return 'bg-yellow-100 text-yellow-800';
      case 'rupture': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (item: any) => {
    if (item.quantite === 0) return 'rupture';
    if (item.quantite <= item.seuil_alerte) return 'faible';
    return 'normal';
  };

  const getEquipmentStatusColor = (statut: string) => {
    switch (statut) {
      case 'fonctionnel': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'panne': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommandeStatusColor = (statut: string) => {
    switch (statut) {
      case 'validee': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'livree': return 'bg-green-100 text-green-800';
      case 'annulee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.stock.total}</div>
              <div className="text-sm text-blue-600 font-medium">Articles en stock</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Stock Total</h3>
          <p className="text-sm text-gray-600">Tous les articles</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.stock.faible}</div>
              <div className="text-sm text-yellow-600 font-medium">Stock faible</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Alertes Stock</h3>
          <p className="text-sm text-gray-600">Nécessite réapprovisionnement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.equipements.fonctionnel}</div>
              <div className="text-sm text-green-600 font-medium">Fonctionnels</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Équipements</h3>
          <p className="text-sm text-gray-600">En état de marche</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.equipements.maintenance + stats.equipements.panne}</div>
              <div className="text-sm text-red-600 font-medium">Maintenance</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Maintenance</h3>
          <p className="text-sm text-gray-600">Équipements à réparer</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Répartition du Stock</h3>
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {stockData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">État des Équipements</h3>
            <Monitor className="w-6 h-6 text-green-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {equipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {equipmentData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Stock Evolution */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Évolution Mensuelle du Stock</h3>
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyStock}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="entrees" stroke="#10B981" strokeWidth={3} name="Entrées" />
              <Line type="monotone" dataKey="sorties" stroke="#EF4444" strokeWidth={3} name="Sorties" />
              <Line type="monotone" dataKey="stock" stroke="#3B82F6" strokeWidth={3} name="Stock Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowStockForm(true)}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Ajouter Article</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <Truck className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">Nouvelle Commande</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
            <Wrench className="w-6 h-6 text-yellow-600" />
            <span className="font-medium text-yellow-900">Maintenance</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-purple-900">Rapport</span>
          </button>
        </div>
      </div>

      {/* Forms */}
      {showStockForm && (
        <StockItemForm
          onClose={() => setShowStockForm(false)}
          onSuccess={() => {
            refreshStockItems();
            setShowStockForm(false);
          }}
          editItem={editingItem}
        />
      )}
    </div>
  );

  const renderStockManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Gestion des Stocks</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowStockForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvel Article</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Article</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Catégorie</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Quantité</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Seuil</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Prix Unitaire</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fournisseur</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.filter(item => 
                item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.categorie.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.nom}</td>
                  <td className="py-3 px-4 text-gray-600">{item.categorie}</td>
                  <td className="py-3 px-4 text-gray-900">{item.quantite}</td>
                  <td className="py-3 px-4 text-gray-600">{item.seuil_alerte}</td>
                  <td className="py-3 px-4 text-gray-900">{item.prix_unitaire?.toLocaleString() || 0} FCFA</td>
                  <td className="py-3 px-4 text-gray-600">{item.fournisseur}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(getStockStatus(item))}`}>
                      {getStockStatus(item)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setShowStockForm(true);
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forms */}
      {showStockForm && (
        <StockItemForm
          onClose={() => {
            setShowStockForm(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            refreshStockItems();
            setShowStockForm(false);
            setEditingItem(null);
          }}
          editItem={editingItem}
        />
      )}
    </div>
  );

  const renderEquipmentManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Gestion des Équipements</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              <span>Nouvel Équipement</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Équipement</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Localisation</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Responsable</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Dernière Maintenance</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment) => (
                <tr key={equipment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{equipment.nom}</td>
                  <td className="py-3 px-4 text-gray-600">{equipment.type_equipement}</td>
                  <td className="py-3 px-4 text-gray-600">{equipment.localisation}</td>
                  <td className="py-3 px-4 text-gray-600">{equipment.responsable}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEquipmentStatusColor(equipment.statut)}`}>
                      {equipment.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {equipment.date_derniere_maintenance ? new Date(equipment.date_derniere_maintenance).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <Wrench className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCommandes = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Gestion des Commandes</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-4 h-4" />
            <span>Nouvelle Commande</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-800">3</p>
              <p className="text-sm text-blue-600">Commandes actives</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">1</p>
              <p className="text-sm text-green-600">Livrées ce mois</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-800">400K</p>
              <p className="text-sm text-yellow-600">Montant total</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-800">16</p>
              <p className="text-sm text-purple-600">Articles commandés</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {commandes.map((commande) => (
            <div key={commande.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{commande.numero}</div>
                  <div className="text-sm text-gray-600">
                    {commande.fournisseur} • {commande.date}
                  </div>
                  <div className="text-xs text-gray-500">
                    {commande.articles} articles • {commande.montant.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCommandeStatusColor(commande.statut)}`}>
                  {commande.statut}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-700">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render content based on active section
  switch (activeSection) {
    case 'dashboard':
    case 'overview':
      return renderOverview();
    case 'stock':
      return renderStockManagement();
    case 'equipements':
      return renderEquipmentManagement();
    case 'commandes':
      return renderCommandes();
    default:
      return renderOverview();
  }
};

export default LogisticsDashboard;