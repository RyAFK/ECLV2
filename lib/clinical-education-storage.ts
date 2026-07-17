"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorageState } from "@/lib/demo-storage";
import type { ClinicalEducationProgress, ModuleProgressRecord, PatientInMindNote } from "@/lib/types";

const PROGRESS_KEY = "clinical-education-progress";
const NOTES_KEY = "clinical-education-patient-notes";

export const DEFAULT_MODULE_PROGRESS: ModuleProgressRecord = {
  status: "not-started",
  videoWatched: false,
  caseStudyAnswered: false,
  referralScenariosAnswered: 0,
  quizAnswered: 0,
  quizScore: 0,
  quizCompleted: false,
  savedForLater: false,
  updatedAt: "",
};

function now() {
  return new Date().toISOString();
}

function withRecord(
  progress: ClinicalEducationProgress,
  moduleId: string,
  update: (record: ModuleProgressRecord) => ModuleProgressRecord
): ClinicalEducationProgress {
  const current = progress[moduleId] ?? DEFAULT_MODULE_PROGRESS;
  return { ...progress, [moduleId]: update(current) };
}

export function computeModulePercent(record: ModuleProgressRecord | undefined): number {
  if (!record) return 0;
  if (record.status === "completed") return 100;
  let pct = 0;
  if (record.videoWatched) pct += 25;
  if (record.caseStudyAnswered) pct += 25;
  pct += (Math.min(record.referralScenariosAnswered, 3) / 3) * 25;
  pct += (Math.min(record.quizAnswered, 3) / 3) * 25;
  return Math.round(pct);
}

export function useClinicalEducationProgress() {
  const [progress, setProgress] = useLocalStorageState<ClinicalEducationProgress>(PROGRESS_KEY, {});

  const getRecord = useCallback(
    (moduleId: string): ModuleProgressRecord => progress[moduleId] ?? DEFAULT_MODULE_PROGRESS,
    [progress]
  );

  const startModule = useCallback(
    (moduleId: string) => {
      setProgress((prev) =>
        withRecord(prev, moduleId, (record) =>
          record.status === "not-started" ? { ...record, status: "in-progress", updatedAt: now() } : record
        )
      );
    },
    [setProgress]
  );

  const markVideoWatched = useCallback(
    (moduleId: string) => {
      setProgress((prev) => withRecord(prev, moduleId, (record) => ({ ...record, videoWatched: true, updatedAt: now() })));
    },
    [setProgress]
  );

  const markCaseStudyAnswered = useCallback(
    (moduleId: string) => {
      setProgress((prev) => withRecord(prev, moduleId, (record) => ({ ...record, caseStudyAnswered: true, updatedAt: now() })));
    },
    [setProgress]
  );

  const markReferralScenarioAnswered = useCallback(
    (moduleId: string) => {
      setProgress((prev) =>
        withRecord(prev, moduleId, (record) => ({
          ...record,
          referralScenariosAnswered: Math.min(record.referralScenariosAnswered + 1, 3),
          updatedAt: now(),
        }))
      );
    },
    [setProgress]
  );

  const recordQuizAnswer = useCallback(
    (moduleId: string, correct: boolean) => {
      setProgress((prev) =>
        withRecord(prev, moduleId, (record) => {
          if (record.quizAnswered >= 3) return record;
          const quizAnswered = record.quizAnswered + 1;
          const quizScore = record.quizScore + (correct ? 1 : 0);
          const quizCompleted = quizAnswered >= 3;
          return {
            ...record,
            quizAnswered,
            quizScore,
            quizCompleted,
            status: quizCompleted ? "completed" : record.status,
            updatedAt: now(),
          };
        })
      );
    },
    [setProgress]
  );

  const resetQuiz = useCallback(
    (moduleId: string) => {
      setProgress((prev) =>
        withRecord(prev, moduleId, (record) => ({
          ...record,
          quizAnswered: 0,
          quizScore: 0,
          quizCompleted: false,
          status: record.status === "completed" ? "in-progress" : record.status,
          updatedAt: now(),
        }))
      );
    },
    [setProgress]
  );

  const toggleSavedForLater = useCallback(
    (moduleId: string) => {
      setProgress((prev) => withRecord(prev, moduleId, (record) => ({ ...record, savedForLater: !record.savedForLater, updatedAt: now() })));
    },
    [setProgress]
  );

  const resetModule = useCallback(
    (moduleId: string) => {
      setProgress((prev) => ({ ...prev, [moduleId]: { ...DEFAULT_MODULE_PROGRESS, updatedAt: now() } }));
    },
    [setProgress]
  );

  const completedCount = useMemo(
    () => Object.values(progress).filter((record) => record.status === "completed").length,
    [progress]
  );

  return {
    progress,
    getRecord,
    startModule,
    markVideoWatched,
    markCaseStudyAnswered,
    markReferralScenarioAnswered,
    recordQuizAnswer,
    resetQuiz,
    toggleSavedForLater,
    resetModule,
    completedCount,
  };
}

export function usePatientNotes() {
  const [notes, setNotes] = useLocalStorageState<PatientInMindNote[]>(NOTES_KEY, []);

  const addNote = useCallback(
    (note: string, moduleId?: string, moduleTitle?: string, markedForDiscussion = false) => {
      const entry: PatientInMindNote = {
        id: `note-${Date.now()}-${Math.round(Math.random() * 1000)}`,
        note,
        moduleId,
        moduleTitle,
        markedForDiscussion,
        convertedToReferral: false,
        createdAt: now(),
      };
      setNotes((prev) => [entry, ...prev]);
      return entry;
    },
    [setNotes]
  );

  const toggleDiscussion = useCallback(
    (id: string) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, markedForDiscussion: !n.markedForDiscussion } : n)));
    },
    [setNotes]
  );

  const markConverted = useCallback(
    (id: string) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, convertedToReferral: true } : n)));
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotes]
  );

  return { notes, addNote, toggleDiscussion, markConverted, deleteNote };
}
