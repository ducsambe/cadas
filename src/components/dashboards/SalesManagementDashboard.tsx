import React, { useState } from 'react';
import { 
  Building, 
  Shield, 
  TrendingUp, 
  Home, 
  Users, 
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Key,
  MapPin
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const SalesManagementDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for charts
  const bureauData = [
    { name: 'Suivi Juridique', value: 35, color: '#6B7280' },
    { name: 'Commercialisation', value: 40, color: '#374151' },
    { name: 'Gestion Locative', value: 25, color: '#4B5563' }
  ];

  const salesData = [
    { month: 'Jan', ventes: 12, locations: 8, juridique: 15 },
    { month: 'Fév', ventes: 18, locations: 12, juridique: 20 },
    { month: 'Mar', ventes: 25, locations: 15, juridique: 18 },
    { month: 'Avr', ventes: 22, locations: 18, juridique: 25 }
  ];

  const propertyTypes = [
    { name: 'Appartements', value: 45, color: '#6B7280' },
    { name: 'Maisons', value: 30, color: '#374151' },
    { name: 'Commerces', value: 15, color: '#4B5563' },
    { name: 'Terrains', value: 10, color: '#9CA3AF' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 450000 },
    { month: 'Fév', revenue: 520000 },
    { month: 'Mar', revenue: 680000 },
    { month: 'Avr', revenue: 750000 },
    { month: 'Mai', revenue: 820000 },
    { month: 'Jun', revenue: 950000 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Department Header */}
      <div className="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl p-6 lg:p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Vente et Gestion Immobilière</h1>
              <p className="text-gray-200 text-base lg:text-lg">Commercialisation et gestion du patrimoine immobilier</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl lg:text-4xl font-bold">950K€</div>
            <div className="text-gray-300 text-sm lg:text-base">CA mensuel</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">35</div>
              <div className="text-sm text-green-600 font-medium">+3 cette semaine</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Suivi Juridique</h3>
          <p className="text-sm text-gray-600">Dossiers en cours</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">40</div>
              <div className="text-sm text-blue-600 font-medium">+6 cette semaine</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Ventes Actives</h3>
          <p className="text-sm text-gray-600">Négociations en cours</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">25</div>
              <div className="text-sm text-gray-600 font-medium">Biens gérés</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Gestion Locative</h3>
          <p className="text-sm text-gray-600">Propriétés en location</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-green-600 font-medium">Clients actifs</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Portefeuille</h3>
          <p className="text-sm text-gray-600">Base clients</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Évolution du Chiffre d'Affaires</h3>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${(value as number / 1000).toFixed(0)}K€`, 'Chiffre d\'affaires']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={4}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Types Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Types de Biens</h3>
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {propertyTypes.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Performance */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Performance par Bureau</h3>
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <BarChart className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventes" fill="#6B7280" name="Ventes" radius={[4, 4, 0, 0]} />
              <Bar dataKey="locations" fill="#374151" name="Locations" radius={[4, 4, 0, 0]} />
              <Bar dataKey="juridique" fill="#4B5563" name="Juridique" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Biens à Vendre</h3>
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">127</div>
          <div className="text-sm text-gray-600 mb-4">Propriétés disponibles</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Appartements</span>
              <span className="font-medium">67</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Maisons</span>
              <span className="font-medium">35</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Commerces</span>
              <span className="font-medium">25</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Biens en Location</h3>
            <Home className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">89</div>
          <div className="text-sm text-gray-600 mb-4">Propriétés louées</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taux d'occupation</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Loyer moyen</span>
              <span className="font-medium">850€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Revenus mensuels</span>
              <span className="font-medium">75,650€</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Zones Géographiques</h3>
            <MapPin className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
          <div className="text-sm text-gray-600 mb-4">Secteurs couverts</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Yaoundé Centre</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Douala</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Autres</span>
              <span className="font-medium">25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Activities */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Activités Commerciales Récentes</h3>
        <div className="space-y-4">
          {[
            { property: 'Appartement 3P - Bastos', action: 'Vente finalisée - 185,000€', bureau: 'Commercialisation', time: '16:15', status: 'completed' },
            { property: 'Villa 5P - Mendong', action: 'Contrat de location signé', bureau: 'Gestion Locative', time: '14:30', status: 'completed' },
            { property: 'Bureau 120m² - Centre-ville', action: 'Vérification juridique en cours', bureau: 'Suivi Juridique', time: '11:20', status: 'in-progress' },
            { property: 'Terrain 500m² - Odza', action: 'Négociation prix en cours', bureau: 'Commercialisation', time: '09:45', status: 'pending' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'completed' ? 'bg-green-100' :
                  activity.status === 'in-progress' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  {activity.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.status === 'in-progress' && <Clock className="w-5 h-5 text-blue-600" />}
                  {activity.status === 'pending' && <FileText className="w-5 h-5 text-yellow-600" />}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{activity.property}</div>
                  <div className="text-sm text-gray-600">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.bureau}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesManagementDashboard;