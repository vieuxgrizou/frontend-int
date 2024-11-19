// Noms par culture/langue
export const NAMES_BY_CULTURE = {
  fr: {
    firstNames: [
      'Jean', 'Pierre', 'Marie', 'Sophie', 'Thomas', 'Nicolas', 'Julie', 'Emma',
      'Lucas', 'Léa', 'Antoine', 'Camille', 'Louis', 'Chloé', 'Mathieu', 'Sarah'
    ],
    lastNames: [
      'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit',
      'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel'
    ]
  },
  en: {
    firstNames: [
      'John', 'James', 'William', 'Emma', 'Olivia', 'Michael', 'David', 'Sarah',
      'Robert', 'Elizabeth', 'Thomas', 'Jennifer', 'Charles', 'Mary', 'Joseph'
    ],
    lastNames: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis',
      'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Martin', 'Jackson'
    ]
  },
  es: {
    firstNames: [
      'José', 'María', 'Antonio', 'Manuel', 'Ana', 'Francisco', 'Juan', 'Carmen',
      'David', 'Carlos', 'Isabel', 'Miguel', 'Rafael', 'Laura', 'Fernando'
    ],
    lastNames: [
      'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez',
      'Sánchez', 'Pérez', 'Gómez', 'Martin', 'Jiménez', 'Ruiz', 'Hernández'
    ]
  },
  de: {
    firstNames: [
      'Hans', 'Thomas', 'Michael', 'Andreas', 'Peter', 'Stefan', 'Christian',
      'Anna', 'Julia', 'Sarah', 'Lisa', 'Laura', 'Katharina', 'Christina'
    ],
    lastNames: [
      'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
      'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter'
    ]
  },
  it: {
    firstNames: [
      'Giuseppe', 'Maria', 'Giovanni', 'Antonio', 'Luigi', 'Roberto', 'Paolo',
      'Anna', 'Rosa', 'Angela', 'Giovanna', 'Francesco', 'Marco', 'Laura'
    ],
    lastNames: [
      'Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Romano', 'Gallo', 'Costa',
      'Fontana', 'Conti', 'Esposito', 'Ricci', 'Bruno', 'Marino', 'Greco'
    ]
  },
  zh: {
    firstNames: [
      '李', '王', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱'
    ],
    lastNames: [
      '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰'
    ]
  },
  ja: {
    firstNames: [
      '太郎', '次郎', '一郎', '花子', '裕子', '智子', '和子', '恵子',
      '健一', '直子', '美咲', '翔太', '優子', '達也', '真由美'
    ],
    lastNames: [
      '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村',
      '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本'
    ]
  },
  ru: {
    firstNames: [
      'Александр', 'Сергей', 'Дмитрий', 'Андрей', 'Алексей', 'Максим',
      'Елена', 'Ольга', 'Наталья', 'Мария', 'Анна', 'Татьяна', 'Ирина'
    ],
    lastNames: [
      'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров',
      'Соколов', 'Михайлов', 'Новиков', 'Федоров', 'Морозов', 'Волков'
    ]
  },
  ar: {
    firstNames: [
      'محمد', 'أحمد', 'علي', 'عمر', 'خالد', 'حسن', 'فاطمة', 'عائشة',
      'مريم', 'زينب', 'سارة', 'نور', 'ليلى', 'هدى', 'رانيا'
    ],
    lastNames: [
      'العلي', 'المحمد', 'أحمد', 'السيد', 'إبراهيم', 'حسن', 'محمود',
      'عثمان', 'خان', 'الحسن', 'العمري', 'الحمد', 'السالم'
    ]
  }
  // Ajouter d'autres cultures selon les besoins
};

// Fonction pour obtenir un nom aléatoire selon la culture
export function getRandomName(culture: string = 'fr'): { firstName: string; lastName: string } {
  // Utiliser la culture spécifiée ou par défaut 'en' si non supportée
  const names = NAMES_BY_CULTURE[culture] || NAMES_BY_CULTURE.en;
  
  const firstName = names.firstNames[Math.floor(Math.random() * names.firstNames.length)];
  const lastName = names.lastNames[Math.floor(Math.random() * names.lastNames.length)];
  
  return { firstName, lastName };
}