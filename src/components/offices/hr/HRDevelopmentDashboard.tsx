import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Heart,
  MessageSquare,
  Target,
  TrendingUp,
  Shield,
  BarChart3,
  Calendar,
  Award,
  Smile,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { useFormations } from '../../../hooks/useFormations';
import { useTalentManagement } from '../../../hooks/useTalentManagement';
import { useSocialClimate } from '../../../hooks/useSocialClimate';
import { User } from '../../../types';

interface HRDevelopmentDashboardProps {
  user: User;
  activeSection: string;
}

const HRDevelopmentDashboard: React.FC<HRDevelopmentDashboardProps> = ({ user, activeSection }) => {

  const { formations, loading: formationsLoading, getFormationStats } = useFormations();
  const { talents, loading: talentsLoading } = useTalentManagement();
  const { surveys, loading: surveysLoading } = useSocialClimate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [formationStats, setFormationStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const result = await getFormationStats();
    if (result.success && result.data) {
      setFormationStats(result.data);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'dashboard-formation':
        return renderDashboard();
      case 'catalogue-complet':
        return renderFormations();
      case 'nouvelle-formation':
        return renderTalents();
      case 'categories-themes':
        return renderSocialClimate();
      case 'formateurs':
        return renderPlaceholder('Formateurs & Intervenants', <Users className="w-16 h-16 text-gray-400 mx-auto" />);
      case 'suivi-objectifs':
        return renderPlaceholder('Suivi des Objectifs & Performance Collective', <Target className="w-16 h-16 text-gray-400 mx-auto" />);
      case 'mobilite-reconversion':
        return renderPlaceholder('Mobilité, Reconversion & Plan de Carrière', <TrendingUp className="w-16 h-16 text-gray-400 mx-auto" />);
      case 'sante-securite':
        return renderPlaceholder('Santé & Sécurité au Travail', <Shield className="w-16 h-16 text-gray-400 mx-auto" />);
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    const latestSurvey = surveys[0];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <GraduationCap className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{formationStats?.total || 0}</span>
            </div>
            <h3 className="text-lg font-semibold">Formations</h3>
            <p className="text-sm opacity-80 mt-1">
              {formationStats?.en_cours || 0} en cours
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{talents.length}</span>
            </div>
            <h3 className="text-lg font-semibold">Talents Identifiés</h3>
            <p className="text-sm opacity-80 mt-1">
              {talents.filter((t) => t.niveau_talent === 'Haut Potentiel').length} hauts potentiels
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Smile className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">
                {latestSurvey?.satisfaction_globale?.toFixed(1) || '-'}
              </span>
            </div>
            <h3 className="text-lg font-semibold">Satisfaction Globale</h3>
            <p className="text-sm opacity-80 mt-1">Sur 10 points</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{formationStats?.total_participants || 0}</span>
            </div>
            <h3 className="text-lg font-semibold">Participants</h3>
            <p className="text-sm opacity-80 mt-1">Toutes formations confondues</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Formations par Type
            </h3>
            <div className="space-y-3">
              {formationStats?.byType &&
                Object.entries(formationStats.byType).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-700">{type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / formationStats.total) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Indicateurs de Bien-être
            </h3>
            {latestSurvey ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Équilibre vie pro/perso</span>
                  <span className="font-bold text-lg text-gray-900">
                    {latestSurvey.equilibre_vie_pro_perso?.toFixed(1) || '-'}/10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Charge de travail</span>
                  <span className="font-bold text-lg text-gray-900">
                    {latestSurvey.charge_travail?.toFixed(1) || '-'}/10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Ambiance équipe</span>
                  <span className="font-bold text-lg text-gray-900">
                    {latestSurvey.ambiance_equipe?.toFixed(1) || '-'}/10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Reconnaissance</span>
                  <span className="font-bold text-lg text-gray-900">
                    {latestSurvey.reconnaissance?.toFixed(1) || '-'}/10
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune enquête disponible</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Répartition des Talents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Haut Potentiel',
              'Talent Confirmé',
              'Potentiel à Développer',
              'Performeur',
              'En Observation',
            ].map((niveau) => {
              const count = talents.filter((t) => t.niveau_talent === niveau).length;
              return (
                <div key={niveau} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                  <div className="text-sm text-gray-600">{niveau}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderFormations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Formations</h2>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvelle Formation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {formations.map((formation) => (
              <tr key={formation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{formation.titre}</div>
                  <div className="text-sm text-gray-500">{formation.categorie}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{formation.type_formation}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formation.date_debut && new Date(formation.date_debut).toLocaleDateString()}
                  {formation.date_fin && ' - ' + new Date(formation.date_fin).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formation.nombre_participants} / {formation.nombre_places}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formation.statut === 'Terminée'
                        ? 'bg-green-100 text-green-800'
                        : formation.statut === 'En cours'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {formation.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTalents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Talents</h2>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Évaluer Talent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {talents.map((talent) => (
          <div key={talent.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{talent.poste_actuel}</h3>
                <p className="text-sm text-gray-500 mt-1">Évaluation: {talent.date_evaluation}</p>
              </div>
              <Award className="w-6 h-6 text-purple-500" />
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500">Niveau</span>
                <p className="text-sm font-medium text-gray-900">{talent.niveau_talent}</p>
              </div>

              {talent.note_potentiel_global && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Score</span>
                  <p className="text-lg font-bold text-purple-600">
                    {talent.note_potentiel_global.toFixed(1)}/10
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs font-medium text-gray-500">Compétences clés</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {talent.competences_cles.slice(0, 3).map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    talent.statut === 'Prêt promotion'
                      ? 'bg-green-100 text-green-800'
                      : talent.statut === 'En développement'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {talent.statut}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Voir le profil
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSocialClimate = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Climat Social & Bien-être</h2>
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvelle Enquête
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {surveys.map((survey) => (
          <div key={survey.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{survey.titre}</h3>
                <p className="text-sm text-gray-500 mt-1">{survey.type_action}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  survey.statut === 'Terminée'
                    ? 'bg-green-100 text-green-800'
                    : survey.statut === 'En cours'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {survey.statut}
              </span>
            </div>

            {survey.satisfaction_globale && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Satisfaction globale</span>
                  <span className="font-bold text-lg text-gray-900">
                    {survey.satisfaction_globale.toFixed(1)}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(survey.satisfaction_globale / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Participants</span>
                <span className="font-medium text-gray-900">{survey.nombre_participants}</span>
              </div>
              {survey.taux_participation && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taux de participation</span>
                  <span className="font-medium text-gray-900">
                    {survey.taux_participation.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Voir les résultats
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, icon: any) => (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      {icon}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">{title}</h3>
      <p className="text-gray-600">Module en cours de développement</p>
    </div>
  );

  if (formationsLoading || talentsLoading || surveysLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}
export default HRDevelopmentDashboard;