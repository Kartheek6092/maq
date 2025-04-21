'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AssessmentReviewPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      const res = await fetch(`/api/admin/assessment/${id}`);
      const data = await res.json();
      setAssessment(data);
    };

    fetchAssessment();
  }, [id]);

  if (!assessment) return <div className="p-6">Loading assessment...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Assessment: {assessment.title}</h1>
      <p>{assessment.description}</p>
      {/* Render additional logic like user responses, scores, charts, etc. */}
    </div>
  );
}
