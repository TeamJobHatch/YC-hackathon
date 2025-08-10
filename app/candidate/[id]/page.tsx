import { notFound } from 'next/navigation';
import CandidateClient from '@/components/CandidateClient';
import prisma from '@/lib/prisma';

async function getCandidate(id: string) {
  try {
    return await prisma.candidate.findUnique({
      where: { id }
    });
  } catch {
    return null;
  }
}

async function getSystemState() {
  try {
    return await prisma.systemState.findFirst({ where: { id: 1 } });
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidatePage({ params }: PageProps) {
  const { id } = await params;
  const candidate = await getCandidate(id);
  const systemState = await getSystemState();

  if (!candidate) {
    notFound();
  }

  return (
    <CandidateClient 
      candidate={candidate}
      systemState={systemState}
    />
  );
}
