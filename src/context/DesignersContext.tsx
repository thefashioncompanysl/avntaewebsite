import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Designer, DesignerCategory } from '../types';
import { supabase, supabaseAnonKey, supabaseUrl } from '../lib/supabaseClient';

const PROFILE_PICTURES_BUCKET = 'portraits';

const getStoragePathFromUrl = (imageUrl?: string) => {
  if (!imageUrl) return null;

  const marker = `/storage/v1/object/public/${PROFILE_PICTURES_BUCKET}/`;
  const index = imageUrl.indexOf(marker);

  if (index === -1) return null;

  return imageUrl.slice(index + marker.length);
};

const removeStoredImage = async (imageUrl?: string) => {
  const storagePath = getStoragePathFromUrl(imageUrl);

  if (!storagePath) return;

  const { error } = await supabase.storage.from(PROFILE_PICTURES_BUCKET).remove([storagePath]);

  if (error) {
    console.warn('Failed to remove stored designer image', error);
  }
};

interface DesignersContextType {
  designers: Designer[];
  activeDesigners: Designer[];
  loading: boolean;
  addDesigner: (designer: Designer) => Promise<void>;
  createDesignerRecord: (designer: Partial<Designer>) => Promise<string | null>;
  updateDesigner: (id: string, updates: Partial<Designer>) => Promise<void>;
  deleteDesigner: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkUpdate: (ids: string[], updates: Partial<Designer>) => Promise<void>;
  toggleApproval: (id: string, currentStatus?: boolean) => Promise<void>;
  updateCategory: (id: string, newCategory: DesignerCategory) => Promise<void>;
  refreshDesigners: (useAdminAccess?: boolean) => Promise<void>;
}

const DesignersContext = createContext<DesignersContextType | undefined>(undefined);

