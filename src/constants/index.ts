import { Department, CompanyInfo, Bureau } from '../types';
import { Division } from '../types';

export const BUREAUS: { [key: string]: Bureau[] } = {
  'land-cadastral': [
    {
      id: 'legal-studies',
      name: 'Bureau Études Juridiques et Conseil Fonciers',
      nameEn: 'Legal Studies and Land Advisory Office',
      nameFr: 'Bureau Études Juridiques et Conseil Fonciers',
      color: 'bg-blue-600',
      icon: 'Scale'
    },
    {
      id: 'technical-studies',
      name: 'Bureau Études Techniques et Topographiques',
      nameEn: 'Technical and Topographic Studies Office',
      nameFr: 'Bureau Études Techniques et Topographiques',
      color: 'bg-blue-500',
      icon: 'Map'
    },
    {
      id: 'administrative-procedures',
      name: 'Bureau Procédures à Suivre Administratives',
      nameEn: 'Administrative Procedures Office',
      nameFr: 'Bureau Procédures à Suivre Administratives',
      color: 'bg-blue-700',
      icon: 'FileCheck'
    }
  ],
  'financing': [
    {
      id: 'financial-engineering',
      name: 'Bureau Montage Financier et Ingénierie de Projet',
      nameEn: 'Financial Engineering and Project Management Office',
      nameFr: 'Bureau Montage Financier et Ingénierie de Projet',
      color: 'bg-orange-600',
      icon: 'Calculator'
    },
    {
      id: 'partnerships',
      name: 'Bureau Partenariat Apport et Suivi Investisseur',
      nameEn: 'Partnership and Investor Relations Office',
      nameFr: 'Bureau Partenariat Apport et Suivi Investisseur',
      color: 'bg-orange-500',
      icon: 'Handshake'
    },
    {
      id: 'coordination',
      name: 'Bureau Coordination Technique et Administrative',
      nameEn: 'Technical and Administrative Coordination Office',
      nameFr: 'Bureau Coordination Technique et Administrative',
      color: 'bg-orange-700',
      icon: 'Network'
    }
  ],
  'sales-management': [
    {
      id: 'legal-regulation',
      name: 'Bureau Suivi Juridique et Régulation Foncier',
      nameEn: 'Legal Monitoring and Land Regulation Office',
      nameFr: 'Bureau Suivi Juridique et Régulation Foncier',
      color: 'bg-gray-600',
      icon: 'Shield'
    },
    {
      id: 'commercialization',
      name: 'Bureau Commercialisation et Réseau de Vente',
      nameEn: 'Marketing and Sales Network Office',
      nameFr: 'Bureau Commercialisation et Réseau de Vente',
      color: 'bg-gray-500',
      icon: 'TrendingUp'
    },
    {
      id: 'property-management',
      name: 'Bureau Gestion Immobilier et Locative',
      nameEn: 'Property and Rental Management Office',
      nameFr: 'Bureau Gestion Immobilier et Locative',
      color: 'bg-gray-700',
      icon: 'Home'
    }
  ]
};

