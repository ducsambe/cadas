import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard,
  Building, 
  Star, 
  Users, 
  Award, 
  FileText, 
  Calculator,
  Scale,
  Phone,
  Mail,
  MapPin,
  Eye,
  Home,
  Key,
  Shield,
  Megaphone,
  Handshake,
  ChevronLeft,
  ChevronRight,
   ClipboardCheck,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { Language } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import AnimatedBackground from './AnimatedBackground';

interface VGIDepartmentDetailProps {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const VGIDepartmentDetail: React.FC<VGIDepartmentDetailProps> = ({
  onBack,
  language,
  setLanguage
}) => {
  const [activeSection, setActiveSection] = useState('services');
const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
   // Available images from public folder
  // Sales and Management services data
  const salesServices = {
    fr: [
      {
        id: 'vente-acquisition',
        title: '🏡 Offre 1 : Vente de Biens Immobiliers',
        description: 'Gestion complète de la transaction (prospection, visites, négociation, contrats).',
        conditions: [
          '1. Prise de contact & ouverture du dossier',
          '2. Vérifications juridiques & techniques',
          '3. Mise en valeur & promotion',
          '4. Négociation & contractualisation',
          '5. Finalisation juridique & notariale',
          '6. Paiement & clôture'
        ],
        target: 'Acheteurs particuliers, investisseurs, propriétaires, promoteurs',
        icon: Home
      },
      {
        id: 'location-gestion',
        title: '🔑 Offre 2 : Acquisition de Biens Immobiliers',
        description: 'Achat de terrains, maisons ou immeubles via GeoCasa.',
        conditions: [
          '1. Expression du besoin & ouverture du dossier',
          '2. Recherche & proposition des biens',
          '3. Vérification juridique & technique du bien choisi',
          '4. Négociation & contractualisation',
          '5. Finalisation juridique & notariale',
          '6. Paiement & clôture'
        ],
        target: 'Propriétaires particuliers, promoteurs immobiliers, sociétés',
        icon: Key
      },
      {
        id: 'securisation-transactions',
        title: '📑 Offre 3 : Achat de Biens Immobiliers via la Plateforme',
        description: 'Recherche, sélection et acquisition de biens en ligne via notre plateforme.',
        conditions: [
          '1. Accès à la plateforme & sélection du bien',
          '2. Validation de l\'intérêt & assistance client',
          '3. Confirmation de conformité juridique & technique',
          '4. Contractualisation de la vente',
          '5. Finalisation notariale',
          '6. Paiement & clôture'
        ],
        target: 'Acheteurs, vendeurs, promoteurs, partenaires',
        icon: Shield
      },
      {
        id: 'promotion-marketing',
        title: '📢  Offre 4 : Promotion & Marketing Immobilier',
        description: 'GeoCasa met en valeur et promeut les biens à vendre ou à louer grâce à des stratégies modernes et adaptées.',
        conditions: [
          '1. Cadrage du besoin client',
          '2. Vérification et sécurisation du bien',
          '3. Élaboration et mise en œuvre de la stratégie marketing',
          '4. Suivi des prospects et retours clients',
          '5. Contractualisation & finalisation',
          '6. Paiement & clôture de la prestation'
        ],
        target: 'Propriétaires, promoteurs, investisseurs, agences partenaires',
        icon: Megaphone
      }

    ],
    en: [
      {
        id: 'sales-acquisition',
        title: '🏡 Offer 1: Real Estate Sales',
        description: 'Complete transaction management (prospecting, visits, negotiation, contracts).',
        conditions: [
          '1. Contact & File Opening',
          '2. Legal & Technical Checks',
          '3. Presentation & Promotion',
          '4. Negotiation & Contracting',
          '5. Legal & Notarial Finalization',
          '6. Payment & Closure'
        ],
        target: 'Individual buyers, investors, owners, developers',
        icon: Home
      },
      {
        id: 'rental-management',
        title: '🔑 Offer 2: Real Estate Acquisition',
        description: 'Purchase of land, houses, or buildings through GeoCasa.',
        conditions: [
          '1. Expression of Need & File Opening',
          '2. Property Search & Proposals',
          '3. Legal & Technical Verification of the Chosen Property',
          '4. Negotiation & Contractualization',
          '5. Legal & Notarial Finalization',
          '6. Payment & Closure'
        ],
        target: 'Individual owners, real estate developers, companies',
        icon: Key
      },
      {
        id: 'transaction-security',
        title: '📑 Offer 3: Property Purchase via the Platform',
        description: 'Search, selection, and acquisition of properties online through our platform.',
        conditions: [
          '1. Platform Access & Property Selection',
          '2. Interest Validation and Customer Support',
          '3. Legal & Technical Compliance Confirmation',
          '4. Sale Contractualization',
          '5. Notarial Finalization',
          '6. Payment & Closure'
        ],
        target: 'Buyers, sellers, developers, partners',
        icon: Shield
      },
      {
        id: 'promotion-marketing',
        title: '📢 Offer 4: Real Estate Promotion & Marketing',
        description: 'Enhancement and promotion of your properties (campaigns, photos, videos, communication).',
        conditions: [
          '1. Defining the Client’s Needs',
          '2. Property Verification and Security',
          '3. Development and Implementation of the Marketing Strategy',
          '4. Suivi des prospects et retours clients',
          '5. Contracting & Finalization',
          '6 Payment & Service Closure'
        ],
        target: 'Owners, developers, investors, partner agencies',
        icon: Megaphone
      }

    ]
  };

  // Available images from public folder
  const availableImages = [
    '/IMG-20250911-WA0001.jpg',
    '/IMG-20250911-WA0002.jpg',
    '/IMG-20250911-WA0003.jpg',
    '/IMG-20250911-WA0004.jpg',
    '/IMG-20250911-WA0005.jpg'
  ];
const services = language === 'en' ? salesServices.en : salesServices.fr;
   const totalCategories = services.length;

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
  
  const renderServices = () => { 
  const currentService = services[currentCategoryIndex];
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
             {currentService.title}
          </span>
  </h3>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/30 shadow-xl">
        <div className="mb-6">
          <h4 className="text-2xl font-bold text-white mb-4">{currentService.title}</h4>
          <p className="text-blue-100 text-lg leading-relaxed mb-6">{currentService.description}</p>
        </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Conditions */}
              <div>
                <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  {language === 'en' ? 'Conditions:' : 'Conditions :'}
                </h5>
                <ul className="space-y-2">
                  {currentService.conditions.map((condition, idx) => (
                    <li key={idx} className="text-blue-100 flex items-start">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target */}
              <div className="space-y-4">
                <div>
                  <h5 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Users className="w-5 h-5 text-blue-400 mr-2" />
                    {language === 'en' ? 'Target:' : 'Cible :'}
                  </h5>
                  <p className="text-blue-100">{currentService.target}</p>
                </div>
                
                {/* <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-300" />
                      <span className="text-white font-medium">{currentService.duration}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-medium">{currentService.cost}
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
      </div>

      {/* General Terms */}
      <div className="bg-gradient-to-r from-gray-500/20 to-blue-500/20 backdrop-blur-2xl rounded-2xl p-8 border border-white/30 shadow-xl">
        <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
          📌 {language === 'en' ? 'General Terms' : 'Modalités générales'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Free basic client/owner file analysis'
                : 'Analyse gratuite du dossier de base du client/propriétaire'
              }
            </li>
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Mandatory agreement (mandate, reservation contract or lease) before any operation'
                : 'Convention obligatoire (mandat, contrat de réservation ou bail) avant toute opération'
              }
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Technical or administrative fees applicable according to service type'
                : 'Frais techniques ou administratifs applicables selon le type de service'
              }
            </li>
            <li className="text-blue-100 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              {language === 'en' 
                ? 'Transparency and regular reporting to client or partner'
                : 'Transparence et reporting régulier auprès du client ou du partenaire'
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
          {(language === 'en' ? salesServices.en : salesServices.fr).map((offer) => (
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
                      {/* <span className="text-blue-200">{offer.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-300" />
                      <span className="text-green-200">{offer.cost}</span> */}
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
            {(language === 'en' ? salesServices.en : salesServices.fr).map((_, index)  => (
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
    { id: 'services', label: language === 'en' ? 'Our Services' : 'Nos Services', icon: Building }
    // { id: 'overview', label: language === 'en' ? 'Overview' : 'Aperçu', icon: Eye },
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
                        ? 'bg-gradient-to-r from-gray-600 to-blue-600 text-white shadow-lg'
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
            {activeSection === 'services' && renderServices()}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-blue-100 text-sm space-y-3">
            <div className="flex items-center justify-center space-x-8">
              {/* <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Professional Marketing' : 'Marketing Professionnel'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Secure Management' : 'Gestion Sécurisée'}
                </span>
              </div> */}
            </div>
            <p className="font-medium">GeoCasa Group - Département Vente & Gestion Immobilière</p>
            <p>Yaoundé, Cameroun • +237 674 20 92 39 / 652 19 91 92</p>
             <p>geocasagroup@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VGIDepartmentDetail;