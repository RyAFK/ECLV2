import type { ClinicalModule } from "@/lib/types";

export const GUIDE_COVERAGE = [
  "Common patient symptoms",
  "Clinical indicators to consider",
  "Lifestyle impact",
  "Useful information to include in the referral",
  "Questions to ask the patient",
  "What happens after referral",
  "How to discuss the referral with the patient",
];

export const CLINICAL_MODULES: ClinicalModule[] = [
  {
    id: "cataract-referral",
    title: "When should I refer for cataract surgery?",
    summary: "Recognise when symptoms, visual function and lifestyle impact may justify further ophthalmic assessment.",
    duration: "5 minutes",
    icon: "Eye",
    openingQuestion:
      "Have you seen a patient recently whose vision is technically acceptable on the chart, but who is increasingly struggling with glare, driving, reading or daily activities?",
    openingFollowUp: "This may be the type of patient worth considering for further ophthalmic assessment. Let's explore why.",
    keyIndicators: [
      "Increasing glare or haloes, particularly when driving at night.",
      "Declining quality of vision despite updated spectacle correction.",
      "Difficulty reading, recognising faces or performing everyday activities.",
      "Reduced contrast or increased dependence on brighter lighting.",
      "Lifestyle or occupational limitations caused by declining vision.",
      "A patient actively expressing frustration with their current vision.",
    ],
    conversationExamples: [
      "You've mentioned that glare and night driving are becoming increasingly difficult. Although your glasses are helping as much as possible, it may be worth arranging a specialist assessment to explore whether your cataracts are beginning to affect your quality of vision.",
      "Your prescription looks stable, but you've told me reading and recognising faces feel harder lately. A specialist assessment could help clarify whether this is related to your natural lens and what options may be available.",
      "Given how much your vision is affecting your day-to-day activities, it might be worth exploring a cataract assessment with a specialist, just so you have all the information available to you.",
    ],
    caseStudy: {
      scenario:
        "A 67-year-old patient reports increasing glare when driving at night and difficulty reading despite a recent spectacle update. Their vision has gradually declined and early cataracts have previously been documented.",
      options: [
        {
          label: "Continue routine monitoring only.",
          feedback:
            "Given the functional impact on daily activities described, routine monitoring alone may miss an opportunity for the patient to understand their options sooner. This may be worth reconsidering with the wider picture in mind.",
        },
        {
          label: "Discuss whether a specialist ophthalmology assessment may be appropriate.",
          feedback:
            "This is often a reasonable next step. A specialist assessment allows the patient to understand their options without committing to any treatment, and keeps the decision in their hands.",
        },
        {
          label: "Recommend a specific surgical treatment immediately.",
          feedback:
            "Recommending a specific treatment without a specialist assessment goes beyond an optometrist's scope and may set expectations that aren't appropriate. A specialist assessment should come first.",
        },
      ],
    },
    referralScenarios: [
      {
        scenario:
          "A 59-year-old patient has excellent corrected distance vision but reports significant glare, reduced contrast and increasing difficulty driving after dark.",
        feedback: {
          refer:
            "Good corrected vision on the chart doesn't always reflect real-world visual function. Glare and contrast difficulties significantly affecting driving are a reasonable basis for referral.",
          monitor:
            "Monitoring alone may delay a conversation the patient could benefit from now, particularly as symptoms are already affecting a safety-critical activity like night driving.",
          unclear:
            "There's enough information here to consider raising the possibility of a specialist assessment — waiting for more detail isn't necessary before starting that conversation.",
        },
      },
      {
        scenario:
          "A 72-year-old patient mentions mild, occasional glare, has vision correctable to 6/6, and reports no functional complaints during a routine check.",
        feedback: {
          refer:
            "Referral isn't wrong, but without functional impact or patient concern, continued monitoring at the next routine review is also reasonable.",
          monitor:
            "With good corrected vision and no functional impact reported, routine monitoring and re-assessment at the next check is a reasonable approach.",
          unclear:
            "There's likely enough information here already — vision is good and there's no functional complaint, so monitoring is a reasonable starting point.",
        },
      },
      {
        scenario:
          "A 65-year-old patient reports difficulty with glare and inconsistent vision, but hasn't mentioned any impact on daily life, and declines further discussion when the topic is raised.",
        feedback: {
          refer:
            "It's reasonable to mention the option, but if the patient doesn't wish to explore it further at this time, that decision should be respected while keeping the door open.",
          monitor:
            "Monitoring is reasonable here, but it may still be worth briefly noting the option is available whenever the patient wishes to explore it.",
          unclear:
            "There may be more to understand about how these symptoms affect the patient day-to-day before making a firm recommendation either way.",
        },
      },
    ],
    quiz: [
      {
        question: "Which of these is most likely to prompt a referral conversation, even if visual acuity is 6/6 on the chart?",
        options: ["Glare and difficulty driving at night", "A stable prescription for two years", "Patient's age alone"],
        correctIndex: 0,
        explanation:
          "Functional symptoms like glare and night-driving difficulty can significantly affect quality of life, even when chart-measured acuity looks reasonable.",
      },
      {
        question: "What is the main purpose of referring a patient for a cataract assessment?",
        options: [
          "To guarantee they will need surgery",
          "To allow a specialist to assess suitability and discuss options",
          "To replace the optometrist's ongoing care",
        ],
        correctIndex: 1,
        explanation: "Referral opens the door to a specialist assessment and an informed conversation — it doesn't commit the patient to treatment.",
      },
      {
        question: "Which statement best reflects good practice when raising the possibility of referral?",
        options: [
          "Telling the patient they definitely need surgery",
          "Explaining that a specialist assessment can clarify options without committing to treatment",
          "Avoiding the conversation until vision drops significantly",
        ],
        correctIndex: 1,
        explanation: "Framing referral as a low-commitment, informative step helps patients feel in control of the decision.",
      },
    ],
    guide: {
      title: "Cataract Referral Guide",
      description: "A practical one-page guide designed to support patient identification and appropriate referrals.",
    },
  },
  {
    id: "rle-candidates",
    title: "Identifying suitable RLE candidates",
    summary: "Understand the broad patient characteristics that may prompt a conversation about refractive lens exchange.",
    duration: "6 minutes",
    icon: "Focus",
    openingQuestion:
      "Have you seen a presbyopic patient in their 50s or 60s who is increasingly frustrated with reading glasses, varifocals or contact-lens compromises — and who has good ocular health otherwise?",
    openingFollowUp: "This may be the type of patient worth considering for a refractive lens exchange conversation. Let's explore why.",
    keyIndicators: [
      "Presbyopic patients frustrated with dependence on reading glasses or varifocals.",
      "Moderate to high hyperopia or myopia with reducing tolerance for contact lenses.",
      "Early lens changes noted alongside a strong desire to reduce spectacle dependence.",
      "Active lifestyle or occupation where spectacle dependence is limiting.",
      "Patients who have asked about laser eye surgery but may fall outside typical laser candidacy due to age or prescription.",
      "Realistic expectations and generally good ocular health with no contraindicating pathology noted.",
    ],
    conversationExamples: [
      "You've mentioned you're finding your varifocals frustrating, especially for close work. There's a lens-based option that can reduce dependence on glasses altogether — would it be helpful to arrange a specialist assessment to see if you might be suitable?",
      "Because your prescription is quite high, laser correction may not be the best fit, but there's a lens-based alternative that's often considered in this situation. A specialist assessment can confirm if it's right for you.",
      "As we're starting to see some early lens changes alongside your frustration with glasses, it could be worth exploring whether a lens-based procedure might address both at once — shall I arrange an assessment?",
    ],
    caseStudy: {
      scenario:
        "A 58-year-old hyperopic patient wears varifocals and describes ongoing frustration with glasses for both distance and near tasks. They have asked about laser eye surgery, but their prescription and age make them a less typical laser candidate. Ocular health is otherwise unremarkable.",
      options: [
        {
          label: "Tell the patient laser surgery isn't suitable and leave it there.",
          feedback:
            "This closes the conversation without exploring alternatives. Patients outside typical laser candidacy may still be suitable for other lens-based options worth discussing.",
        },
        {
          label: "Discuss whether a specialist assessment for refractive lens exchange may be appropriate.",
          feedback:
            "This is often a reasonable next step, giving the patient an opportunity to explore a suitable alternative pathway with specialist input.",
        },
        {
          label: "Recommend refractive lens exchange as the definite solution.",
          feedback:
            "Recommending a specific treatment without a specialist suitability assessment goes beyond an optometrist's scope. Suitability depends on factors best assessed by a specialist.",
        },
      ],
    },
    referralScenarios: [
      {
        scenario:
          "A 55-year-old patient with moderate hyperopia says they're 'sick of' needing glasses for everything and would consider any option to reduce dependence on them.",
        feedback: {
          refer:
            "A clear expression of motivation to reduce spectacle dependence, combined with a relevant prescription profile, is a reasonable basis to raise the option.",
          monitor: "Monitoring alone may miss the opportunity to respond to a patient actively expressing interest in reducing dependence on glasses.",
          unclear: "There's likely enough here to at least mention the option — a specialist assessment would clarify suitability further.",
        },
      },
      {
        scenario:
          "A 61-year-old with early lens changes and low myopia mentions occasional double vision when tired, but has no significant complaints about glasses.",
        feedback: {
          refer:
            "Referral could be reasonable, though it may help to understand more about the double vision symptom first, as it may point toward a different assessment need.",
          monitor: "Continued monitoring is reasonable if there's no significant functional complaint, though the double-vision symptom is worth noting for the next review.",
          unclear: "It may help to explore the double-vision symptom a little further before deciding on the most appropriate next step.",
        },
      },
      {
        scenario: "A 49-year-old patient with early presbyopia asks about 'laser or lens surgery' out of curiosity but has no real frustration with current glasses.",
        feedback: {
          refer: "Referral is an option if the patient wants more information, but there's no pressing functional need described yet.",
          monitor: "With no significant frustration or functional impact described, continuing with routine spectacle correction and revisiting the conversation later is reasonable.",
          unclear: "It may help to understand what's prompting their curiosity before deciding whether a specialist conversation is the right next step.",
        },
      },
    ],
    quiz: [
      {
        question: "Which patient profile is most typically associated with refractive lens exchange conversations?",
        options: ["Presbyopic patients frustrated with spectacle dependence", "Children with early hyperopia", "Patients with no refractive error"],
        correctIndex: 0,
        explanation: "RLE conversations are most often relevant for presbyopic patients seeking reduced dependence on glasses.",
      },
      {
        question: "Why might a patient be a less typical candidate for laser vision correction but still worth discussing lens-based options with?",
        options: ["They are too young", "Their prescription or age profile falls outside typical laser candidacy", "They have never worn glasses"],
        correctIndex: 1,
        explanation: "Higher prescriptions or presbyopic age profiles often sit outside typical laser candidacy, making lens-based options worth exploring.",
      },
      {
        question: "What is the optometrist's role when a patient may be suitable for RLE?",
        options: ["Confirm they will definitely benefit from surgery", "Raise the possibility and refer for specialist suitability assessment", "Perform the suitability assessment personally"],
        correctIndex: 1,
        explanation: "Suitability for RLE is confirmed by a specialist assessment — the optometrist's role is to raise the possibility and refer appropriately.",
      },
    ],
    guide: {
      title: "RLE Candidate Referral Guide",
      description: "A practical one-page guide designed to support patient identification and appropriate referrals.",
    },
  },
  {
    id: "icl-vs-laser",
    title: "ICL versus laser vision correction",
    summary: "Explore the key differences between implantable contact lenses and laser vision correction pathways.",
    duration: "6 minutes",
    icon: "GitCompare",
    openingQuestion:
      "Have you seen a younger patient with a high prescription, or thinner corneas, who has been told they 'might not be suitable' for laser eye surgery?",
    openingFollowUp: "This may be the type of patient worth considering for an ICL conversation. Let's explore why.",
    keyIndicators: [
      "High myopia or hyperopia outside typical laser treatment ranges.",
      "Thinner corneas or corneal shape that may limit laser suitability.",
      "Patients keen to avoid removing corneal tissue.",
      "Younger patients (often under 45) with a stable prescription seeking spectacle independence.",
      "Patients who have previously been declined for laser treatment elsewhere.",
      "Interest in a potentially reversible refractive procedure.",
    ],
    conversationExamples: [
      "Your prescription is a bit higher than what's typically suited to laser correction, but there's another option called an implantable contact lens that's often considered in these cases. Would it help to arrange a specialist assessment to compare the two?",
      "Because your corneas are on the thinner side, laser surgery may not be the most suitable option, but a lens-based alternative might be worth exploring instead.",
      "As you're keen to explore vision correction, it may be worth a specialist assessment to compare both laser and lens-based options and see which one suits your eyes best.",
    ],
    caseStudy: {
      scenario:
        "A 32-year-old patient with a high myopic prescription and relatively thin corneas has researched laser eye surgery online and is keen to proceed quickly. They haven't had a formal suitability assessment.",
      options: [
        {
          label: "Book them directly for laser surgery based on their preference.",
          feedback: "Patient preference alone doesn't confirm treatment suitability. A comprehensive assessment is needed before any pathway is confirmed.",
        },
        {
          label: "Discuss whether a specialist assessment comparing ICL and laser options may be appropriate.",
          feedback:
            "This is often a reasonable next step, allowing a specialist to assess corneal thickness, prescription and ocular health to determine the most suitable option.",
        },
        {
          label: "Tell the patient laser surgery definitely isn't suitable for them.",
          feedback: "Without a formal assessment, it isn't possible to rule laser treatment in or out. A specialist assessment should guide this decision.",
        },
      ],
    },
    referralScenarios: [
      {
        scenario:
          "A 28-year-old with a stable, high myopic prescription and no corneal concerns noted is frustrated with contact-lens intolerance and asks about permanent options.",
        feedback: {
          refer: "A stable high prescription with contact-lens intolerance and clear patient motivation is a reasonable basis to discuss a specialist refractive assessment.",
          monitor: "Monitoring alone may not address the patient's active interest in a permanent solution.",
          unclear: "There's likely enough here to raise the option — a specialist assessment would clarify which pathway suits best.",
        },
      },
      {
        scenario: "A 40-year-old with a mild, stable prescription mentions they've heard about laser surgery from a friend but have no particular frustration with their current glasses.",
        feedback: {
          refer: "Referral is reasonable if the patient wants more information, though there's no strong functional driver yet.",
          monitor: "With a mild, stable prescription and no significant frustration, continuing with current correction is a reasonable approach for now.",
          unclear: "It may help to understand what's prompting their interest before recommending a specialist conversation.",
        },
      },
      {
        scenario:
          "A 50-year-old patient with early presbyopia and a moderate prescription asks specifically about ICL after reading about it, but hasn't mentioned any particular frustration with glasses.",
        feedback: {
          refer: "It's reasonable to explore this further with the patient, though understanding their motivation may help guide the conversation.",
          monitor: "Monitoring is an option, though the patient has actively raised the topic, so it may be worth exploring their interest a little more.",
          unclear: "Understanding what's prompting their interest, and whether presbyopia has been considered, would help clarify the most relevant next step.",
        },
      },
    ],
    quiz: [
      {
        question: "Which factor commonly makes a patient less suitable for laser vision correction but a possible candidate for ICL?",
        options: ["Thin corneas or a very high prescription", "Being over 60", "Having 6/6 vision"],
        correctIndex: 0,
        explanation: "Thin corneas and very high prescriptions often fall outside typical laser candidacy, making ICL worth considering.",
      },
      {
        question: "What is a key advantage some patients associate with ICL over laser correction?",
        options: ["It's cheaper", "It doesn't remove corneal tissue and may be considered more reversible", "It requires no specialist assessment"],
        correctIndex: 1,
        explanation: "Because no corneal tissue is removed, some patients and clinicians view ICL as a more reversible option.",
      },
      {
        question: "What should determine whether a patient proceeds with ICL or laser correction?",
        options: ["Patient preference alone", "A specialist suitability assessment considering prescription, corneal profile and ocular health", "Which one is quicker to book"],
        correctIndex: 1,
        explanation: "A specialist assessment weighing prescription, corneal profile and ocular health should guide the final pathway decision.",
      },
    ],
    guide: {
      title: "ICL and Laser Vision Correction Referral Guide",
      description: "A practical one-page guide designed to support patient identification and appropriate referrals.",
    },
  },
  {
    id: "premium-iols",
    title: "Understanding premium IOLs",
    summary: "Build confidence discussing monofocal, toric, EDOF and multifocal lens technologies with patients.",
    duration: "7 minutes",
    icon: "Aperture",
    openingQuestion: "Have you had a cataract patient ask what type of lens they'll receive, or whether they could reduce their need for glasses after surgery?",
    openingFollowUp: "This is a common and important conversation. Let's explore how to approach it confidently.",
    keyIndicators: [
      "Patients undergoing cataract assessment who ask about reducing dependence on glasses afterwards.",
      "Patients with significant astigmatism who may benefit from a toric lens discussion.",
      "Patients with active lifestyles interested in a broader range of unaided vision.",
      "Patients who value clarity of information about lens options before referral.",
      "Patients with realistic expectations who are good candidates for a premium lens conversation.",
      "Occupational or hobby-related visual demands, such as driving, reading or screen work, worth noting.",
    ],
    conversationExamples: [
      "As part of your cataract assessment, the specialist will discuss the different lens options available, including some that may reduce your need for glasses afterwards. It's worth going into that conversation with your priorities in mind.",
      "You've mentioned you'd like to rely less on glasses after surgery — that's exactly the kind of thing to raise at your specialist assessment, as there are lens options designed with that in mind.",
      "Because you have some astigmatism, there are specific lens options that can address that as part of your cataract surgery — the specialist can talk you through whether that's suitable.",
    ],
    caseStudy: {
      scenario:
        "A 70-year-old patient due for cataract assessment mentions they currently need glasses for both distance and reading, and would love to reduce that dependence if possible. They have mild astigmatism and enjoy golf and reading.",
      options: [
        {
          label: "Tell the patient exactly which lens they should ask for.",
          feedback: "Recommending a specific lens goes beyond an optometrist's scope. Lens suitability depends on a detailed specialist assessment of the whole eye.",
        },
        {
          label: "Encourage the patient to raise their glasses-independence goals at their specialist assessment.",
          feedback: "This is a helpful approach — it ensures the patient's priorities are part of the specialist conversation, without predicting the outcome.",
        },
        {
          label: "Avoid mentioning lens options at all to prevent raising expectations.",
          feedback: "Patients often benefit from knowing options exist so they can discuss them with a specialist. Avoiding the topic may leave them less prepared for that conversation.",
        },
      ],
    },
    referralScenarios: [
      {
        scenario: "A patient booked for cataract assessment specifically asks whether they could have a lens that reduces their need for reading glasses too.",
        feedback: {
          refer: "This is a clear opportunity to encourage the patient to raise their goal directly with the specialist during their assessment.",
          monitor: "As the patient is already due for assessment, there's no need to delay — this is a good opportunity to note their goal for that appointment.",
          unclear: "There's enough here already — the patient's stated goal is useful information to pass along ahead of their specialist assessment.",
        },
      },
      {
        scenario: "A patient with significant astigmatism due for cataract surgery hasn't mentioned any preference about lens type.",
        feedback: {
          refer: "It may be worth gently mentioning that lens options exist for astigmatism, so the patient can raise it if it's relevant to them.",
          monitor: "Monitoring is reasonable, though a brief mention of available options may help the patient prepare for their specialist conversation.",
          unclear: "Understanding whether the patient values reduced spectacle dependence would help determine how much to raise this topic.",
        },
      },
      {
        scenario: "A patient due for cataract assessment says they're happy to keep wearing glasses afterwards and have no particular preference.",
        feedback: {
          refer: "There's no need to push the topic if the patient has no particular preference — the specialist will still cover lens options as standard.",
          monitor: "This is a reasonable approach — the specialist assessment will naturally cover lens options regardless.",
          unclear: "The patient's stated preference is fairly clear here, so there's likely enough information to proceed as planned.",
        },
      },
    ],
    quiz: [
      {
        question: "Which lens type is commonly used to correct astigmatism during cataract surgery?",
        options: ["Toric lens", "Standard monofocal lens only", "No lens can address astigmatism"],
        correctIndex: 0,
        explanation: "Toric lenses are specifically designed to correct corneal astigmatism as part of cataract surgery.",
      },
      {
        question: "What is EDOF (extended depth of focus) lens technology designed to help with?",
        options: ["Extending the range of clear vision beyond a single focal point", "Treating dry eye", "Replacing the need for a cataract assessment"],
        correctIndex: 0,
        explanation: "EDOF lenses aim to extend the usable range of vision, reducing dependence on glasses across more distances.",
      },
      {
        question: "What is the optometrist's most appropriate role in the premium lens conversation?",
        options: ["Recommend a specific premium lens", "Encourage the patient to raise their goals and priorities with the specialist", "Tell the patient premium lenses aren't worth the cost"],
        correctIndex: 1,
        explanation: "Helping patients prepare their priorities for the specialist conversation is a valuable and appropriate role for the referring optometrist.",
      },
    ],
    guide: {
      title: "Premium IOL Conversation Guide",
      description: "A practical one-page guide designed to support patient identification and appropriate referrals.",
    },
  },
  {
    id: "post-op-expectations",
    title: "Managing post-operative expectations",
    summary: "Help patients understand recovery, adaptation and realistic visual expectations following treatment.",
    duration: "5 minutes",
    icon: "ClipboardCheck",
    openingQuestion:
      "Have you seen a patient recently who's worried about what to expect after eye surgery, or who's had treatment and isn't sure if what they're experiencing is normal?",
    openingFollowUp: "Helping set realistic expectations is one of the most valuable conversations you can have. Let's explore how.",
    keyIndicators: [
      "Patients anxious about surgery who would benefit from understanding what to expect.",
      "Patients recently treated who report symptoms that may be part of normal adaptation.",
      "Patients unsure whether their recovery is progressing as expected.",
      "Patients with unrealistic expectations about immediate results.",
      "Patients who would benefit from understanding the difference between normal healing and something to flag to the clinic.",
      "Patients asking when they can resume specific activities such as driving, reading or exercise.",
    ],
    conversationExamples: [
      "It's completely normal to have some fluctuation in vision in the first few weeks after treatment — most patients find things settle and improve steadily. If anything feels concerning, the clinic is always the right place to check in.",
      "Every patient's recovery is a little different, but the specialist team will have given you a good idea of what to expect. If your experience doesn't match that, it's always worth getting in touch with them directly.",
      "Adjusting to new vision can take a little time, especially for near tasks. It's worth giving it a few weeks before judging the final result.",
    ],
    caseStudy: {
      scenario:
        "A patient who had cataract surgery three weeks ago reports that their vision is 'good but not perfect' and they're slightly concerned it hasn't fully settled yet. They haven't contacted the clinic.",
      options: [
        {
          label: "Reassure them without suggesting they contact the clinic.",
          feedback:
            "While reassurance is helpful, patients with any post-operative concern should always be encouraged to check in with the treating clinic directly, who have full knowledge of their case.",
        },
        {
          label: "Encourage them to contact the treating clinic to discuss their recovery.",
          feedback:
            "This is a sensible approach — the treating clinic is best placed to assess whether their recovery is progressing as expected and address any concerns directly.",
        },
        {
          label: "Tell them something has likely gone wrong with their surgery.",
          feedback:
            "Some fluctuation during recovery is common, and this statement may cause unnecessary alarm. Any concern is best assessed directly by the treating clinic rather than assumed.",
        },
      ],
    },
    referralScenarios: [
      {
        scenario: "A patient two weeks post-surgery mentions mild glare at night, which they were told to expect during recovery.",
        feedback: {
          refer: "Contacting the clinic is always an option if the patient wants reassurance, though this symptom was already flagged as an expected part of recovery.",
          monitor: "As this was already discussed as a normal part of recovery, reassurance and continued monitoring is a reasonable approach.",
          unclear: "It may help to confirm exactly what the patient was told to expect during their post-operative discussion.",
        },
      },
      {
        scenario: "A patient one week post-surgery reports sudden, worsening pain and redness in the treated eye.",
        feedback: {
          refer: "Sudden or worsening symptoms following surgery should always be flagged to the treating clinic promptly, in line with any post-operative advice provided.",
          monitor: "Given the sudden and worsening nature of these symptoms, monitoring alone is unlikely to be appropriate — the treating clinic should be contacted.",
          unclear: "These symptoms are significant enough that contacting the treating clinic promptly is a reasonable step regardless of further detail.",
        },
      },
      {
        scenario: "A patient six weeks post-surgery says their vision hasn't quite reached the sharpness they expected, though it has steadily improved each week.",
        feedback: {
          refer: "Encouraging the patient to discuss this with the treating clinic can help clarify whether further improvement is expected or whether review is needed.",
          monitor: "Given the steady improvement described, this is likely a normal part of the healing process, though checking in with the clinic can offer reassurance.",
          unclear: "It may help to understand more about what 'sharpness' means to this patient and how it compares with what they were told to expect.",
        },
      },
    ],
    quiz: [
      {
        question: "Which of these is most appropriate advice for a patient with a post-operative concern?",
        options: ["Reassure them and take no further action", "Encourage them to contact the treating clinic directly", "Tell them to wait several months before raising it"],
        correctIndex: 1,
        explanation: "The treating clinic has full knowledge of the patient's case and is best placed to assess post-operative concerns.",
      },
      {
        question: "Which symptom pattern would generally warrant prompt contact with the treating clinic?",
        options: ["Mild, expected glare that was discussed pre-operatively", "Sudden, worsening pain and redness", "Vision that is steadily improving week by week"],
        correctIndex: 1,
        explanation: "Sudden, worsening pain and redness falls outside expected recovery patterns and should be flagged promptly.",
      },
      {
        question: "Why is it useful for optometrists to understand typical post-operative recovery patterns?",
        options: [
          "So they can diagnose surgical complications themselves",
          "So they can help patients understand what's normal and know when to contact the clinic",
          "So they can adjust the patient's treatment plan",
        ],
        correctIndex: 1,
        explanation: "Understanding typical recovery helps optometrists reassure patients appropriately and know when to direct them back to the treating clinic.",
      },
    ],
    guide: {
      title: "Post-Operative Expectations Guide",
      description: "A practical one-page guide designed to support patient identification and appropriate referrals.",
    },
  },
  {
    id: "red-flags",
    title: "Red flags requiring ophthalmology referral",
    summary: "Recognise symptoms and clinical presentations that may require timely specialist ophthalmological assessment.",
    duration: "6 minutes",
    icon: "TriangleAlert",
    openingQuestion: "Have you seen a patient recently with sudden vision changes, flashes, floaters, or eye pain that felt like it needed more than a routine review?",
    openingFollowUp: "Recognising red flags promptly can make a significant difference to patient outcomes. Let's explore the key signs.",
    keyIndicators: [
      "Sudden onset of flashes, floaters or a curtain or shadow across the visual field.",
      "Sudden, painless loss of vision in one or both eyes.",
      "Significant eye pain, particularly with redness or reduced vision.",
      "Sudden double vision, especially with other neurological symptoms.",
      "Distorted or wavy central vision that has developed rapidly.",
      "Signs suggestive of raised intraocular pressure or acute angle closure.",
    ],
    conversationExamples: [
      "The symptoms you're describing need a specialist assessment quite promptly, so I'd like to arrange that for you as soon as possible today.",
      "This is the kind of symptom that's best checked by a specialist without delay, just to make sure everything is being looked at appropriately.",
      "I want to be cautious given what you've described, so I'm going to arrange an urgent referral so a specialist can assess this properly.",
    ],
    caseStudy: {
      scenario:
        "A 68-year-old patient reports sudden onset of floaters, flashing lights, and a shadow appearing in their peripheral vision over the last day. They have no significant ocular history.",
      options: [
        {
          label: "Book a routine follow-up appointment in a few weeks.",
          feedback: "This symptom pattern is suggestive of a potentially urgent retinal issue. A routine follow-up timeframe is unlikely to be appropriate here.",
        },
        {
          label: "Arrange an urgent same-day or next-day specialist assessment.",
          feedback:
            "This symptom pattern — sudden floaters, flashes and a shadow — is a recognised red-flag presentation that generally warrants prompt specialist assessment.",
        },
        {
          label: "Reassure the patient this is likely nothing to worry about.",
          feedback:
            "This presentation shouldn't be dismissed without specialist assessment, as it can be associated with a retinal tear or detachment which benefits from timely review.",
        },
      ],
    },
    referralScenarios: [
      {
        scenario: "A patient reports sudden, painless loss of vision in one eye this morning.",
        feedback: {
          refer: "Sudden, painless vision loss is a recognised red flag and generally warrants urgent same-day specialist assessment.",
          monitor: "Given the sudden and significant nature of this symptom, monitoring alone is unlikely to be appropriate.",
          unclear: "This presentation is significant enough to warrant urgent assessment regardless of further detail.",
        },
      },
      {
        scenario: "A patient mentions occasional, brief floaters that have been present and unchanged for several months.",
        feedback: {
          refer: "Referral could be considered if the patient is anxious, though this pattern is less typical of an acute red flag.",
          monitor: "Longstanding, unchanged floaters are generally less concerning than sudden new-onset symptoms, so continued monitoring is often reasonable.",
          unclear: "It may help to confirm there's been no recent change before deciding on the most appropriate next step.",
        },
      },
      {
        scenario: "A patient describes a painful, red eye with reduced vision that started this afternoon, alongside nausea.",
        feedback: {
          refer: "This combination of symptoms is suggestive of a potentially urgent presentation, such as acute angle closure, and generally warrants prompt specialist assessment.",
          monitor: "Given the combination of pain, redness, reduced vision and nausea, monitoring alone is unlikely to be appropriate.",
          unclear: "This combination of symptoms is significant enough to warrant urgent assessment regardless of further detail.",
        },
      },
    ],
    quiz: [
      {
        question: "Which symptom combination is most suggestive of a retinal red flag?",
        options: ["Sudden flashes, floaters and a shadow in the visual field", "Mild, stable glare when driving at night", "Gradual difficulty reading over several months"],
        correctIndex: 0,
        explanation: "Sudden flashes, floaters and a visual field shadow are classic signs associated with a possible retinal tear or detachment.",
      },
      {
        question: "What is the appropriate response to sudden, painless vision loss in one eye?",
        options: ["Routine follow-up in a few weeks", "Urgent same-day or next-day specialist assessment", "Reassurance only, with no referral"],
        correctIndex: 1,
        explanation: "Sudden, painless vision loss requires prompt specialist assessment to identify and address the underlying cause.",
      },
      {
        question: "Which combination of symptoms may suggest acute angle closure and needs prompt assessment?",
        options: ["Painful red eye, reduced vision and nausea", "Mild dryness and occasional blurring", "Longstanding, stable floaters"],
        correctIndex: 0,
        explanation: "Painful red eye with reduced vision and nausea is a recognised pattern associated with acute angle closure and needs urgent review.",
      },
    ],
    guide: {
      title: "Red Flags Referral Guide",
      description: "A practical one-page guide designed to support patient identification and appropriate referrals.",
    },
  },
];

export function getClinicalModule(id: string): ClinicalModule | undefined {
  return CLINICAL_MODULES.find((m) => m.id === id);
}
