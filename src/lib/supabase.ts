import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone?: string;
          role: 'admin' | 'manager' | 'user';
          avatar_url?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string;
          role?: 'admin' | 'manager' | 'user';
          avatar_url?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string;
          role?: 'admin' | 'manager' | 'user';
          avatar_url?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name_fr: string;
          name_en: string;
          description_fr?: string;
          description_en?: string;
          color: string;
          icon: string;
          image_url?: string;
          is_active: boolean;
          created_at: string;
        };
      };
      divisions: {
        Row: {
          id: string;
          name_fr: string;
          name_en: string;
          description_fr?: string;
          description_en?: string;
          color: string;
          image_url?: string;
          is_active: boolean;
          created_at: string;
        };
      };
      offices: {
        Row: {
          id: string;
          division_id: string;
          name_fr: string;
          name_en: string;
          description_fr?: string;
          description_en?: string;
          color: string;
          image_url?: string;
          is_active: boolean;
          created_at: string;
        };
      };
      prestations: {
        Row: {
          id: string;
          numero: string;
          client_nom: string;
          client_type: string;
          client_email?: string;
          client_phone?: string;
          client_adresse?: string;
          nom_du_dossier: String;
          code_prestation: string;
          procedure_choisie: string;
          description?: string;
          region?: string;
          departement?: string;
          ville?: string;
           validation_notes?:string;
           validated_at?:string;
          lieu_dit?: string;
          contact_terrain_nom?: string;
          contact_terrain_qualite?: string;
          contact_terrain_phone?: string;
          documents_physiques?: string[];
          documents_numeriques?: string[];
          documents_client?:string[];
          demande_par?: 'courriel' | 'courrier' | 'depot';
          date_reception: string;
          priorite: 'normale' | 'urgente' | 'tres urgente' ;
          statut: 'nouvelles' | 'validees' | 'receptionnees' | 'renvoyees' | 'traitees' | 'refusees';
          assigned_to?: string;
          assigned_office?:string;
           assigned_person?:string;
           assigned_department?:string;
          created_by?: string;
          department_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          numero?: string;
          client_nom: string;
          client_type: string;
          client_email?: string;
          client_phone?: string;
          client_adresse?: string;
          nom_du_dossier: String;
          code_prestation: string;
          procedure_choisie: string;
          description?: string;
          region?: string;
          departement?: string;
          ville?: string;
          validation_notes?:string;
          validated_at?:string;
          lieu_dit?: string;
          contact_terrain_nom?: string;
          contact_terrain_qualite?: string;
          contact_terrain_phone?: string;
          documents_physiques?: string[];
          documents_numeriques?: string[];
          documents_client?:string[];
          demande_par?: 'courriel' | 'courrier' | 'depot';
          date_reception?: string;
           priorite: 'normale' | 'urgente' | 'tres urgente' ;
          statut: 'nouvelles' | 'validees' | 'receptionnees' | 'renvoyees' | 'traitees' | 'refusees';
          assigned_to?: string;
          assigned_office?:string;
           assigned_person?:string;
           assigned_department?:string;
          created_by?: string;
          department_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          numero?: string;
          client_nom?: string;
          client_type?: string;
          client_email?: string;
          client_phone?: string;
          client_adresse?: string;
          nom_du_dossier: String;
          code_prestation?: string;
          procedure_choisie?: string;
          description?: string;
          region?: string;
          departement?: string;
          ville?: string;
           validation_notes?:string;
           validated_at?:string;
          lieu_dit?: string;
          contact_terrain_nom?: string;
          contact_terrain_qualite?: string;
          contact_terrain_phone?: string;
          documents_physiques?: string[];
          documents_numeriques?: string[];
          documents_client?:string[];
          demande_par?: 'courriel' | 'courrier' | 'depot';
          date_reception?: string;
          priorite: 'normale' | 'urgente' | 'tres urgente' ;
          statut: 'nouvelles' | 'validees' | 'receptionnees' | 'renvoyees' | 'traitees' | 'refusees';
          assigned_to?: string;
          assigned_office?:string;
           assigned_person?:string;
           assigned_department?:string;
          created_by?: string;
          department_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      courriers: {
        Row: {
          id: string;
          numero: string;
          expediteur: string;
          destinataire?: string;
          objet: string;
          type_courrier?: 'entrant' | 'sortant';
          statut: 'nouveau' | 'traite' | 'urgent' | 'archive';
          date_courrier: string;
          date_reception?: string;
          priorite: 'normale' | 'urgente';
          contenu?: string;
          pieces_jointes?: string[];
          assigned_to?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      evenements: {
        Row: {
          id: string;
          titre: string;
          description?: string;
          type_evenement?: 'reunion' | 'formation' | 'audit' | 'conference' | 'autre';
          date_debut: string;
          date_fin: string;
          lieu: string;
          organisateur?: string;
          participants_prevus: number;
          participants_confirmes: number;
          statut: 'planifie' | 'confirme' | 'en_cours' | 'termine' | 'annule';
          notes?: string;
          documents?: string[];
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      visites: {
        Row: {
          id: string;
          numero: string;
          type_visite?: 'client' | 'partenaire' | 'inspection' | 'controle' | 'autre';
          client_nom: string;
          client_societe?: string;
          client_qualite?: string;
          lieu_visite: string;
          adresse?: string;
          ville?: string;
          region?: string;
          date_debut: string;
          date_fin: string;
          responsable?: string;
          objectif?: string;
          priorite: 'normale' | 'urgente';
          statut: 'planifiee' | 'confirmee' | 'en_cours' | 'realisee' | 'annulee';
          documents?: string[];
          notes?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      archives: {
        Row: {
          id: string;
          reference: string;
          titre: string;
          type_document?: 'administratif' | 'rh' | 'juridique' | 'finance' | 'foncier' | 'projet' | 'courrier' | 'informatique' | 'logistique' | 'strategique';
          categorie?: string;
          date_creation?: string;
          date_reception?: string;
          service_origine?: string;
          responsable?: string;
          annee_archivage?: number;
          niveau_confidentialite: 'public' | 'restreint' | 'confidentiel';
          localisation_physique?: string;
          localisation_numerique?: string;
          code_indexation?: string;
          fichiers_associes?: string[];
          version: string;
          mots_cles?: string[];
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      bibliotheque: {
        Row: {
          id: string;
          reference: string;
          titre: string;
          auteur?: string;
          type_document?: 'rapport' | 'manuel' | 'guide' | 'modele' | 'plan' | 'article';
          categorie?: 'interne' | 'modele_geocasa' | 'institutionnel' | 'publication' | 'autre';
          annee_publication?: number;
          editeur?: string;
          isbn?: string;
          nombre_pages?: number;
          langue: string;
          statut: 'disponible' | 'emprunte' | 'reserve' | 'maintenance';
          localisation?: string;
          fichier_numerique?: string;
          mots_cles?: string[];
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      stock_items: {
        Row: {
          id: string;
          nom: string;
          description?: string;
          categorie?: 'bureautique' | 'technique' | 'informatique' | 'mobilier';
          quantite: number;
          seuil_alerte: number;
          prix_unitaire?: number;
          fournisseur?: string;
          code_article?: string;
          localisation?: string;
          date_derniere_entree?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      equipments: {
        Row: {
          id: string;
          nom: string;
          type_equipement?: 'informatique' | 'bureautique' | 'topographie' | 'transport' | 'autre';
          marque?: string;
          modele?: string;
          numero_serie?: string;
          date_achat?: string;
          prix_achat?: number;
          statut: 'fonctionnel' | 'maintenance' | 'panne' | 'reforme';
          localisation?: string;
          responsable?: string;
          date_derniere_maintenance?: string;
          prochaine_maintenance?: string;
          notes?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      commandes: {
        Row: {
          id: string;
          numero: string;
          fournisseur: string;
          montant_total: number;
          statut: 'validee' | 'en_cours' | 'livree' | 'annulee';
          date_commande: string;
          date_livraison_prevue?: string;
          date_livraison_effective?: string;
          notes?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      procedures_by_department: {
        Row: {
          id: string;
          department_id: string;
          procedure_name: string;
          procedure_code: string;
          estimated_duration_days: number;
          description?: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          department_id: string;
          procedure_name: string;
          procedure_code: string;
          estimated_duration_days?: number;
          description?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          department_id?: string;
          procedure_name?: string;
          procedure_code?: string;
          estimated_duration_days?: number;
          description?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}