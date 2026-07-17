"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ModuleOverlay } from "@/components/education/module/ModuleOverlay";
import { DiscussCaseModal } from "@/components/education/DiscussCaseModal";
import { BookRyanModal } from "@/components/education/BookRyanModal";
import { PatientNoteModal } from "@/components/education/PatientNoteModal";
import { VideoSection } from "@/components/education/module/VideoSection";
import { KeyIndicatorsSection } from "@/components/education/module/KeyIndicatorsSection";
import { ConversationGuidanceSection } from "@/components/education/module/ConversationGuidanceSection";
import { CaseStudySection } from "@/components/education/module/CaseStudySection";
import { WouldYouReferSection } from "@/components/education/module/WouldYouReferSection";
import { QuizSection } from "@/components/education/module/QuizSection";
import { GuideSection } from "@/components/education/module/GuideSection";
import { CompletionScreen } from "@/components/education/module/CompletionScreen";
import { ConversionPanel } from "@/components/education/module/ConversionPanel";
import { getClinicalModule } from "@/data/clinical-education";
import { useClinicalEducationProgress, usePatientNotes } from "@/lib/clinical-education-storage";
import { logEducationEvent } from "@/lib/education-analytics";
import type { ModuleProgressRecord } from "@/lib/types";

const STEPS = [
  { id: "opening", label: "Opening question" },
  { id: "video", label: "Clinical video" },
  { id: "indicators", label: "Key indicators" },
  { id: "conversation", label: "Conversation guidance" },
  { id: "case-study", label: "Patient scenario" },
  { id: "would-you-refer", label: "Would you refer?" },
  { id: "quiz", label: "Knowledge check" },
  { id: "guide", label: "Referral guide" },
] as const;

const QUIZ_STEP_INDEX = STEPS.findIndex((s) => s.id === "quiz");

function computeResumeStep(record: ModuleProgressRecord): number {
  // Checked instead of record.status, which flips to "in-progress" as soon as the
  // page mounts (see startModule) and would otherwise make every fresh visit look
  // like an in-progress one and skip the opening step. Only the three steps that
  // actually gate forward navigation (case study, would-you-refer, quiz) are used
  // as resume anchors — video/indicators/conversation never block Continue, so
  // resuming shouldn't send the optometrist back into them either.
  const isFresh = !record.caseStudyAnswered && record.referralScenariosAnswered === 0 && record.quizAnswered === 0;
  if (isFresh) return 0;
  const doneFlags = [
    true, // opening
    true, // video — not a hard gate, never used as a resume anchor
    true, // indicators
    true, // conversation
    record.caseStudyAnswered,
    record.referralScenariosAnswered >= 3,
    record.quizCompleted,
    false, // guide — final landing step, never auto-marked done
  ];
  const idx = doneFlags.findIndex((done) => !done);
  return idx === -1 ? doneFlags.length - 1 : idx;
}

