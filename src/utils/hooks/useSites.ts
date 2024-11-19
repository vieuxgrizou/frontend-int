import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sitesApi } from '../api/routes';
import toast from 'react-hot-toast';
import type { WordPressSite } from '../types';

export function useSites() {
  const queryClient = useQueryClient();

  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: sitesApi.list,
    suspense: true
  });

  const createMutation = useMutation({
    mutationFn: sitesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site ajouté avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout du site: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, site }: { id: string; site: Partial<WordPressSite> }) =>
      sitesApi.update(id, site),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour du site: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: sitesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression du site: ${error.message}`);
    }
  });

  const validateConnection = async (url: string, applicationPassword: string) => {
    try {
      const result = await sitesApi.validate(url, applicationPassword);
      if (result.success) {
        toast.success('Connexion WordPress validée');
      }
      return result;
    } catch (error) {
      toast.error('Erreur lors de la validation de la connexion');
      throw error;
    }
  };

  return {
    sites,
    isLoading,
    error,
    createSite: createMutation.mutate,
    updateSite: updateMutation.mutate,
    deleteSite: deleteMutation.mutate,
    validateConnection,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}