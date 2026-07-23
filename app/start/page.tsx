import type { Metadata } from 'next';
import GrievabilityAudit from '@/components/audit/GrievabilityAudit';

export const metadata: Metadata = {
  alternates: {
    canonical: '/start',
  },
};

export default function StartPage() {
  return <GrievabilityAudit />;
}