export const DEPARTMENTS: Department[] = [
  {
    id: 'land-cadastral',
    nameEn: 'Land and Cadastral Management (GFC)',
    nameFr: 'Gestion Foncier et Cadastrale (GFC)',
    color: 'bg-blue-700',
    icon: 'MapPin',
    descriptionFr: 'Expertise complète en gestion foncière et cadastrale avec des services juridiques et techniques spécialisés pour tous vos besoins immobiliers.',
    descriptionEn: 'Complete expertise in land and cadastral management with specialized legal and technical services for all your real estate needs.',
    services: [
      'Études juridiques et conseil fonciers',
      'Études techniques et topographiques', 
      'Procédures administratives',
      'Régularisation foncière',
      'Bornage et délimitation'
    ],
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'financing',
    nameEn: 'Real Estate and Land Financing (FFI)',
    nameFr: 'Financement Foncier et Immobilier (FFI)',
    color: 'bg-orange-500',
    icon: 'CreditCard',
    descriptionFr: 'Solutions financières innovantes et partenariats stratégiques pour concrétiser vos projets immobiliers et fonciers.',
    descriptionEn: 'Innovative financial solutions and strategic partnerships to realize your real estate and land projects.',
    services: [
      'Montage financier et ingénierie de projet',
      'Partenariat et suivi investisseur',
      'Coordination technique et administrative',
      'Études de faisabilité',
      'Recherche de financement'
    ],
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'sales-management',
    nameEn: 'Real Estate Sales and Management (VGI)',
    nameFr: 'Vente et Gestion Immobilière (VGI)',
    color: 'bg-gray-600',
    icon: 'Building',
    descriptionFr: 'Commercialisation professionnelle et gestion complète de votre patrimoine immobilier avec un suivi juridique rigoureux.',
    descriptionEn: 'Professional marketing and complete management of your real estate portfolio with rigorous legal monitoring.',
    services: [
      'Suivi juridique et régulation foncier',
      'Commercialisation et réseau de vente',
      'Gestion immobilier et locative',
      'Évaluation immobilière',
      'Marketing immobilier'
    ],
    image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'real-estate-construction',
    nameEn: 'Real Estate Projects and Construction (PIC)',
    nameFr: 'Projets Immobilier et Construction (PIC)',
    color: 'bg-white',
    icon: 'Home',
    descriptionFr: 'Conception et réalisation de projets immobiliers innovants avec une expertise technique et managériale complète.',
    descriptionEn: 'Design and implementation of innovative real estate projects with complete technical and managerial expertise.',
    services: [
      'Conception architecturale',
      'Gestion de projet construction',
      'Suivi des travaux',
      'Études techniques bâtiment',
      'Coordination chantier'
    ],
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'woodworking',
    nameEn: 'Woodworking and Wood Manufacturing (MFB)',
    nameFr: 'Menuiserie et Fabrication Bois (MFB)',
    color: 'bg-blue-700',
    icon: 'Package',
    descriptionFr: 'Fabrication sur mesure et transformation du bois avec des techniques artisanales et industrielles de qualité.',
    descriptionEn: 'Custom manufacturing and wood processing with quality artisanal and industrial techniques.',
    services: [
      'Menuiserie sur mesure',
      'Fabrication meubles',
      'Transformation bois',
      'Installation et pose',
      'Conception design bois'
    ],
    image: 'https://images.pexels.com/photos/37347/wood-craft-industry-tools.jpg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'agro-environment',
    nameEn: 'Agro-Pastoral and Environment (APE)',
    nameFr: 'Agro-Pastoral et Environnement (APE)',
    color: 'bg-orange-500',
    icon: 'TreePine',
    descriptionFr: 'Développement durable des activités agro-pastorales avec une approche respectueuse de l\'environnement.',
    descriptionEn: 'Sustainable development of agro-pastoral activities with an environmentally friendly approach.',
    services: [
      'Conseil agro-pastoral',
      'Gestion environnementale',
      'Développement rural',
      'Études d\'impact',
      'Formation techniques agricoles'
    ],
    image: 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'tech-solutions',
    nameEn: 'Technological Solutions and Digital (STN)',
    nameFr: 'Solutions Technologiques et Numérique (STN)',
    color: 'bg-gray-600',
    icon: 'Cpu',
    descriptionFr: 'Innovation digitale et solutions technologiques pour optimiser les processus et développer votre entreprise.',
    descriptionEn: 'Digital innovation and technological solutions to optimize processes and grow your business.',
    services: [
      'Développement logiciel',
      'Solutions digitales',
      'Transformation numérique',
      'Support technique',
      'Formation technologique'
    ],
    image: 'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'commerce-import',
    nameEn: 'General Trade & Import-Export  (CIE)',
    nameFr: 'Commerce Général & Import-Export (CIE)',
    color: 'bg-white',
    icon: 'ShoppingCart',
    descriptionFr: 'Services complets de commerce international et distribution avec un réseau logistique optimisé.',
    descriptionEn: 'Complete international trade and distribution services with an optimized logistics network.',
    services: [
      'Commerce international',
      'Import-Export',
      'Logistique douanière',
      'Distribution produits',
      'Négociation commerciale'
    ],
    image: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export const DIVISIONS: Division[] = [
  {
    id: 'general-administration',
    name: 'Division des Affaires Générales',
    nameEn: 'General Affairs Division',
    nameFr: 'Division des Affaires Générales',
    description: 'Plateforme intégrée pour automatiser et tracer l\'ensemble des processus administratifs, logistiques et documentaires de GeoCasa Group.',
    descriptionEn: 'Integrated platform to automate and track all administrative, logistical and documentary processes of GeoCasa Group.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'bg-blue-600',
    offices: [
      {
        id: 'general-admin-logistics',
        name: 'Bureau 1 : Administration Générale & Logistique',
        nameEn: 'Office 1: General Administration & Logistics',
        nameFr: 'Bureau 1 : Administration Générale & Logistique',
        description: 'Gestion administrative interne, coordination logistique et production documentaire administrative (courriers, contrats, patrimoine, stock, missions).',
        descriptionEn: 'Internal administrative management, logistics coordination and administrative document production (correspondence, contracts, assets, stock, missions).',
        image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-indigo-700',
        divisionId: 'general-administration'
      },
      {
        id: 'reception-documentation-archiving',
        name: 'Bureau 2 : Accueil, Documentation & Archivage',
        nameEn: 'Office 2: Reception, Documentation & Archiving',
        nameFr: 'Bureau 2 : Accueil, Documentation & Archivage',
        description: 'Réception, orientation, documentation et archivage final des informations et documents internes/externes. Centre d\'information et de mémoire numérique de l\'entreprise.',
        descriptionEn: 'Reception, orientation, documentation and final archiving of internal/external information and documents. Company information center and digital memory.',
        image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-teal-600',
        divisionId: 'general-administration'
      }
    ]
  },
  {
    id: 'accounting-finance',
    name: 'Division Comptabilité et Finance',
    nameEn: 'Accounting and Finance Division',
    nameFr: 'Division Comptabilité et Finance',
    description: 'Gestion financière, comptabilité, contrôle budgétaire et analyse des performances économiques de l\'entreprise.',
    descriptionEn: 'Financial management, accounting, budget control and analysis of the company\'s economic performance.',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'bg-orange-600',
    offices: [
      {
        id: 'general-accounting',
        name: 'Bureau Comptabilité Générale et Fiscale',
        nameEn: 'General Accounting and Tax Office',
        nameFr: 'Bureau Comptabilité Générale et Fiscale',
        description: 'Tenue de la comptabilité générale et gestion des obligations fiscales.',
        descriptionEn: 'General accounting maintenance and tax obligations management.',
        image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-emerald-700',
        divisionId: 'accounting-finance'
      },
      {
        id: 'treasury-commitments',
        name: 'Bureau Trésorerie Engagements',
        nameEn: 'Treasury Commitments Office',
        nameFr: 'Bureau Trésorerie Engagements',
        description: 'Gestion de la trésorerie et suivi des engagements financiers.',
        descriptionEn: 'Treasury management and financial commitments monitoring.',
        image: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-emerald-600',
        divisionId: 'accounting-finance'
      },
      {
        id: 'project-finance',
        name: 'Bureau Finances Projets et Contrôle Budgétaire',
        nameEn: 'Project Finance and Budget Control Office',
        nameFr: 'Bureau Finances Projets et Contrôle Budgétaire',
        description: 'Financement des projets et contrôle budgétaire des opérations.',
        descriptionEn: 'Project financing and budget control of operations.',
        image: 'https://images.pexels.com/photos/6801663/pexels-photo-6801663.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-emerald-500',
        divisionId: 'accounting-finance'
      }
    ]
  },
  {
    id: 'human-resources',
    name: 'Division Ressources Humaines',
    nameEn: 'Human Resources Division',
    nameFr: 'Division Ressources Humaines',
    description: 'Gestion complète du personnel, administration RH, développement humain, formation et bien-être au travail.',
    descriptionEn: 'Complete personnel management, HR administration, human development, training and workplace welfare.',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'bg-grey-600',
    offices: [
      {
        id: 'personnel-career-admin',
        name: 'Administration du Personnel & Gestion des Carrières',
        nameEn: 'Personnel Administration & Career Management',
        nameFr: 'Administration du Personnel & Gestion des Carrières',
        description: 'Gestion complète du personnel : enregistrement, contrats, paie, présences, évaluations, carrières, discipline et reporting RH avec système digital intégré.',
        descriptionEn: 'Complete personnel management: registration, contracts, payroll, attendance, evaluations, careers, discipline and HR reporting with integrated digital system.',
        image: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-indigo-700',
        divisionId: 'human-resources'
      }
    ]
  },
  {
    id: 'marketing-communication',
    name: 'Division Marketing et Communication',
    nameEn: 'Marketing and Communication Division',
    nameFr: 'Division Marketing et Communication',
    description: 'Stratégies marketing, communication corporate, relations publiques et développement de la marque.',
    descriptionEn: 'Marketing strategies, corporate communication, public relations and brand development.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'bg-blue-600',
    offices: [
      {
        id: 'marketing-strategy',
        name: 'Bureau Stratégie Marketing et Communication',
        nameEn: 'Marketing Strategy and Communication Office',
        nameFr: 'Bureau Stratégie Marketing et Communication',
        description: 'Élaboration des stratégies marketing et coordination des campagnes de communication.',
        descriptionEn: 'Marketing strategy development and communication campaign coordination.',
        image: 'https://images.pexels.com/photos/3184477/pexels-photo-3184477.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-orange-700',
        divisionId: 'marketing-communication'
      },
      {
        id: 'public-relations',
        name: 'Bureau Relations Publiques et Médias',
        nameEn: 'Public Relations and Media Office',
        nameFr: 'Bureau Relations Publiques et Médias',
        description: 'Gestion des relations publiques, relations presse et communication externe.',
        descriptionEn: 'Public relations management, press relations and external communication.',
        image: 'https://images.pexels.com/photos/3184491/pexels-photo-3184491.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-grey-600',
        divisionId: 'marketing-communication'
      },
      {
        id: 'brand-digital',
        name: 'Bureau Développement de Marque et Digital',
        nameEn: 'Brand Development and Digital Office',
        nameFr: 'Bureau Développement de Marque et Digital',
        description: 'Développement de la marque, marketing digital et présence en ligne.',
        descriptionEn: 'Brand development, digital marketing and online presence.',
        image: 'https://images.pexels.com/photos/3184505/pexels-photo-3184505.jpeg?auto=compress&cs=tinysrgb&w=800',
        color: 'bg-blue-500',
        divisionId: 'marketing-communication'
      }
    ]
  }
];

export const COMPANY_INFO: CompanyInfo = {
  name: 'GeoCasa Group',
  location: 'Yaoundé, Cameroun',
  openingHours: '08:00 - 18:00',
  phone: '+237 6XX XXX XXX',
  email: 'contact@geocasagroup.com'
};

export const TRANSLATIONS = {
  en: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    welcome: 'Welcome',
    selectLanguage: 'Select Language',
    selectDepartment: 'Select Department',
    dashboard: 'Dashboard',
    requests: 'Requests',
    settings: 'Settings',
    logout: 'Logout',
    openingHours: 'Opening Hours',
    location: 'Location',
    connectedAs: 'Connected as',
    device: 'Device',
    departments: {
      'land-cadastral': 'Land and Cadastral Management Department',
      'financing': 'Real Estate and Land Financing Department',
      'sales-management': 'Real Estate Sales and Management Department'
    }
  },
  fr: {
    login: 'Connexion',
    email: 'Email',
    password: 'Mot de passe',
    signIn: 'Se connecter',
    welcome: 'Bienvenue',
    selectLanguage: 'Choisir la langue',
    selectDepartment: 'Sélectionner le département',
    dashboard: 'Tableau de bord',
    requests: 'Demandes',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    openingHours: 'Heures d\'ouverture',
    location: 'Localisation',
    connectedAs: 'Connecté en tant que',
    device: 'Appareil',
    departments: {
      'land-cadastral': 'Département Gestion Foncier et Cadastrale',
      'financing': 'Département Financement Foncier et Immobilier',
      'sales-management': 'Département Vente et Gestion Immobilière'
    }
  }
};