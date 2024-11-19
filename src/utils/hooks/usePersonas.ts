import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personasApi } from '../api/routes';
import toast from 'react-hot-toast';
import type { Persona } from '../types';

export function usePersonas() {
  const queryClient = useQueryClient();

  const { data: personas = [], isLoading, error } = useQuery({
    queryKey: ['personas'],
    queryFn: personasApi.list,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error: any) => {
      console.error('Error fetching personas:', error);
      toast.error(`Erreur lors du chargement des personas: ${error.message}`);
    }
  });

  const createMutation = useMutation({
    mutationFn: personasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
      toast.success('Persona créé avec succès');
    },
    onError: (error: any) => {
      console.error('Error creating persona:', error);
      toast.error(`Erreur lors de la création du persona: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, persona }: { id: string; persona: Partial<Persona> }) =>
      personasApi.update(id, persona),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
      toast.success('Persona mis à jour avec succès');
    },
    onError: (error: any) => {
      console.error('Error updating persona:', error);
      toast.error(`Erreur lors de la mise à jour du persona: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: personasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
      toast.success('Persona supprimé avec succès');
    },
    onError: (error: any) => {
      console.error('Error deleting persona:', error);
      toast.error(`Erreur lors de la suppression du persona: ${error.message}`);
    }
  });

  return {
    personas,
    isLoading,
    error,
    createPersona: createMutation.mutate,
    updatePersona: updateMutation.mutate,
    deletePersona: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}