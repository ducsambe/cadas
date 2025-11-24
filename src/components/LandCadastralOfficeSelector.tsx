import React from 'react';
import { ArrowLeft, Scale, Map, Building2 } from 'lucide-react';
import { Language } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import AnimatedBackground from './AnimatedBackground';

interface LandCadastralOfficeSelectorProps {
  onBack: () => void;
  onSelectOffice: (officeId: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LandCadastralOfficeSelector: React.FC<LandCadastralOfficeSelectorProps> = ({
  onBack,
  onSelectOffice,
  language,
  setLanguage
}) => {
  const offices = [
    {
      id: 'bureau-1-legal',
      nameFr: 'Bureau 1 : Études Juridiques et Conseil Fonciers',
      nameEn: 'Office 1: Legal Studies and Land Advisory',
      descriptionFr: 'Enregistrement, analyse préliminaire, planification et contractualisation des dossiers fonciers.',
      descriptionEn: 'Registration, preliminary analysis, planning and contracting of land files.',
      icon: Scale,
      color: 'from-blue-600 to-blue-700',
      phases: ['Phase 1', 'Phase 2']
    },
    {
      id: 'bureau-2-technical',
      nameFr: 'Bureau 2 : Études Techniques et Topographiques',
      nameEn: 'Office 2: Technical and Topographic Studies',
      descriptionFr: 'Exécution technique, suivi administratif et transmission des livrables.',
      descriptionEn: 'Technical execution, administrative monitoring and delivery of outputs.',
      icon: Map,
      color: 'from-green-600 to-green-700',
      phases: ['Phase 3', 'Phase 4', 'Phase 5']
    }
  ];

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

      <div className="relative z-10 min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-6xl mx-auto w-full">

          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {language === 'en' ? 'Land and Cadastral Department' : 'Département Foncier et Cadastral'}
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {language === 'en'
                ? 'Select an office to access your specific workflow and manage land files'
                : 'Sélectionnez un bureau pour accéder à votre flux de travail spécifique et gérer les dossiers fonciers'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office) => (
              <div
                key={office.id}
                onClick={() => onSelectOffice(office.id)}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl transform rotate-1 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${office.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <office.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {language === 'en' ? office.nameEn : office.nameFr}
                      </h3>
                    </div>
                  </div>

                  <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                    {language === 'en' ? office.descriptionEn : office.descriptionFr}
                  </p>

                  <div className="space-y-3">
                    <div className="text-sm text-blue-200 font-semibold">
                      {language === 'en' ? 'Managed Phases:' : 'Phases gérées :'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {office.phases.map((phase, index) => (
                        <div
                          key={index}
                          className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm font-medium"
                        >
                          {phase}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <button className={`w-full bg-gradient-to-r ${office.color} text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                      {language === 'en' ? 'Access Office' : 'Accéder au Bureau'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-blue-100 text-sm">
            <div className="flex items-center justify-center space-x-8 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Secure Workflow' : 'Flux de travail sécurisé'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Collaborative Process' : 'Processus collaboratif'}
                </span>
              </div>
            </div>
            <p className="font-medium">GeoCasa Group - Yaoundé, Cameroun</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandCadastralOfficeSelector;
