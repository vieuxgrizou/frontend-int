import React from 'react';
import { Plus } from 'lucide-react';
import type { CommentSchedule } from '../types';
import ScheduleModal from '../components/ScheduleModal';

export default function Schedules() {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<CommentSchedule | null>(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Planification</h1>
        <button
          onClick={() => {
            setSelectedSchedule(null);
            setShowModal(true);
          }}
          className="button-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle planification
        </button>
      </div>

      <div className="container-card">
        {/* ... reste du contenu ... */}
      </div>

      {showModal && (
        <ScheduleModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          schedule={selectedSchedule}
          sites={[]}
          onSave={(schedule) => {
            console.log('Save schedule:', schedule);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}