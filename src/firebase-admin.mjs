import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs';

export function getAdminFirestore() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccount = raw
    ? JSON.parse(raw)
    : process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'))
      : null;
  if (!serviceAccount) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON ou GOOGLE_APPLICATION_CREDENTIALS não configurada');
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  return getFirestore(app);
}
