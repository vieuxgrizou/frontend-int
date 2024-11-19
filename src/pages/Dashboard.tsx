import React from 'react';
import { BarChart, Clock, MessageSquare, Globe2 } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      name: 'Commentaires générés',
      value: '0',
      icon: MessageSquare,
      change: '0%',
      changeType: 'neutral',
    },
    {
      name: 'Sites actifs',
      value: '0',
      icon: Globe2,
      change: '0',
      changeType: 'neutral',
    },
    {
      name: "Taux d'engagement",
      value: '0%',
      icon: BarChart,
      change: '0%',
      changeType: 'neutral',
    },
    {
      name: 'Temps moyen',
      value: '0min',
      icon: Clock,
      change: '0%',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="page-container">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="container-card relative pt-5 px-4 pb-12 sm:pt-6 sm:px-6"
            >
              <dt>
                <div className="absolute bg-primary-600 rounded-md p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 dark:text-dark-secondary truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900 dark:text-dark-primary">
                  {stat.value}
                </p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : stat.changeType === 'negative'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-dark-secondary'
                }`}>
                  {stat.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>
    </div>
  );
}