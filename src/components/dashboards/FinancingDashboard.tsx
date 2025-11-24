import React, { useState } from 'react';
import { 
  CreditCard, 
  Calculator, 
  Handshake, 
  Network, 
  DollarSign, 
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  PieChart as PieChartIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

const FinancingDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for charts
  const bureauData = [
    { name: 'Montage Financier', value: 45, color: '#F97316' },
    { name: 'Partenariats', value: 30, color: '#EAB308' },
    { name: 'Coordination', value: 25, color: '#F59E0B' }
  ];

  const financingTrends = [
    { month: 'Jan', montage: 850000, partenariat: 650000, coordination: 450000 },
    { month: 'Fév', montage: 920000, partenariat: 720000, coordination: 520000 },
    { month: 'Mar', montage: 1100000, partenariat: 850000, coordination: 680000 },
    { month: 'Avr', montage: 1250000, partenariat: 950000, coordination: 750000 }
  ];

  const projectStatus = [
    { name: 'Financés', value: 42, color: '#10B981' },
    { name: 'En négociation', value: 18, color: '#3B82F6' },
    { name: 'En étude', value: 12, color: '#F59E0B' },
    { name: 'Suspendus', value: 5, color: '#EF4444' }
  ];

  const investmentData = [
    { month: 'Jan', investment: 2400000 },
    { month: 'Fév', investment: 2800000 },
    { month: 'Mar', investment: 3200000 },
    { month: 'Avr', investment: 3800000 },
    { month: 'Mai', investment: 4200000 },
    { month: 'Jun', investment: 4600000 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Department Header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-6 lg:p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Financement Foncier et Immobilier</h1>
              <p className="text-orange-100 text-base lg:text-lg">Solutions financières et partenariats stratégiques</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl lg:text-4xl font-bold">4.6M€</div>
            <div className="text-orange-200 text-sm lg:text-base">Volume total</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">45</div>
              <div className="text-sm text-green-600 font-medium">+7 ce mois</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Montages Financiers</h3>
          <p className="text-sm text-gray-600">Projets en cours</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Handshake className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">30</div>
              <div className="text-sm text-blue-600 font-medium">+4 ce mois</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Partenariats</h3>
          <p className="text-sm text-gray-600">Accords actifs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">25</div>
              <div className="text-sm text-amber-600 font-medium">Coordination</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Projets Coordonnés</h3>
          <p className="text-sm text-gray-600">Suivi technique</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">77</div>
              <div className="text-sm text-green-600 font-medium">Investisseurs</div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Réseau</h3>
          <p className="text-sm text-gray-600">Partenaires financiers</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Growth Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Croissance des Investissements</h3>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${(value as number / 1000000).toFixed(1)}M€`, 'Investissement']} />
                <Area 
                  type="monotone" 
                  dataKey="investment" 
                  stroke="#10B981" 
                  fill="url(#colorInvestment)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bureau Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Répartition par Bureau</h3>
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bureauData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bureauData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {bureauData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financing Trends */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Tendances de Financement</h3>
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${(value as number / 1000).toFixed(0)}K€`, '']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="montage" 
                stroke="#F97316" 
                strokeWidth={3}
                name="Montage Financier"
                dot={{ fill: '#F97316', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="partenariat" 
                stroke="#EAB308" 
                strokeWidth={3}
                name="Partenariats"
                dot={{ fill: '#EAB308', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="coordination" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Coordination"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Status */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">État des Projets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectStatus.map((status, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${status.color}20` }}>
                {status.name === 'Financés' && <CheckCircle className="w-6 h-6" style={{ color: status.color }} />}
                {status.name === 'En négociation' && <Handshake className="w-6 h-6" style={{ color: status.color }} />}
                {status.name === 'En étude' && <FileText className="w-6 h-6" style={{ color: status.color }} />}
                {status.name === 'Suspendus' && <AlertTriangle className="w-6 h-6" style={{ color: status.color }} />}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{status.value}</div>
                <div className="text-sm text-gray-600">{status.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Financial Activities */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Activités Financières Récentes</h3>
        <div className="space-y-4">
          {[
            { project: 'Résidence Les Palmiers', action: 'Financement approuvé - 2.5M€', bureau: 'Montage Financier', time: '14:30', status: 'completed' },
            { project: 'Centre Commercial Yaoundé', action: 'Négociation partenariat en cours', bureau: 'Partenariats', time: '11:45', status: 'in-progress' },
            { project: 'Lotissement Douala Est', action: 'Coordination technique démarrée', bureau: 'Coordination', time: '09:20', status: 'pending' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'completed' ? 'bg-green-100' :
                  activity.status === 'in-progress' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  {activity.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.status === 'in-progress' && <Clock className="w-5 h-5 text-orange-600" />}
                  {activity.status === 'pending' && <FileText className="w-5 h-5 text-yellow-600" />}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{activity.project}</div>
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

export default FinancingDashboard;