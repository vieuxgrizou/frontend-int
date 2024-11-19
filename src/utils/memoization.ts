import memoize from 'fast-memoize';

// Mémoïsation des fonctions coûteuses
export const memoizedGeneratePersona = memoize(
  (params: any) => {
    // Logique de génération de persona
    return {};
  },
  {
    maxAge: 1000 * 60 * 5 // 5 minutes
  }
);

export const memoizedAnalyzeComment = memoize(
  (comment: string) => {
    // Logique d'analyse de commentaire
    return {};
  },
  {
    maxAge: 1000 * 60 // 1 minute
  }
);