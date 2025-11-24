import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface GFCDossier {
  id: string;
  numero: string;
  code_prestation: string;
  client_nom: string;
  client_type?: string;
  client_email?: string;
  client_phone?: string;
  client_adresse?: string;
  procedure_choisie: string;
  offre_choisie?: string;
  description?: string;
  statut: string;
  region?: string;
  departement?: string;
  ville?: string;
  lieu_dit?: string;
  contact_terrain_nom?: string;
  contact_terrain_qualite?: string;
  contact_terrain_phone?: string;
  demande_par?: string;
  priorite?: string;
  department_id?: string;
  raison_refus?: string;
  date_validation?: string;
  date_refus?: string;
  assigned_department?: string;
  documents_physiques?: string[];
  documents_numeriques?: string[];
  document_urls?: any;
  created_at?: string;
  updated_at?: string;
  accepted_at?: string;
  accepted_by?: string;
  treated_at?: string;
  treated_by?: string;
  validated_at?: string;
  validated_by?: string;
  delivered_at?: string;
  delivered_by?: string;
  phase_1?:boolean;
  phase_2?:boolean;
  phase_3?:boolean;
  phase_4?:boolean;
  phase_5?:boolean;
  phase_reception?:boolean;
  phase_1_date?:string;
  phase_2_date?:string;
  phase_4_date?:string;
  phase_3_date?:string;
  progression_percentage?: string | undefined | null;
validation_notes?:string;
assigned_person?:string;
abandonne?:boolean;
en_cours?:boolean;

}

export interface GFCDossierFormData {
  client_nom: string;
  client_type?: string;
  client_email?: string;
  client_phone?: string;
  client_adresse?: string;
  procedure_choisie: string;
  raison_refus?: string;
  date_validation?: string;
  date_refus?: string;
  offre_choisie?: string;
  description?: string;
  region?: string;
  departement?: string;
  ville?: string;
  lieu_dit?: string;
  contact_terrain_nom?: string;
  contact_terrain_qualite?: string;
  contact_terrain_phone?: string;
  demande_par?: string;
  priorite?: string;
  department_id?: string;
  assigned_department?: string;
  documents_physiques?: string[];
  documents_numeriques?: string[];
}

export const useGFCDossiers = () => {
  const [dossiers, setDossiers] = useState<GFCDossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prestations')
        .select('*')
        .eq('assigned_department', 'land-cadastral')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDossiers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };
 
  const createDossier = async (dossierData: GFCDossierFormData) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');

      const startOfMonth = new Date(year, now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { count } = await supabase
        .from('prestations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);

      const nextNumber = String((count || 0) + 1).padStart(4, '0');
      const code_prestation = `GFC-${year}-${month}${nextNumber}`;
      const numero = code_prestation;

      const { data, error } = await supabase
        .from('prestations')
        .insert({
          ...dossierData,
          numero,
          code_prestation,
          assigned_department: 'land-cadastral',
          statut: 'receptionnees'
        })
        .select()
        .single();

      if (error) throw error;

      setDossiers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  const updateDossier = async (id: string, updates: Partial<GFCDossier>) => {
    try {
      const { data, error } = await supabase
        .from('prestations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDossiers(prev => prev.map(d => d.id === id ? data : d));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const changeDossierStatut = async (id: string, statut: string) => {
    try {
      const updates: Partial<GFCDossier> = { statut };

      if (statut === 'en_cours') {
        updates.accepted_at = new Date().toISOString();
      } else if (statut === 'en_traitement') {
        updates.treated_at = new Date().toISOString();
      } else if (statut === 'validees') {
        updates.validated_at = new Date().toISOString();
      } else if (statut === 'livrees') {
        updates.delivered_at = new Date().toISOString();
      }

      return await updateDossier(id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de statut');
      throw err;
    }
  };

  const deleteDossier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prestations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDossiers(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  const getStatistiques = () => {
    const stats = {
      total: dossiers.length,
      par_categorie: {
        a_receptionner: dossiers.filter(d => d.statut === 'nouvelles').length,
        en_cours: dossiers.filter(d => d.statut === 'validees' || d.statut === 'en_traitement').length,
        en_instance: dossiers.filter(d => d.statut === 'en_attente' || d.statut === 'rejetes').length,
        a_transmettre: dossiers.filter(d => d.statut === 'a_livrer').length,
        cloture: dossiers.filter(d => d.statut === 'livrees' || d.statut === 'archivees').length,
      },
      par_statut: {
        nouveau: dossiers.filter(d => d.statut === 'nouvelles').length,
        en_traitement: dossiers.filter(d => d.statut === 'en_traitement').length,
        en_attente_client: dossiers.filter(d => d.statut === 'en_attente').length,
        en_attente_admin: dossiers.filter(d => d.statut === 'en_attente').length,
        complement_requis: dossiers.filter(d => d.statut === 'complement_requis').length,
        valide: dossiers.filter(d => d.statut === 'validees').length,
        rejete: dossiers.filter(d => d.statut === 'rejetes').length,
        abandonne: dossiers.filter(d => d.statut === 'abandonnees').length,
        cloture: dossiers.filter(d => d.statut === 'livrees' || d.statut === 'archivees').length,
      },
      alertes: {
        retard: 0,
        complement: dossiers.filter(d => d.statut === 'complement_requis').length,
        paiement: 0,
      }
    };

    return stats;
  };

  const getDossiersByProcedure = () => {
    const procedures: { [key: string]: number } = {};
    dossiers.forEach(d => {
      const proc = d.procedure_choisie || 'Autre';
      procedures[proc] = (procedures[proc] || 0) + 1;
    });
    return procedures;
  };

  useEffect(() => {
    fetchDossiers();
  }, []);

  return {
    dossiers,
    loading,
    error,
    createDossier,
    updateDossier,
    changeDossierStatut,
    deleteDossier,
    fetchDossiers,
    getStatistiques,
    getDossiersByProcedure
  };
};
