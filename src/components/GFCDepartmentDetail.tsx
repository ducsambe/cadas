import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  FileText, 
  MapPin, 
  Calculator, 
  Building2, 
  Scale, 
  Map, 
  FileCheck, 
  Eye,
  Phone,
  Mail,
  Clock,
  Euro,
  User,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import AnimatedBackground from './AnimatedBackground';

interface GFCDepartmentDetailProps {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const GFCDepartmentDetail: React.FC<GFCDepartmentDetailProps> = ({
  onBack,
  language,
  setLanguage
}) => {
  const [activeSection, setActiveSection] = useState('procedures');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Available images from public folder
  const availableImages = [
    '/IMG-20251017-WA0003.jpg',
    '/IMG-20251017-WA0001.jpg',
    '/IMG-20251017-WA0002.jpg',
    '/IMG-20251017-WA0004.jpg',
    '/IMG-20250911-WA0005.jpg',
    '/IMG-20250911-WA0006.jpg'
  ];

  // Land Management Procedures Data
  const landProcedures = [
    {
      id: 'foncier',
      titleFr: 'I. Procédures Foncières',
      titleEn: 'I. Land Procedures',
      descriptionFr: 'Les procédures foncières sont essentielles pour l\'enregistrement des droits de propriété, la sécurisation des terres et la mise en place de contrats officiels entre les parties prenantes. Ces procédures permettent de garantir un cadre juridique et administratif sécurisé pour tous les acteurs du secteur foncier.',
      descriptionEn: 'Land procedures are essential for registering property rights, securing land and establishing official contracts between stakeholders. These procedures ensure a secure legal and administrative framework for all actors in the land sector.',
      image: availableImages[0],
      procedures: [
        {
          id: 'immatriculation',
          titleFr: 'Immatriculation Directe',
          titleEn: 'Direct Registration',
          descriptionFr: 'L\'immatriculation directe consiste à enregistrer une parcelle ou un terrain en tant que bien foncier officiel dans les registres cadastraux. Cette procédure permet au propriétaire d\'obtenir un titre foncier officiel, qui devient la preuve légale et incontestable de son droit de propriété sur la parcelle. Ce processus est crucial, car il permet de protéger le propriétaire contre les contestations et de garantir la légalité des transactions futures concernant le terrain. L\'immatriculation directe est souvent la première étape pour tout propriétaire souhaitant sécuriser son bien foncier dans le système national du cadastre.',
          descriptionEn: 'Direct registration involves recording a plot or land as an official real estate asset in cadastral registers. This procedure allows the owner to obtain an official land title, which becomes legal and indisputable proof of their property rights on the plot.',
          duration: '3-6 mois',
          cost: 'Varie selon le type de terrain',
          icon: FileText
        },
        {
          id: 'concession-provisoire',
          titleFr: 'Concession Provisoire',
          titleEn: 'Provisional Concession',
          descriptionFr: 'La concession provisoire est une attribution temporaire d\'un droit d\'usage sur une parcelle de terrain avant que cette dernière ne soit régularisée de manière définitive. Cela signifie qu\'un particulier ou une entreprise peut occuper et exploiter un terrain sous des conditions spécifiées, bien que cette concession ne soit pas encore définitive. La concession provisoire permet d\'occuper légalement le terrain pendant une période déterminée, souvent en attendant la finalisation de la procédure d\'immatriculation ou d\'une autre régularisation. Elle est utilisée principalement pour les terres agricoles ou les projets immobiliers en cours de développement.',
          descriptionEn: 'Provisional concession is a temporary allocation of usage rights on a plot of land before it is definitively regularized. It allows legal occupation of the land for a determined period.',
          duration: '1-3 mois',
          cost: 'Varie selon le type de terrain',
          icon: Clock
        },
        {
          id: 'concession-definitive',
          titleFr: 'Concession Définitive',
          titleEn: 'Definitive Concession',
          descriptionFr: 'La concession définitive constitue l\'attribution permanente d\'un droit foncier sur une parcelle. Contrairement à la concession provisoire, elle est validée par les autorités compétentes, généralement après avoir satisfait à toutes les démarches administratives et légales. Une fois accordée, la concession définitive confère au bénéficiaire un droit de propriété durable, équivalant au droit de posséder, d\'utiliser ou de transférer la parcelle. Cette procédure est la dernière étape dans l\'attribution des droits fonciers, offrant une sécurité juridique aux bénéficiaires.',
          descriptionEn: 'Definitive concession constitutes the permanent allocation of land rights on a plot. Once granted, it confers on the beneficiary a lasting property right, equivalent to the right to possess, use or transfer the plot.',
          duration: '6-12 mois',
          cost: 'Varie selon le type de terrain',
          icon: CheckCircle
        },
        {
          id: 'gre-a-gre',
          titleFr: 'Gré à Gré',
          titleEn: 'Mutual Agreement',
          descriptionFr: 'Le gré à gré fait référence à une transaction foncière entre deux parties, que ce soit entre des entités privées ou publiques. Il s\'agit d\'un contrat sous forme de transaction amiable pour des terrains spécifiques, souvent sans passer par les processus administratifs complexes d\'enregistrement public. Ce type de procédure est souvent utilisé pour des échanges de terrain entre des particuliers ou des entités ayant déjà une certaine entente préalable. Bien que la transaction soit formalisée par un contrat, il est crucial de veiller à la conformité de la transaction avec la législation foncière en vigueur.',
          descriptionEn: 'Mutual agreement refers to a land transaction between two parties, whether between private or public entities. It is a contract in the form of an amicable transaction for specific lands.',
          duration: '2-4 mois',
          cost: 'Varie selon le type de terrain',
          icon: Building2
        }
      ]
    },
    {
      id: 'cadastral',
      titleFr: 'II. Procédures Cadastrales',
      titleEn: 'II. Cadastral Procedures',
      descriptionFr: 'Les procédures cadastrales sont liées à la division, au transfert ou à la reconfiguration de biens fonciers dans le cadastre. Elles permettent de garantir une gestion précise et officielle des terres, facilitant ainsi leur utilisation ou leur transmission.',
      descriptionEn: 'Cadastral procedures are related to the division, transfer or reconfiguration of real estate in the cadastre.',
      image: availableImages[1],
      procedures: [
        {
          id: 'morcellement-notarie',
          titleFr: 'Morcellement Notarié',
          titleEn: 'Notarized Subdivision',
          descriptionFr: 'Le morcellement notarié consiste à diviser une grande parcelle en plusieurs lots plus petits. Ce processus, qui doit être validé par un notaire, assure la conformité juridique de la division et permet de garantir que chaque lot respecte les normes cadastrales et urbaines. Une fois le morcellement effectué, chaque lot devient un bien foncier distinct et peut être vendu ou utilisé de manière indépendante. Ce service is souvent nécessaire lors de projets de développement immobilier ou de vente de parcelles de grande taille.',
          descriptionEn: 'Notarized subdivision involves dividing a large plot into several smaller lots. This process, which must be validated by a notary, ensures legal compliance of the division.',
          duration: '4-8 mois',
          cost: 'Varie selon le type de terrain',
          icon: Map
        },
        {
          id: 'mutation-notariee',
          titleFr: 'Mutation Notariée',
          titleEn: 'Notarized Transfer',
          descriptionFr: 'La mutation notariée est le transfert officiel de la propriété d\'une parcelle foncière d\'une personne à une autre. Cette procédure implique un acte notarié qui enregistre juridiquement le changement de propriétaire. La mutation notariée est souvent utilisée lors des ventes de terrains, des donations ou des héritages, et elle garantit que le transfert respecte la législation en vigueur. Elle est essentielle pour la validation juridique de la transaction et pour l\'enregistrement du changement de propriétaire dans les registres fonciers.',
          descriptionEn: 'Notarized transfer is the official transfer of ownership of a land plot from one person to another. This procedure involves a notarized act that legally records the change of owner.',
          duration: '2-3 mois',
          cost: 'Varie selon le type de terrain',
          icon: FileCheck
        },
        {
          id: 'lotissement',
          titleFr: 'Lotissement',
          titleEn: 'Land Development',
          descriptionFr: 'Le lotissement fait référence à la division d\'une grande parcelle en plusieurs unités plus petites, souvent destinées à la vente ou au développement immobilier. Ce processus permet de rendre un terrain plus accessible à une plus grande variété de projets, en subdivisant le bien en lots distincts et viabilisés. La procédure de lotissement doit suivre des normes strictes de planification urbaine, et elle nécessite l\'approbation des autorités locales avant que les lots ne soient mis en vente. Cela garantit que les lots créés sont conformes aux règles de développement et d\'urbanisme.',
          descriptionEn: 'Land development refers to the division of a large plot into several smaller units, often intended for sale or real estate development.',
          duration: '6-12 mois',
          cost: 'Varie selon le type de terrain',
          icon: Building2
        },
        {
          id: 'decoupage-partage',
          titleFr: 'Découpage et Partage',
          titleEn: 'Division and Sharing',
          descriptionFr: 'Le découpage et partage est une procédure qui intervient lorsque plusieurs copropriétaires ou héritiers doivent diviser une parcelle commune. Cela se produit généralement après un décès ou lors d\'une répartition de biens entre co-indivisaires. Le partage foncier permet à chaque co-indivisaire d\'obtenir un lot distinct, tout en clarifiant les droits de propriété de chacun. Ce processus peut être complexe, car il nécessite un accord entre les parties et souvent l\'intervention d\'un notaire ou d\'un tribunal pour valider la division.',
          descriptionEn: 'Division and sharing is a procedure that occurs when several co-owners or heirs must divide a common plot.',
          duration: '3-6 mois',
          cost: 'Varie selon le type de terrain',
          icon: Users
        }
      ]
    },
    {
      id: 'administrative',
      titleFr: 'III. Procédures Administratives',
      titleEn: 'III. Administrative Procedures',
      descriptionFr: 'Les procédures administratives sont des démarches nécessaires pour rectifier ou gérer des titres fonciers, notamment en cas de litige, de perte ou de besoin de modification.',
      descriptionEn: 'Administrative procedures are necessary steps to rectify or manage land titles, particularly in case of disputes, loss or need for modification.',
      image: availableImages[2],
      procedures: [
        {
          id: 'duplication-titre',
          titleFr: 'Duplication de Titre Foncier',
          titleEn: 'Land Title Duplication',
          descriptionFr: 'Un duplicatum de titre foncier est demandé lorsque le document original est perdu ou détérioré. Cette procédure permet de reproduire un titre foncier officiel afin de restaurer les droits de propriété du titulaire. Le duplicata est équivalent à l\'original et permet de continuer à prouver le droit de propriété, notamment en cas de vente, de litige ou de transaction.',
          descriptionEn: 'A land title duplicate is requested when the original document is lost or damaged. This procedure allows reproduction of an official land title.',
          duration: '1-2 mois',
          cost: 'Varie selon le type de terrain',
          icon: FileText
        },
        {
          id: 'retrait-indivision',
          titleFr: 'Retrait d\'indivision',
          titleEn: 'Withdrawal from Joint Ownership',
          descriptionFr: 'Le retrait d\'indivision est le processus permettant de diviser les biens détenus en indivision entre les co-indivisaires afin que chacun puisse en obtenir la pleine propriété. Cette procédure est particulièrement courante dans le cadre de successions ou d\'accords familiaux. Elle permet de mettre fin à l\'indivision, donnant ainsi à chaque co-indivisaire un droit exclusif sur une portion du bien. Le retrait d\'indivision peut être amiable ou judiciaire, en fonction de l\'accord entre les parties ou des litiges.',
          descriptionEn: 'Withdrawal from joint ownership is the process allowing division of jointly held assets among co-owners so each can obtain full ownership.',
          duration: '4-8 mois',
          cost: 'Varie selon le type de terrain',
          icon: Scale
        },
        {
          id: 'morcellement-judiciaire',
          titleFr: 'Morcellement judiciaire',
          titleEn: 'Judicial Subdivision',
          descriptionFr: 'Le morcellement judiciaire est un morcellement de terrain ordonné par un tribunal pour résoudre un conflit entre copropriétaires ou héritiers. Cette procédure est souvent utilisée lorsqu\'il y a désaccord entre les parties sur la division d\'un bien commun, comme un héritage ou un bien indivis. Le tribunal statue sur la manière dont le bien doit être partagé et procède à la division en fonction des règles légales et des droits de chaque partie.',
          descriptionEn: 'Judicial subdivision is a land subdivision ordered by a court to resolve a conflict between co-owners or heirs.',
          duration: '6-18 mois',
          cost: 'Varie selon le type de terrain',
          icon: Building
        },
        {
          id: 'mutation-judiciaire',
          titleFr: 'Mutation judiciaire',
          titleEn: 'Judicial Transfer',
          descriptionFr: 'La mutation judiciaire est un transfert de propriété validé par un tribunal, souvent dans le cadre d\'un conflit, d\'une succession ou d\'un litige foncier. Contrairement à la mutation notariée, cette procédure passe par une décision judiciaire qui offcialise le changement de propriétaire. Elle intervient principalement lorsque les parties en conflit ne parviennent pas à s\'entendre et qu\'un juge doit intervenir pour trancher le litige.',
          descriptionEn: 'Judicial transfer is a property transfer validated by a court, often in the context of a conflict, succession or land dispute.',
          duration: '8-24 mois',
          cost: 'Varie selon le type de terrain',
          icon: Scale
        },
        {
          id: 'rectification-erreur',
          titleFr: 'Rectification d\'erreur Matérielle',
          titleEn: 'Material Error Correction',
          descriptionFr: 'La rectification d\'erreur matérielle est une procédure administrative visant à corriger des erreurs dans les documents cadastraux ou fonciers. Ces erreurs peuvent concerner des informations incorrectes ou mal transcrites dans un titre foncier, un plan cadastral ou un acte notarié. La rectification permet de garantir l\'exactitude des documents fonciers, ce qui est crucial pour la validité des droits de propriété et pour éviter d\'éventuels conflits.',
          descriptionEn: 'Material error correction is an administrative procedure aimed at correcting errors in cadastral or land documents.',
          duration: '2-4 mois',
          cost: 'Varie selon le type de terrain',
          icon: FileCheck
        },
        {
          id: 'mutation-deces',
          titleFr: 'Mutation par Décès',
          titleEn: 'Transfer by Death',
          descriptionFr: 'La mutation par décès est un processus qui permet de transférer la propriété d\'un bien foncier suite au décès de son propriétaire. Cela se fait en vertu des règles successorales et nécessite l\'intervention des autorités compétentes pour établir un acte de mutation, souvent après un jugement de succession ou un accord entre héritiers. Ce processus est essentiel pour garantir la continuité des droits fonciers au sein de la famille ou des héritiers.',
          descriptionEn: 'Transfer by death is a process that allows transferring ownership of real estate following the death of its owner.',
          duration: '6-12 mois',
          cost: 'Varie selon le type de terrain',
          icon: User
        }
      ]
    },
    {
      id: 'technical',
      titleFr: 'IV. Procédures Techniques',
      titleEn: 'IV. Technical Procedures',
      descriptionFr: 'Les procédures techniques visent à garantir la précision et la validité des documents fonciers à travers des études de terrain, des relevés et des expertises spécialisées.',
      descriptionEn: 'Technical procedures aim to guarantee the precision and validity of land documents through field studies, surveys and specialized expertise.',
      image: availableImages[3],
      procedures: [
        {
          id: 'expertise-fonciere',
          titleFr: 'Expertise Foncière et Cadastrale',
          titleEn: 'Land and Cadastral Expertise',
          descriptionFr: 'Une expertise foncière et cadastrale consiste à réaliser une évaluation technique approfondie d\'une propriété foncière pour en déterminer la valeur, les caractéristiques géographiques et la conformité avec les réglementations en vigueur. Cette expertise est souvent demandée dans le cadre de litiges fonciers, d\'évaluations immobilières ou de démarches de régularisation foncière.',
          descriptionEn: 'Land and cadastral expertise involves conducting a thorough technical evaluation of a land property to determine its value, geographical characteristics and compliance.',
          duration: '2-4 semaines',
          cost: 'Varie selon le type de terrain',
          icon: Calculator
        },
        {
          id: 'etat-lieux',
          titleFr: 'État des Lieux',
          titleEn: 'Site Survey',
          descriptionFr: 'L\'état des lieux est une inspection détaillée d\'un bien foncier afin de vérifier son état physique, ses caractéristiques et les éventuelles anomalies. Cela permet de faire une évaluation complète du terrain ou de la propriété avant de procéder à une vente, une transaction ou une procédure de régularisation. L\'état des lieux constitue un document essentiel pour les transactions foncières.',
          descriptionEn: 'Site survey is a detailed inspection of real estate to verify its physical condition, characteristics and any anomalies.',
          duration: '1-2 semaines',
          cost: 'Varie selon le type de terrain',
          icon: Eye
        },
        {
          id: 'plan-masse',
          titleFr: 'Plan de Masse et de Situation',
          titleEn: 'Site and Location Plan',
          descriptionFr: 'Le plan de masse et de situation est un document graphique qui représente la configuration géographique d\'un terrain ou d\'un bien foncier dans son environnement immédiat. Ce plan permet de visualise l\'organisation du terrain, la répartition des parcelles, les accès et les infrastructures. Il est souvent utilisé dans le cadre de projets de lotissement, de développement immobilier ou d\'aménagement urbain.',
          descriptionEn: 'Site and location plan is a graphic document representing the geographical configuration of land or real estate in its immediate environment.',
          duration: '2-3 semaines',
          cost: 'Varie selon le type de terrain',
          icon: Map
        },
        {
          id: 'bornage',
          titleFr: 'Bornage',
          titleEn: 'Boundary Marking',
          descriptionFr: 'Le bornage consiste à délimiter de manière précise les limites d\'une propriété foncière à l\'aide de bornes, de repères ou de mesures géométriques. Cette procédure est souvent réalisée en cas de conflit de voisinage ou de contestation des limites d\'un terrain. Le bornage garantit la clarté des délimitations, évitant ainsi les disputes concernant les limites de propriété.',
          descriptionEn: 'Boundary marking involves precisely delimiting the boundaries of a land property using markers, reference points or geometric measurements.',
          duration: '1-3 semaines',
          cost: 'Varie selon le type de terrain',
          icon: MapPin
        },
        {
          id: 'plans-cadastraux',
          titleFr: 'Réalisation de Plans Cadastraux',
          titleEn: 'Cadastral Plan Creation',
          descriptionFr: 'La réalisation de plans cadastraux implique la création de plans détaillés et géolocalisés des terrains, souvent réalisés à l\'aide de technologies modernes comme le GPS ou les levés topographiques. Ces plans servent à document officiellement la disposition et les dimensions des propriétés foncières. Ils sont nécessaires pour l\'immatriculation, la mutation ou le lotissement des terrains.',
          descriptionEn: 'Cadastral plan creation involves creating detailed and geolocated land plans, often made using modern technologies like GPS.',
          duration: '3-6 semaines',
          cost: 'Varie selon le type de terrain',
          icon: Map
        }
      ]
    }
  ];

  const totalCategories = landProcedures.length;

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

  const renderProcedures = () => {
    const currentCategory = landProcedures[currentCategoryIndex];
    
    return (
      <div className="space-y-8">
        {/* Category Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              {language === 'en' ? currentCategory.titleEn : currentCategory.titleFr}
            </span>
          </h2>
          <p className="text-blue-100 text-lg max-w-4xl mx-auto mb-4 leading-relaxed text-justify indent-12">
            {language === 'en' ? currentCategory.descriptionEn : currentCategory.descriptionFr}
          </p>
        </div>

        {/* Category Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl h-64 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={currentCategory.image}
              alt={language === 'en' ? currentCategory.titleEn : currentCategory.titleFr}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white text-xl font-bold">
                {language === 'en' ? currentCategory.titleEn : currentCategory.titleFr}
              </h3>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Procedures Grid - 2 per line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentCategory.procedures.map((procedure, index) => (
            <div key={procedure.id} className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/30 shadow-xl">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <procedure.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {language === 'en' ? procedure.titleEn : procedure.titleFr}
                  </h4>
                  <p className="text-blue-100 mb-4 leading-relaxed text-justify indent-8">
                    {language === 'en' ? procedure.descriptionEn : procedure.descriptionFr}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-300" />
                      <span className="text-blue-200">{procedure.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Euro className="w-4 h-4 text-green-300" />
                      <span className="text-green-200">{procedure.cost}</span>
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
            {landProcedures.map((_, index) => (
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
      </div>
    );
  };

  const sections = [
    { id: 'procedures', label: language === 'en' ? 'Procedures' : 'Procédures', icon: FileText }
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
        <div className="max-w-6xl mx-auto pt-24">
          
          {/* Navigation Tabs */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-2 border border-white/30 shadow-xl">
              <div className="flex flex-wrap gap-2 justify-center">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-lg'
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
            {activeSection === 'procedures' && renderProcedures()}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-blue-100 text-sm space-y-3">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Professional Excellence' : 'Excellence Professionnelle'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {language === 'en' ? 'Secure Procedures' : 'Procédures Sécurisées'}
                </span>
              </div>
            </div>
            <p className="font-medium">GeoCasa Group - Département Gestion Foncière et Cadastrale</p>
            <p>Yaoundé, Cameroun • +237 6XX XXX XXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GFCDepartmentDetail;