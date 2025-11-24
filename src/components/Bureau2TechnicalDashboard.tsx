import React, { useState } from 'react';
import {
  ArrowLeft,
  Map,
  FolderOpen,
  FileCheck,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Euro,
  Calendar,
  ArrowRight,
  Upload,
  Download
} from 'lucide-react';
import { Language } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import AnimatedBackground from './AnimatedBackground';

interface Bureau2TechnicalDashboardProps {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

interface LandFile {
  id: string;
  clientName: string;
  fileNumber: string;
  requestType: string;
  currentPhase: 3 | 4 | 5;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  createdAt: string;
  updatedAt: string;
  documents: string[];
  estimatedCost: string;
  paymentStatus: 'pending' | 'partial' | 'completed';
}

const Bureau2TechnicalDashboard: React.FC<Bureau2TechnicalDashboardProps> = ({
  onBack,
  language,
  setLanguage
}) => {
  const [activeTab, setActiveTab] = useState<'phase3' | 'phase4' | 'phase5'>('phase3');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const mockFiles: LandFile[] = [
    {
      id: '1',
      clientName: 'Jean Mballa',
      fileNumber: 'GFC-2025-001',
      requestType: 'Immatriculation Directe',
      currentPhase: 3,
      status: 'in-progress',
      createdAt: '2025-09-15',
      updatedAt: '2025-10-01',
      documents: ['Plans techniques', 'Levés topographiques'],
      estimatedCost: '250,000 FCFA',
      paymentStatus: 'completed'
    },
    {
      id: '2',
      clientName: 'Marie Nguema',
      fileNumber: 'GFC-2025-002',
      requestType: 'Morcellement Notarié',
      currentPhase: 4,
      status: 'in-progress',
      createdAt: '2025-09-10',
      updatedAt: '2025-10-01',
      documents: ['Bordereau dépôt', 'Documents admin'],
      estimatedCost: '400,000 FCFA',
      paymentStatus: 'completed'
    },
    {
      id: '3',
      clientName: 'Paul Essomba',
      fileNumber: 'GFC-2025-003',
      requestType: 'Concession Définitive',
      currentPhase: 5,
      status: 'completed',
      createdAt: '2025-09-01',
      updatedAt: '2025-09-30',
      documents: ['Dossier final', 'Bordereau sortie', 'Archive numérique'],
      estimatedCost: '500,000 FCFA',
      paymentStatus: 'completed'
    }
  ];

  const getPhaseFiles = (phase: 3 | 4 | 5) => {
    return mockFiles.filter(file => {
      const matchesPhase = file.currentPhase === phase;
      const matchesSearch = file.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.fileNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || file.status === filterStatus;
      return matchesPhase && matchesSearch && matchesFilter;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'on-hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      en: {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'on-hold': 'On Hold',
        'pending': 'Pending'
      },
      fr: {
        'completed': 'Terminé',
        'in-progress': 'En cours',
        'on-hold': 'En attente',
        'pending': 'En attente'
      }
    };
    return labels[language][status as keyof typeof labels.fr] || status;
  };

  const renderPhase3Content = () => {
    const files = getPhaseFiles(3);

    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            {language === 'en' ? 'Phase 3: Technical Execution' : 'Phase 3 : Exécution technique'}
          </h3>
          <div className="space-y-3 text-blue-100">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Preparation of field work' : 'Préparation de la descente pour les différents travaux'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Technical studies: topographic surveys, geodetic, drone orthophotos' : 'Réalisation des études techniques : levés topographiques, géodésiques, orthophotos drones'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Obtaining additional administrative and legal documents' : 'Obtention des documents administratifs et juridiques complémentaires'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Assembly of complete files for submission' : 'Montage des dossiers complets pour dépôt auprès des administrations compétentes'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Internal compliance control' : 'Contrôle interne de conformité du dossier'}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-blue-200 font-semibold mb-2">
              {language === 'en' ? 'Deliverables:' : 'Livrables :'}
            </p>
            <ul className="space-y-1 text-sm text-blue-100">
              <li>{language === 'en' ? 'Complete technical file' : 'Dossier technique complet'}</li>
              <li>{language === 'en' ? 'Validated study plans and reports' : 'Plans et rapports d\'études validés'}</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {files.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-12 border border-white/30 text-center">
              <FolderOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-100 text-lg">
                {language === 'en' ? 'No files in Phase 3' : 'Aucun dossier en Phase 3'}
              </p>
            </div>
          ) : (
            files.map((file) => (
              <div key={file.id} className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{file.clientName}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(file.status)}`}>
                        {getStatusLabel(file.status)}
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm">
                      {language === 'en' ? 'File' : 'Dossier'}: {file.fileNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-300">{file.requestType}</p>
                    <p className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Updated' : 'Mis à jour'}: {file.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-blue-100">{file.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Euro className="w-4 h-4 text-green-300" />
                    <span className="text-sm text-blue-100">{file.estimatedCost}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-blue-200 mb-2">
                    {language === 'en' ? 'Documents:' : 'Documents :'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {file.documents.map((doc, index) => (
                      <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs text-blue-100">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{language === 'en' ? 'Upload Documents' : 'Charger documents'}</span>
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>{language === 'en' ? 'Move to Phase 4' : 'Passer Phase 4'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderPhase4Content = () => {
    const files = getPhaseFiles(4);

    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            {language === 'en' ? 'Phase 4: Administrative Follow-up' : 'Phase 4 : Suivi administratif'}
          </h3>
          <div className="space-y-3 text-blue-100">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Preparation of submission slip' : 'Élaboration du bordereau de transmission pour dépôt'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Monitoring administrative procedures and reminders' : 'Suivi des démarches administratives et relances'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Management of requests for additions or corrections' : 'Gestion des demandes de compléments ou corrections éventuelles'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Final quality control' : 'Contrôle qualité final'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Official retrieval of documents' : 'Récupération officielle des documents par bordereau de réception'}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-blue-200 font-semibold mb-2">
              {language === 'en' ? 'Deliverables:' : 'Livrables :'}
            </p>
            <ul className="space-y-1 text-sm text-blue-100">
              <li>{language === 'en' ? 'Validated submission slip' : 'Bordereau de dépôt validé'}</li>
              <li>{language === 'en' ? 'Official and compliant documents retrieved' : 'Documents officiels récupérés et conformes'}</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {files.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-12 border border-white/30 text-center">
              <FolderOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-100 text-lg">
                {language === 'en' ? 'No files in Phase 4' : 'Aucun dossier en Phase 4'}
              </p>
            </div>
          ) : (
            files.map((file) => (
              <div key={file.id} className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{file.clientName}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(file.status)}`}>
                        {getStatusLabel(file.status)}
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm">
                      {language === 'en' ? 'File' : 'Dossier'}: {file.fileNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-300">{file.requestType}</p>
                    <p className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Updated' : 'Mis à jour'}: {file.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-blue-100">{file.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Euro className="w-4 h-4 text-green-300" />
                    <span className="text-sm text-blue-100">{file.estimatedCost}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-blue-200 mb-2">
                    {language === 'en' ? 'Documents:' : 'Documents :'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {file.documents.map((doc, index) => (
                      <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs text-blue-100">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>{language === 'en' ? 'Track Status' : 'Suivre statut'}</span>
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>{language === 'en' ? 'Move to Phase 5' : 'Passer Phase 5'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderPhase5Content = () => {
    const files = getPhaseFiles(5);

    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            {language === 'en' ? 'Phase 5: Delivery & Archiving' : 'Phase 5 : Transmission et archivage des livrables'}
          </h3>
          <div className="space-y-3 text-blue-100">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Verification of full payment' : 'Vérification du règlement intégral du montant des travaux'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Preparation of file exit slip' : 'Préparation du bordereau de sortie du dossier final'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Scanning and complete digital archiving' : 'Scannage et archivage numérique complet du dossier'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <ArrowRight className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
              <span className="font-semibold text-orange-200">
                {language === 'en' ? 'Transmission of documents to Bureau 1 for client delivery' : 'Transmission des documents officiels au Bureau 1 pour remise au client'}
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <span>{language === 'en' ? 'Official delivery and project closure certificate' : 'Remise officielle des documents et attestation de clôture du projet'}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-blue-200 font-semibold mb-2">
              {language === 'en' ? 'Deliverables:' : 'Livrables :'}
            </p>
            <ul className="space-y-1 text-sm text-blue-100">
              <li>{language === 'en' ? 'Complete final file (technical, administrative, legal)' : 'Dossier final complet (technique, administratif, juridique)'}</li>
              <li>{language === 'en' ? 'Validated exit slip' : 'Bordereau de sortie validé'}</li>
              <li>{language === 'en' ? 'Secure digital archive' : 'Archive numérique sécurisée'}</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {files.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-12 border border-white/30 text-center">
              <FolderOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-100 text-lg">
                {language === 'en' ? 'No files in Phase 5' : 'Aucun dossier en Phase 5'}
              </p>
            </div>
          ) : (
            files.map((file) => (
              <div key={file.id} className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{file.clientName}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(file.status)}`}>
                        {getStatusLabel(file.status)}
                      </span>
                      {file.status === 'completed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
                          {language === 'en' ? 'Ready for Delivery' : 'Prêt pour livraison'}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-200 text-sm">
                      {language === 'en' ? 'File' : 'Dossier'}: {file.fileNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-300">{file.requestType}</p>
                    <p className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Updated' : 'Mis à jour'}: {file.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-blue-100">{file.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Euro className="w-4 h-4 text-green-300" />
                    <span className="text-sm text-blue-100">{file.estimatedCost}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-blue-200 mb-2">
                    {language === 'en' ? 'Documents:' : 'Documents :'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {file.documents.map((doc, index) => (
                      <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs text-blue-100">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>{language === 'en' ? 'Download Archive' : 'Télécharger archive'}</span>
                  </button>
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>{language === 'en' ? 'Transfer to Bureau 1' : 'Transférer Bureau 1'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const phase3Files = getPhaseFiles(3);
  const phase4Files = getPhaseFiles(4);
  const phase5Files = getPhaseFiles(5);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{language === 'en' ? 'Back' : 'Retour'}</span>
        </button>
      </div>

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto pt-24">

          <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-3xl p-8 text-white shadow-2xl mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Map className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {language === 'en' ? 'Office 2: Technical & Topographic Studies' : 'Bureau 2 : Études Techniques et Topographiques'}
                  </h1>
                  <p className="text-green-100">
                    {language === 'en' ? 'Phases 3, 4 & 5 Management' : 'Gestion des Phases 3, 4 & 5'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <FolderOpen className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">{phase3Files.length + phase4Files.length + phase5Files.length}</span>
              </div>
              <p className="text-blue-100">{language === 'en' ? 'Total Files' : 'Dossiers totaux'}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <Map className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-white">{phase3Files.length}</span>
              </div>
              <p className="text-blue-100">{language === 'en' ? 'Phase 3 (Tech)' : 'Phase 3 (Tech)'}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <FileCheck className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-white">{phase4Files.length}</span>
              </div>
              <p className="text-blue-100">{language === 'en' ? 'Phase 4 (Admin)' : 'Phase 4 (Admin)'}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-orange-400" />
                <span className="text-3xl font-bold text-white">{phase5Files.length}</span>
              </div>
              <p className="text-blue-100">{language === 'en' ? 'Phase 5 (Archive)' : 'Phase 5 (Archive)'}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search by client name or file number...' : 'Rechercher par nom de client ou numéro de dossier...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-blue-300" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="all">{language === 'en' ? 'All Status' : 'Tous les statuts'}</option>
                  <option value="pending">{language === 'en' ? 'Pending' : 'En attente'}</option>
                  <option value="in-progress">{language === 'en' ? 'In Progress' : 'En cours'}</option>
                  <option value="completed">{language === 'en' ? 'Completed' : 'Terminé'}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-2 border border-white/30 shadow-xl mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('phase3')}
                className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === 'phase3'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Map className="w-5 h-5" />
                <span className="font-medium text-sm">
                  {language === 'en' ? 'Phase 3: Technical' : 'Phase 3 : Technique'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'phase3' ? 'bg-white/20' : 'bg-green-600'}`}>
                  {phase3Files.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('phase4')}
                className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === 'phase4'
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <FileCheck className="w-5 h-5" />
                <span className="font-medium text-sm">
                  {language === 'en' ? 'Phase 4: Admin' : 'Phase 4 : Admin'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'phase4' ? 'bg-white/20' : 'bg-yellow-600'}`}>
                  {phase4Files.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('phase5')}
                className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === 'phase5'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium text-sm">
                  {language === 'en' ? 'Phase 5: Archive' : 'Phase 5 : Archive'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'phase5' ? 'bg-white/20' : 'bg-orange-600'}`}>
                  {phase5Files.length}
                </span>
              </button>
            </div>
          </div>

          <div className="animate-fadeIn">
            {activeTab === 'phase3' && renderPhase3Content()}
            {activeTab === 'phase4' && renderPhase4Content()}
            {activeTab === 'phase5' && renderPhase5Content()}
          </div>

          <div className="text-center mt-12 text-blue-100 text-sm">
            <p className="font-medium">GeoCasa Group - Bureau 2 : Études Techniques</p>
            <p>Yaoundé, Cameroun • +237 6XX XXX XXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bureau2TechnicalDashboard;
