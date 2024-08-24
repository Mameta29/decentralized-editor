import { getDocuments, DocumentsResponse } from '@/lib/actions/room.actions';
import HomeClient from './HomeClient';

export default async function Home() {
  const roomDocuments: DocumentsResponse = await getDocuments();

  return <HomeClient initialDocuments={roomDocuments} />;
}