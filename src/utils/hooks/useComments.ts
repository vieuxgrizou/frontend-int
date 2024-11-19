import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/routes';
import toast from 'react-hot-toast';
import type { Comment } from '../types';

export function useComments() {
  const queryClient = useQueryClient();

  const { data: pendingComments = [], isLoading, error } = useQuery({
    queryKey: ['comments', 'pending'],
    queryFn: commentsApi.listPending
  });

  const generateMutation = useMutation({
    mutationFn: commentsApi.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'pending'] });
      toast.success('Commentaire généré avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la génération : ${error.message}`);
    }
  });

  const approveMutation = useMutation({
    mutationFn: commentsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'pending'] });
      toast.success('Commentaire approuvé');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'approbation : ${error.message}`);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: commentsApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'pending'] });
      toast.success('Commentaire rejeté');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du rejet : ${error.message}`);
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: commentsApi.schedule,
    onSuccess: () => {
      toast.success('Génération planifiée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la planification : ${error.message}`);
    }
  });

  return {
    pendingComments,
    isLoading,
    error,
    generateComment: generateMutation.mutate,
    approveComment: approveMutation.mutate,
    rejectComment: rejectMutation.mutate,
    scheduleComments: scheduleMutation.mutate,
    isGenerating: generateMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isScheduling: scheduleMutation.isPending
  };
}