export const DesignersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);

  const mapDesignerRows = (rows: any[]) => rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    specialization: row.specialization || '',
    bio: row.bio || '',
    image: row.image_url || row.image || '',
    category: row.category || 'Professional',
    approved: row.is_approved !== false && row.approved !== false,
    createdAt: row.created_at || row.createdAt || undefined,
  } as Designer));

  const fetchPublicDesignerProfiles = async () => {
    try {
      // Try to fetch from the approved public view/table
      const response = await fetch(`${supabaseUrl}/rest/v1/designer_profiles?select=*`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        return response.json();
      }

      // Fallback: fetch approved designers directly from designers table
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .or('is_approved.eq.true,approved.eq.true')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Error fetching public designers:', err);
      // Fallback to empty array on error
      return [];
    }
  };

  const fetchDesigners = async (useAdminAccess: boolean) => {
    setLoading(true);

    try {
      if (useAdminAccess) {
        const { data, error } = await supabase
          .from('designers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch designers:', error);
          return;
        }

        setDesigners(mapDesignerRows(data || []));
        return;
      }

      const publicRows = await fetchPublicDesignerProfiles();
      setDesigners(mapDesignerRows(publicRows || []));
    } catch (err) {
      console.error('Error fetching designers:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDesigners = async (useAdminAccess = false) => {
    await fetchDesigners(useAdminAccess);
  };

  useEffect(() => {
    refreshDesigners(false);
  }, []);

  const activeDesigners = useMemo(() => designers.filter(d => d.approved !== false), [designers]);

  const addDesigner = async (designer: Designer) => {
    try {
      const { data, error } = await supabase
        .from('designers')
        .insert([{
          name: designer.name,
          specialization: designer.specialization,
          bio: designer.bio,
          image_url: designer.image,
          image: designer.image,
          category: designer.category,
          is_approved: designer.approved !== false ? true : false,
          approved: designer.approved !== false ? true : false,
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to add designer:', error);
        return;
      }

      const newDesigner: Designer = {
        id: data.id,
        name: data.name,
        specialization: data.specialization || '',
        bio: data.bio || '',
        image: data.image_url || data.image || '',
        category: data.category || 'Professional',
        approved: data.is_approved !== false && data.approved !== false,
        createdAt: data.created_at || data.createdAt || undefined,
      };

      setDesigners(prev => [newDesigner, ...prev]);
    } catch (err) {
      console.error('Error adding designer:', err);
    }
  };

  const createDesignerRecord = async (designer: Partial<Designer>) => {
    try {
      const { data, error } = await supabase
        .from('designers')
        .insert([{
          name: designer.name || '',
          specialization: designer.specialization || '',
          bio: designer.bio || '',
          image_url: designer.image || '',
          image: designer.image || '',
          category: designer.category || 'Professional',
          is_approved: designer.approved !== false ? true : false,
          approved: designer.approved !== false ? true : false,
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create designer record:', error);
        return null;
      }

      const newDesigner: Designer = {
        id: data.id,
        name: data.name,
        specialization: data.specialization || '',
        bio: data.bio || '',
        image: data.image_url || data.image || '',
        category: data.category || 'Professional',
        approved: data.is_approved !== false && data.approved !== false,
        createdAt: data.created_at || data.createdAt || undefined,
      };

      setDesigners(prev => [newDesigner, ...prev]);
      return String(data.id);
    } catch (err) {
      console.error('Error creating designer record:', err);
      return null;
    }
  };

  const updateDesigner = async (id: string, updates: Partial<Designer>) => {
    try {
      const currentDesigner = designers.find(d => d.id === id);
      const updatePayload: any = {};

      if (updates.name) updatePayload.name = updates.name;
      if (updates.specialization) updatePayload.specialization = updates.specialization;
      if (updates.bio) updatePayload.bio = updates.bio;
      if (updates.image) {
        updatePayload.image_url = updates.image;
        updatePayload.image = updates.image;
      }
      if (updates.category) updatePayload.category = updates.category;
      if (updates.approved !== undefined) {
        updatePayload.is_approved = updates.approved;
        updatePayload.approved = updates.approved;
      }

      const { error } = await supabase
        .from('designers')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        console.error('Failed to update designer:', error);
        return;
      }

      if (updates.image && currentDesigner?.image && updates.image !== currentDesigner.image) {
        await removeStoredImage(currentDesigner.image);
      }

      setDesigners(prev =>
        prev.map(d => d.id === id ? ({ ...d, ...updates } as Designer) : d)
      );
    } catch (err) {
      console.error('Error updating designer:', err);
    }
  };

  const deleteDesigner = async (id: string) => {
    try {
      const designerToDelete = designers.find(d => d.id === id);
      const { error } = await supabase
        .from('designers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete designer:', error);
        return;
      }

      setDesigners(prev => prev.filter(d => d.id !== id));

      if (designerToDelete?.image) {
        await removeStoredImage(designerToDelete.image);
      }
    } catch (err) {
      console.error('Error deleting designer:', err);
    }
  };

  const bulkDelete = async (ids: string[]) => {
    try {
      const imagesToRemove = designers
        .filter(d => ids.includes(d.id) && d.image)
        .map(d => d.image);

      const { error } = await supabase
        .from('designers')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Failed to bulk delete:', error);
        return;
      }

      setDesigners(prev => prev.filter(d => !ids.includes(d.id)));

      await Promise.all(imagesToRemove.map(imageUrl => removeStoredImage(imageUrl)));
    } catch (err) {
      console.error('Error bulk deleting:', err);
    }
  };

  const bulkUpdate = async (ids: string[], updates: Partial<Designer>) => {
    try {
      const designersToUpdate = designers.filter(d => ids.includes(d.id));
      const updatePayload: any = {};

      if (updates.name) updatePayload.name = updates.name;
      if (updates.specialization) updatePayload.specialization = updates.specialization;
      if (updates.bio) updatePayload.bio = updates.bio;
      if (updates.image) {
        updatePayload.image_url = updates.image;
        updatePayload.image = updates.image;
      }
      if (updates.category) updatePayload.category = updates.category;
      if (updates.approved !== undefined) {
        updatePayload.is_approved = updates.approved;
        updatePayload.approved = updates.approved;
      }

      const { error } = await supabase
        .from('designers')
        .update(updatePayload)
        .in('id', ids);

      if (error) {
        console.error('Failed to bulk update:', error);
        return;
      }

      if (updates.image) {
        await Promise.all(
          designersToUpdate
            .filter(designer => designer.image && designer.image !== updates.image)
            .map(designer => removeStoredImage(designer.image))
        );
      }

      setDesigners(prev =>
        prev.map(d => ids.includes(d.id) ? ({ ...d, ...updates } as Designer) : d)
      );
    } catch (err) {
      console.error('Error bulk updating:', err);
    }
  };

  const toggleApproval = async (id: string, currentStatus?: boolean) => {
    await updateDesigner(id, { approved: !currentStatus });
  };

  const updateCategory = async (id: string, newCategory: DesignerCategory) => {
    await updateDesigner(id, { category: newCategory });
  };

  return (
    <DesignersContext.Provider value={{
      designers,
      activeDesigners,
      loading,
      addDesigner,
      createDesignerRecord,
      updateDesigner,
      deleteDesigner,
      bulkDelete,
      bulkUpdate,
      toggleApproval,
      updateCategory,
      refreshDesigners,
    }}>
      {children}
    </DesignersContext.Provider>
  );
};

export const useDesigners = () => {
  const context = useContext(DesignersContext);
  if (context === undefined) {
    // Provide safe defaults when provider is not present (designers section removed)
    return {
      designers: [] as Designer[],
      activeDesigners: [] as Designer[],
      loading: false,
      addDesigner: async () => {},
      createDesignerRecord: async () => null,
      updateDesigner: async () => {},
      deleteDesigner: async () => {},
      bulkDelete: async () => {},
      bulkUpdate: async () => {},
      toggleApproval: async () => {},
      updateCategory: async () => {},
      refreshDesigners: async () => {},
    } as DesignersContextType;
  }
  return context;
};
