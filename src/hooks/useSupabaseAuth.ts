import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Department, Division } from '../types';
import { DEPARTMENTS, DIVISIONS } from '../constants';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll check if there's a stored user
      const storedUser = localStorage.getItem('geocasa_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginInput: string, password: string) => {
    setLoading(true);
    try {
      // First, try to authenticate with our custom function
      const { data: authData, error: authError } = await supabase
        .rpc('authenticate_user', {
          login_input: loginInput,
          password_input: password
        });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Erreur d\'authentification. Vérifiez vos identifiants.');
      }

      if (!authData || authData.length === 0 || !authData[0].is_valid) {
        throw new Error('Identifiants invalides. Vérifiez votre email/username et mot de passe.');
      }

      const authUser = authData[0];
      console.log('Authenticated user:', authUser);

      // For admin user, give access to all departments and divisions from constants
      if (authUser.user_email === 'admin@geocasagroup.com' || loginInput === 'admin') {
        const userData: User = {
          id: authUser.user_id,
          name: authUser.user_name,
          email: authUser.user_email,
          departments: DEPARTMENTS, // All departments from constants
          divisions: DIVISIONS // All divisions from constants
        };

        setUser(userData);
        localStorage.setItem('geocasa_user', JSON.stringify(userData));
        console.log('Admin user logged in with full access:', userData);
        return userData;
      }

      // For other users, try to get their specific access from database
      const { data: userDepartments, error: deptError } = await supabase
        .from('user_department_access')
        .select(`
          departments (
            id, name_fr, name_en, description_fr, description_en, color, icon, image_url
          )
        `)
        .eq('user_id', authUser.user_id);

      const { data: userDivisions, error: divError } = await supabase
        .from('user_division_access')
        .select(`
          divisions (
            id, name_fr, name_en, description_fr, description_en, color, image_url
          )
        `)
        .eq('user_id', authUser.user_id);

      console.log('User departments from DB:', userDepartments);
      console.log('User divisions from DB:', userDivisions);

      // Map database data to our types, fallback to constants if no specific access
      const departments: Department[] = userDepartments && userDepartments.length > 0 
        ? userDepartments.map(ud => {
            const dept = ud.departments;
            const constantDept = DEPARTMENTS.find(d => d.id === dept.id);
            return {
              id: dept.id,
              name: dept.name_fr,
              nameEn: dept.name_en,
              nameFr: dept.name_fr,
              description: dept.description_fr || constantDept?.description || '',
              descriptionEn: dept.description_en || constantDept?.descriptionEn || '',
              color: dept.color,
              icon: dept.icon,
              image: dept.image_url || constantDept?.image || '',
              services: constantDept?.services || []
            };
          })
        : DEPARTMENTS; // Fallback to all departments

      const divisions: Division[] = userDivisions && userDivisions.length > 0
        ? userDivisions.map(ud => {
            const div = ud.divisions;
            const constantDiv = DIVISIONS.find(d => d.id === div.id);
            return {
              id: div.id,
              name: div.name_fr,
              nameEn: div.name_en,
              nameFr: div.name_fr,
              description: div.description_fr || constantDiv?.description || '',
              descriptionEn: div.description_en || constantDiv?.descriptionEn || '',
              color: div.color,
              image: div.image_url || constantDiv?.image || '',
              offices: constantDiv?.offices || []
            };
          })
        : DIVISIONS; // Fallback to all divisions

      const userData: User = {
        id: authUser.user_id,
        name: authUser.user_name,
        email: authUser.user_email,
        departments,
        divisions
      };

      setUser(userData);
      
      // Store user in localStorage for persistence
      localStorage.setItem('geocasa_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('geocasa_user');
  };

  const selectDepartment = (department: Department) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        currentDepartment: department,
        currentDivision: null, // Reset division when selecting new department
        currentOffice: null // Reset office when selecting new department
      };
      setUser(updatedUser);
      localStorage.setItem('geocasa_user', JSON.stringify(updatedUser));
      console.log('Department selected:', department.nameFr);
    }
  };

  const selectDivision = (division: Division) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        currentDivision: division,
        currentOffice: null // Reset office when selecting new division
      };
      setUser(updatedUser);
      localStorage.setItem('geocasa_user', JSON.stringify(updatedUser));
      console.log('Division selected:', division.nameFr);
    }
  };

  const selectOffice = (officeId: string) => {
    if (user) {
      const updatedUser = { ...user, currentOffice: officeId };
      setUser(updatedUser);
      localStorage.setItem('geocasa_user', JSON.stringify(updatedUser));
      console.log('Office selected:', officeId);
    }
  };

  // NOUVELLE FONCTION: Réinitialise les sélections sans déconnecter l'utilisateur
  const resetSelection = () => {
    if (user) {
      const updatedUser = {
        ...user,
        currentDepartment: null,
        currentDivision: null,
        currentOffice: null
      };
      setUser(updatedUser);
      localStorage.setItem('geocasa_user', JSON.stringify(updatedUser));
      console.log('User selections reset - back to UnifiedSelector');
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    selectDepartment,
    selectDivision,
    selectOffice,
    resetSelection // Ajout de la nouvelle fonction
  };
};