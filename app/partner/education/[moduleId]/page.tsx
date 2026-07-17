"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { StatusPill } from "@/components/education/StatusPill";
import { ModuleIconBadge } from "@/components/education/ModuleIcon";
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
import { getClinicalModule } from "@/data/clinical-education";
import { useClinicalEducationProgress, usePatientNotes } from "@/lib/clinical-education-storage";

export default function ClinicalEducationModulePage() {
  const params = useParams<{ moduleId: string }>();
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

  useEffect(() => {
    if (mod) startModule(mod.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/partner/education"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clinical Education
      </Link>

      <div className="flex flex-wrap items-start gap-4">
        <ModuleIconBadge name={mod.icon} className="h-14 w-14" />
        <div className="flex-1">
          <h1 className="font-serif-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">{mod.title}</h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{mod.summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill status={record.status} />
            <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <Clock className="h-3.5 w-3.5" />
              {mod.duration}
            </span>
          </div>
        </div>
      </div>

      <Card className="border-[var(--accent)]/30 bg-[var(--accent-soft)]/25">
        <CardBody className="flex flex-col gap-2">
          <p className="font-serif-display text-lg font-semibold leading-snug text-[var(--text)]">{mod.openingQuestion}</p>
          <p className="text-sm text-[var(--text-secondary)]">{mod.openingFollowUp}</p>
        </CardBody>
      </Card>

      <VideoSection duration={mod.duration} watched={record.videoWatched} onWatch={() => markVideoWatched(mod.id)} onDiscuss={() => setDiscussOpen(true)} />

      <KeyIndicatorsSection indicators={mod.keyIndicators} onDiscuss={() => setDiscussOpen(true)} />

      <ConversationGuidanceSection examples={mod.conversationExamples} />

      <CaseStudySection
        scenario={mod.caseStudy.scenario}
        options={mod.caseStudy.options}
        onAnswered={() => markCaseStudyAnswered(mod.id)}
        onDiscuss={() => setDiscussOpen(true)}
        onAddNote={() => setNoteOpen(true)}
      />

      <WouldYouReferSection scenarios={mod.referralScenarios} onScenarioAnswered={() => markReferralScenarioAnswered(mod.id)} />

      <QuizSection
        moduleTitle={mod.title}
        questions={mod.quiz}
        completed={record.quizCompleted}
        score={record.quizScore}
        onAnswer={(correct) => recordQuizAnswer(mod.id, correct)}
        onRetake={() => resetQuiz(mod.id)}
        onDiscuss={() => setDiscussOpen(true)}
      />

      <GuideSection guide={mod.guide} savedForLater={record.savedForLater} onToggleSave={() => toggleSavedForLater(mod.id)} />

      {record.status === "completed" && (
        <CompletionScreen moduleTitle={mod.title} guideTitle={mod.guide.title} onDiscuss={() => setDiscussOpen(true)} />
      )}

      <DiscussCaseModal open={discussOpen} onClose={() => setDiscussOpen(false)} moduleTitle={mod.title} onBookRyan={() => setRyanOpen(true)} />
      <BookRyanModal open={ryanOpen} onClose={() => setRyanOpen(false)} />
      <PatientNoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSave={(note, markForDiscussion) => addNote(note, mod.id, mod.title, markForDiscussion)}
      />
    </div>
  );
}
