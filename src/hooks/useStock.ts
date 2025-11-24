import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type StockItem = Database['public']['Tables']['stock_items']['Row'];
type StockItemInsert = Database['public']['Tables']['stock_items']['Insert'];
type StockItemUpdate = Database['public']['Tables']['stock_items']['Update'];

export const useStock = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les articles de stock
  const fetchStockItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stock_items')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setStockItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel article
  const createStockItem = async (item: Omit<StockItemInsert, 'code_article'>) => {
    try {
      const code_article = `STK-${String(Date.now()).slice(-6)}`;
      
      const { data, error } = await supabase
        .from('stock_items')
        .insert({ ...item, code_article })
        .select()
        .single();

      if (error) throw error;
      
      setStockItems(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  };

  // Mettre à jour un article
  const updateStockItem = async (id: string, updates: StockItemUpdate) => {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setStockItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Supprimer un article
  const deleteStockItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStockItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const stats = {
      total: stockItems.reduce((sum, item) => sum + item.quantite, 0),
      articles: stockItems.length,
      faible: stockItems.filter(item => item.quantite <= item.seuil_alerte && item.quantite > 0).length,
      rupture: stockItems.filter(item => item.quantite === 0).length,
      categories: {
        bureautique: stockItems.filter(item => item.categorie === 'bureautique').length,
        technique: stockItems.filter(item => item.categorie === 'technique').length,
        informatique: stockItems.filter(item => item.categorie === 'informatique').length,
        mobilier: stockItems.filter(item => item.categorie === 'mobilier').length,
      }
    };
    return stats;
  };

  useEffect(() => {
    fetchStockItems();
  }, []);

  return {
    stockItems,
    loading,
    error,
    createStockItem,
    updateStockItem,
    deleteStockItem,
    refreshStockItems: fetchStockItems,
    stats: getStats()
  };
};