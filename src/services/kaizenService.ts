import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { KaizenReport, KaizenStatus } from "../types/kaizen";

const COLLECTION_NAME = "kaizenReports";

export async function fetchKaizenReports(): Promise<KaizenReport[]> {
  const reportsRef = collection(db, COLLECTION_NAME);
  const reportsQuery = query(reportsRef, orderBy("reportedDate", "desc"));
  const snapshot = await getDocs(reportsQuery);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as KaizenReport;

    return {
      ...data,
      id: docSnap.id,
    };
  });
}

export async function createKaizenReport(report: KaizenReport): Promise<void> {
  const reportRef = doc(db, COLLECTION_NAME, report.id);

  await setDoc(reportRef, {
    ...report,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateKaizenReportStatus(
  id: string,
  status: KaizenStatus,
): Promise<void> {
  const reportRef = doc(db, COLLECTION_NAME, id);

  await updateDoc(reportRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function seedDemoKaizenReports(
  reports: KaizenReport[],
): Promise<void> {
  await Promise.all(reports.map((report) => createKaizenReport(report)));
}