export default function ClinicalEducationModulePage() {
  const params = useParams<{ moduleId: string }>();
  const router = useRouter();
  const moduleId = params.moduleId;
  const mod = getClinicalModule(moduleId);

  const {
    getRecord,
    startModule,
    markVideoWatched,
    markCaseStudyAnswered,
    markReferralScenarioAnswered,
    recordQuizAnswer,
    resetQuiz,
    toggleSavedForLater,
  } = useClinicalEducationProgress();
  const { addNote } = usePatientNotes();

  const [discussOpen, setDiscussOpen] = useState(false);
  const [ryanOpen, setRyanOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [step, setStep] = useState(0);
  const userNavigatedRef = useRef(false);

  const recordForResume = mod ? getRecord(mod.id) : undefined;

  useEffect(() => {
    userNavigatedRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the wizard to the first step whenever the route's module changes
    setStep(0);
    if (mod) {
      startModule(mod.id);
      logEducationEvent("education_module_opened", mod.id, mod.title, mod.pathwayId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  useEffect(() => {
    if (!mod || !recordForResume || userNavigatedRef.current) return;
    if (typeof window !== "undefined" && window.location.hash === "#knowledge-check") {
      userNavigatedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deep link from the legacy library page jumps straight to the quiz step
      setStep(QUIZ_STEP_INDEX);
      return;
    }
    setStep(computeResumeStep(recordForResume));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    moduleId,
    recordForResume?.status,
    recordForResume?.videoWatched,
    recordForResume?.caseStudyAnswered,
    recordForResume?.referralScenariosAnswered,
    recordForResume?.quizCompleted,
  ]);

  if (!mod) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <p className="font-serif-display text-xl font-semibold text-[var(--text)]">Module not found</p>
        <p className="text-sm text-[var(--text-secondary)]">This Clinical Education module doesn&apos;t exist or may have been moved.</p>
        <LinkButton href="/partner/education">Back to Clinical Education</LinkButton>
      </div>
    );
  }

  const record = getRecord(mod.id);
  const referHref = `/partner/refer?pathway=${encodeURIComponent(mod.pathwayId)}`;
  const assistantHref = `/partner/assistant?module=${encodeURIComponent(mod.id)}&pathway=${encodeURIComponent(mod.pathwayId)}`;

  const { id: moduleIdConst, title: moduleTitle, pathwayId } = mod;

  const logReferClick = () => logEducationEvent("education_refer_patient_clicked", moduleIdConst, moduleTitle, pathwayId);

  const openDiscussModal = () => {
    logEducationEvent("education_discuss_case_clicked", moduleIdConst, moduleTitle, pathwayId);
    setDiscussOpen(true);
  };

  const logDiscussAssistantClick = () =>
    logEducationEvent("education_discuss_case_clicked", moduleIdConst, moduleTitle, pathwayId);

  const logGuideDownload = () => logEducationEvent("education_guide_downloaded", moduleIdConst, moduleTitle, pathwayId);

  function goBack() {
    userNavigatedRef.current = true;
    setStep((s) => Math.max(s - 1, 0));
  }

  function goContinue() {
    userNavigatedRef.current = true;
    if (step >= STEPS.length - 1) {
      router.push("/partner/education");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  const currentStepId = STEPS[step].id;
  const isLastStep = step === STEPS.length - 1;
  const continueDisabled =
    (currentStepId === "case-study" && !record.caseStudyAnswered) ||
    (currentStepId === "would-you-refer" && record.referralScenariosAnswered < 3) ||
    (currentStepId === "quiz" && !record.quizCompleted);

  return (
    <ModuleOverlay
      moduleIcon={mod.icon}
      moduleTitle={mod.title}
      stepLabel={STEPS[step].label}
      step={step + 1}
      totalSteps={STEPS.length}
      onClose={() => router.push("/partner/education")}
      onBack={goBack}
      onContinue={goContinue}
      continueLabel={isLastStep ? "Finish" : "Continue"}
      continueDisabled={continueDisabled}
      showBack={step > 0}
    >
      {currentStepId === "opening" && (
        <Card className="border-[var(--accent)]/30 bg-[var(--accent-soft)]/25">
          <CardBody className="flex flex-col gap-2">
            <p className="font-serif-display text-lg font-semibold leading-snug text-[var(--text)]">{mod.openingQuestion}</p>
            <p className="text-sm text-[var(--text-secondary)]">{mod.openingFollowUp}</p>
          </CardBody>
        </Card>
      )}

      {currentStepId === "video" && (
        <VideoSection
          duration={mod.duration}
          watched={record.videoWatched}
          onWatch={() => markVideoWatched(mod.id)}
          onDiscuss={openDiscussModal}
          referHref={referHref}
          onReferClick={logReferClick}
        />
      )}

      {currentStepId === "indicators" && (
        <KeyIndicatorsSection
          indicators={mod.keyIndicators}
          onDiscuss={openDiscussModal}
          referHref={referHref}
          onReferClick={logReferClick}
        />
      )}

      {currentStepId === "conversation" && <ConversationGuidanceSection examples={mod.conversationExamples} />}

      {currentStepId === "case-study" && (
        <CaseStudySection
          scenario={mod.caseStudy.scenario}
          options={mod.caseStudy.options}
          onAnswered={() => markCaseStudyAnswered(mod.id)}
          onDiscuss={openDiscussModal}
          onAddNote={() => setNoteOpen(true)}
          referHref={referHref}
          onReferClick={logReferClick}
        />
      )}

      {currentStepId === "would-you-refer" && (
        <WouldYouReferSection scenarios={mod.referralScenarios} onScenarioAnswered={() => markReferralScenarioAnswered(mod.id)} />
      )}

      {currentStepId === "quiz" && (
        <>
          <QuizSection
            moduleTitle={mod.title}
            questions={mod.quiz}
            completed={record.quizCompleted}
            score={record.quizScore}
            onAnswer={(correct) => recordQuizAnswer(mod.id, correct)}
            onRetake={() => resetQuiz(mod.id)}
          />
          {record.status === "completed" && (
            <ConversionPanel
              moduleTitle={mod.title}
              referHref={referHref}
              assistantHref={assistantHref}
              safetyNote={mod.safetyNote}
              onReferClick={logReferClick}
              onDiscussClick={logDiscussAssistantClick}
            />
          )}
        </>
      )}

      {currentStepId === "guide" && (
        <>
          <GuideSection guide={mod.guide} savedForLater={record.savedForLater} onToggleSave={() => toggleSavedForLater(mod.id)} onDownload={logGuideDownload} />
          {record.status === "completed" && (
            <CompletionScreen
              moduleTitle={mod.title}
              guideTitle={mod.guide.title}
              onDiscuss={openDiscussModal}
              referHref={referHref}
              onReferClick={logReferClick}
              onDownload={logGuideDownload}
            />
          )}
        </>
      )}

      <DiscussCaseModal open={discussOpen} onClose={() => setDiscussOpen(false)} moduleTitle={mod.title} onBookRyan={() => setRyanOpen(true)} />
      <BookRyanModal open={ryanOpen} onClose={() => setRyanOpen(false)} />
      <PatientNoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSave={(note, markForDiscussion) => addNote(note, mod.id, mod.title, markForDiscussion)}
      />
    </ModuleOverlay>
  );
}
