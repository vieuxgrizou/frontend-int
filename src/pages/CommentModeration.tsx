import React from 'react';
import { Check, X, Edit2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface PendingComment {
  id: string;
  content: string;
  postId: string;
  postTitle: string;
  persona: {
    id: string;
    name: string;
  };
  site: {
    id: string;
    name: string;
  };
  generatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function CommentModeration() {
  const [comments, setComments] = React.useState<PendingComment[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingComment, setEditingComment] = React.useState<{
    id: string;
    content: string;
  } | null>(null);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      // TODO: Charger les commentaires depuis l'API
      const response = await fetch('/api/comments/pending');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des commentaires');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (comment: PendingComment) => {
    try {
      // TODO: Appeler l'API pour approuver
      await fetch(`/api/comments/${comment.id}/approve`, { method: 'POST' });
      setComments(comments.filter(c => c.id !== comment.id));
      toast.success('Commentaire approuvé');
    } catch (error) {
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleReject = async (comment: PendingComment) => {
    try {
      // TODO: Appeler l'API pour rejeter
      await fetch(`/api/comments/${comment.id}/reject`, { method: 'POST' });
      setComments(comments.filter(c => c.id !== comment.id));
      toast.success('Commentaire rejeté');
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  const handleEdit = async (id: string, content: string) => {
    try {
      // TODO: Appeler l'API pour mettre à jour
      await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content })
      });
      setComments(comments.map(c => 
        c.id === id ? { ...c, content } : c
      ));
      setEditingComment(null);
      toast.success('Commentaire mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  React.useEffect(() => {
    loadComments();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Modération des commentaires</h1>
        <button
          onClick={loadComments}
          disabled={isLoading}
          className="button-secondary"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      <div className="container-card">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-dark-secondary">
              Aucun commentaire en attente de modération
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-dark">
            {comments.map(comment => (
              <div key={comment.id} className="py-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-primary">
                        {comment.persona.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-dark-secondary">
                        sur {comment.site.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-dark-secondary">
                        • {format(new Date(comment.generatedAt), 'Pp', { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-dark-secondary mb-2">
                      Article : {comment.postTitle}
                    </p>
                    
                    {editingComment?.id === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingComment.content}
                          onChange={(e) => setEditingComment({
                            ...editingComment,
                            content: e.target.value
                          })}
                          className="input-standard w-full"
                          rows={4}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingComment(null)}
                            className="button-secondary"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleEdit(comment.id, editingComment.content)}
                            className="button-primary"
                          >
                            Sauvegarder
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                        <p className="text-gray-900 dark:text-dark-primary whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex items-center space-x-2">
                    {!editingComment && (
                      <button
                        onClick={() => setEditingComment({
                          id: comment.id,
                          content: comment.content
                        })}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-dark-primary"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleApprove(comment)}
                      className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReject(comment)}
                      className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}