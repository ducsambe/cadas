import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Star, 
  Users, 
  Award, 
  FileText, 
  Phone,
  Mail,
  MapPin,
  Eye,
  Calculator,
  Handshake,
  Building2,
  Scale,
  Map,
  FileCheck,
  Building,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
   ClipboardCheck,
  CheckCircle
} from 'lucide-react';
import { Language } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import AnimatedBackground from './AnimatedBackground';

interface FFIDepartmentDetailProps {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const FFIDepartmentDetail: React.FC<FFIDepartmentDetailProps> = ({
  onBack,
  language,
  setLanguage
}) => {
  const [activeSection, setActiveSection] = useState('offers');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
   // Available images from public folder
  const availableImages = [
    '/IMG-20250911-WA0001.jpg',
    '/IMG-20250911-WA0002.jpg',
    '/IMG-20250911-WA0003.jpg',
    '/IMG-20250911-WA0004.jpg',
    '/IMG-20250911-WA0005.jpg',
    '/IMG-20250911-WA0006.jpg'
  ];
  // Financing offers data
  const financingOffers = {
    fr: [

      {
        id: 'partenariat-developpement',
         icon: Building2,
        title: '🧠 Offre 1 : Partenariat de Développement Foncier ou Immobilier',
        description: 'Partenariat entre GeoCasa, investisseurs et propriétaires pour développer un terrain ou projet immobilier.',
        conditions: [
          '1. Dépôt de la demande & cadrage du projet',
          '2. Signature du partenariat & planification',
          '3. Études techniques & validation du site',
          '4. Mise en œuvre du projet',
          '5. Résultats & partage des bénéfices'
        ],
        target: 'Propriétaires, promoteurs en recherche de partenaires',
        duration: '12-36 mois',
        cost: 'Partage selon accord'
      },
      {
        id: 'assistance-technique',
         icon: FileText,
        title: '📄 Offre 2 : Assistance Technique & Juridique Personnalisée',
        description: 'Accompagnement complet : études, conseils, suivi administratif et juridique.',
        conditions: [
          '1. Études préalables & diagnostic personnalisé',
          '2. Études technico-juridiques préalables',
          '3. Structuration juridique & contractuelle',
          '4. Assistance opérationnelle & suivi administratif',
          '5. Clôture & transfert des livrables'
        ],
        target: 'Facilitateurs, promoteurs, copropriétaires, exploitants fonciers',
        duration: '1-6 mois',
        cost: '50,000 - 200,000 FCFA'
      },
      {
        id: 'accompagnement-complet',
        icon: ClipboardCheck,
        title: '🧾 Offre 3 : Accompagnement Complet sur Projet Clé-en-main',
        description: 'GeoCasa prend en charge tout le processus (études, financement, construction, vente).',
        conditions: [
          '1. Études préalables & faisabilité',
          '2. Structuration juridique & contractuelle',
          '3. Études technico-juridiques préalables',
          '4. Mise en œuvre opérationnelle & suivi administratif',
          '5. Livraison du projet & mise en valeur'
        ],
        target: 'Promoteurs, investisseurs passifs, héritiers à l\'étranger, collectivités',
        duration: '12-48 mois',
        cost: 'Selon projet'
      }
    ],
    en: [

      {
        id: 'development-partnership',
         icon: CreditCard,
        title: '🧠 Offer 1 : Land or Real Estate Development Partnership',
        description: '•	Partnership between GeoCasa, investors, and owners to develop land or a real estate project.',
        conditions: [
          '1. Application Submission & Project Definition',
          '2. Partnership Agreement & Planning',
          '3. Technical Studies & Site Validation',
          '4. Project Implementation',
          '5. Results & Profit Sharing'
        ],
        target: 'Owners, developers looking for partners',
        duration: '12-36 months',
        cost: 'Sharing according to agreement'
      },
      {
        id: 'technical-assistance',
         icon: CreditCard,
        title: '📄 Offer 2: Personalized Technical & Legal Assistance',
        description: 'Full support: studies, advice, administrative and legal follow-up.',
        conditions: [
          '1. Preliminary Studies & Personalized Assessment',
          '2. Preliminary Technical & Legal Studies',
          '3. Legal & Contractual Structuring',
          '4. Operational Assistance & Administrative Follow-up',
          '5. Closure & Delivery of Deliverables'
        ],
        target: 'Facilitators, developers, co-owners, land operators',
        duration: '1-6 months',
        cost: '50,000 - 200,000 FCFA'
      },
      {
        id: 'complete-support',
         icon: CreditCard,
        title: '🧾 Offer 3: Full Turnkey Project Support',
        description: 'GeoCasa manages the entire process (studies, financing, construction, sale).',
        conditions: [
          '1. Preliminary Studies & Feasibility',
          '2. Legal & Contractual Structuring',
          '3. Preliminary Technical & Legal Studies',
          '4. Operational Implementation & Administrative Follow-up',
          '5. Project Delivery & Enhancement'
        ],
        target: 'Developers, passive investors, heirs abroad, communities',
        duration: '12-48 months',
        cost: 'According to project'
      }
    ]
  };
  const offers = language === 'en' ? financingOffers.en : financingOffers.fr;
   const totalCategories = offers.length;

  // Navigation functions
  const goToNextCategory = () => {
    setCurrentCategoryIndex((prevIndex) => 
      prevIndex < totalCategories - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const goToPrevCategory = () => {
    setCurrentCategoryIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  // Go to specific category
  const goToCategory = (index: number) => {
    setCurrentCategoryIndex(index);
  };
  const renderOffers = () => { 
const currentOffer = offers[currentCategoryIndex];
    
    return (
    <div className="space-y-12">
        <h3 className="text-3xl font-bold text-white mb-8">
      <div className="flex items-center justify-between  mb-8">
      
          <button
            onClick={goToPrevCategory}
            disabled={currentCategoryIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
              currentCategoryIndex === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-all duration-300`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{language === 'en' ? 'Previous' : 'Précédent'}</span>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold text-white">
              {currentCategoryIndex + 1} / {totalCategories}
            </span>
          </div>

          <button
            onClick={goToNextCategory}
            disabled={currentCategoryIndex === totalCategories - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
              currentCategoryIndex === totalCategories - 1 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-all duration-300`}
          >
            <span>{language === 'en' ? 'Next' : 'Suivant'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          
      
      </div>
      <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
             {currentOffer.title}
          </span>
  </h3>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/30 shadow-xl">
        <div className="mb-6">
          <h4 className="text-2xl font-bold text-white mb-4">{currentOffer.title}</h4>
          <p className="text-blue-100 text-lg leading-relaxed mb-6">{currentOffer.description}</p>
        </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Conditions */}
              <div>
                <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  {language === 'en' ? 'Conditions:' : 'Conditions :'}
                </h5>
                <ul className="space-y-2">
                  {currentOffer.conditions.map((condition, idx) => (
                    <li key={idx} className="text-blue-100 flex items-start">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
{/* Category Navigation */}
        <div className="flex items-center justify-between mb-8">
        </div>
              {/* Target & Details */}
              <div className="space-y-4">
                <div>
                  <h5 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Users className="w-5 h-5 text-blue-400 mr-2" />
                    {language === 'en' ? 'Target:' : 'Cible :'}
                  </h5>
                  <p className="text-blue-100">{currentOffer.target}</p>
                </div>
                
                <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-300" />
                    <span className="text-white font-medium">{currentOffer.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-300" />
                    <span className="text-white font-medium">{currentOffer.cost}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      </div>

      {/* General Terms */}
      <div className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 backdrop-blur-2xl rounded-2xl p-8 border border-white/30 shadow-xl">
        <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
          📌 {language === 'en' ? 'General Terms' : 'Modalités générales'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Free basic file analysis'
                : 'Analyse gratuite du dossier de base'
              }
            </li>
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Mandatory agreement before any commitment'
                : 'Convention obligatoire avant tout engagement'
              }
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Technical or support fees according to offer type'
                : 'Paiement de frais techniques ou d\'accompagnement selon le type d\'offre'
              }
            </li>
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Transparency on expected returns, deadlines and responsibilities'
                : 'Transparence sur les retours attendus, échéances et responsabilités'
              }
            </li>
          </ul>
        </div>
      </div>
    </div>
    );
   };
   {/* Procedures Grid - 2 per line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(language === 'en' ? financingOffers.en : financingOffers.fr).map((offer) => (
            <div key={offer.id} className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 shadow-xl">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <offer.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {language === 'en' ? offer.title : offer.title}
                  </h4>
                  <p className="text-blue-100 mb-4 leading-relaxed">
                    {language === 'en' ? offer.description : offer.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-300" />
                      <span className="text-blue-200">{offer.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-300" />
                      <span className="text-green-200">{offer.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
{/* Category Progress */}
        <div className="flex justify-center mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            {(language === 'en' ? financingOffers.en : financingOffers.fr).map((_, index)  => (
              <button
                key={index}
                onClick={() => goToCategory(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index === currentCategoryIndex
                    ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg scale-110'
                    : 'bg-white/20 text-blue-100 hover:bg-white/30'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
    
 
  const sections = [
    // { id: 'overview', label: language === 'en' ? 'Overview' : 'Aperçu', icon: Eye },
    { id: 'offers', label: language === 'en' ? 'Financing Offers' : 'Offres de Financement', icon: CreditCard },
    // { id: 'contact', label: language === 'en' ? 'Contact' : 'Contact', icon: Phone }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Language Switcher - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </div>

      {/* Back Button - Top Left */}
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
          
          {/* Navigation Tabs */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-2 border border-white/30 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-orange-600 to-blue-600 text-white shadow-lg'
                        : 'text-blue-100 hover:bg-white/10'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="animate-fadeIn">
            {activeSection === 'offers' && renderOffers()}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-blue-100 text-sm space-y-3">
            <div className="flex items-center justify-center space-x-8">
              {/* <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Financial Innovation' : 'Innovation Financière'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Strategic Partnerships' : 'Partenariats Stratégiques'}
                </span>
              </div> */}
            </div>
            <p className="font-medium">GeoCasa Group - Département Financement Foncier & Immobilier</p>
            <p>Yaoundé, Cameroun • +237 674 20 92 39 / 652 19 91 92</p>
             <p>geocasagroup@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FFIDepartmentDetail;