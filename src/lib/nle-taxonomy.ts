import type { Question, ReviewPayload } from "@/lib/types";

export type NleTopic = {
  name: string;
  subtopics: string[];
};

export type NleSubject = {
  id: string;
  blurb: string;
  topics: NleTopic[];
};

/**
 * Hierarchy from nle.ph Topics + the app.nle.ph Mastery accordion
 * (subject → topic → subtopic). Every topic has at least one subtopic.
 */
export const NLE_SUBJECTS: NleSubject[] = [
  {
    id: "Nursing Practice I",
    blurb:
      "Care of Individuals, Families, Population Groups, and Communities in Community Health Nursing",
    topics: [
      {
        name: "Care of Clients with Non Communicable Diseases (NCD)",
        subtopics: [
          "Role of Nurse in NCD",
          "Integrated Community Based NCD Prevention and Control Program",
          "Cardiovascular Disorders",
          "Cancer",
          "Diabetes Mellitus",
          "COPD",
          "Risk Assessment and Screening Procedures",
          "Mental Health Programs",
        ],
      },
      {
        name: "Care of Clients with Communicable Diseases (CD)",
        subtopics: [
          "Level of Disease Occurrence",
          "Chain of Infection",
          "Safety and Precautions",
          "Vaccinations",
          "Types of Immunity",
          "Handwashing",
          "Tuberculosis",
          "Dengue",
          "Measles",
          "HIV/AIDS",
          "Hepatitis A, B, C, D, E",
          "Malaria",
          "Leprosy",
          "Rabies",
          "Tetanus",
          "Leptospirosis",
          "Cholera",
          "Typhoid Fever",
          "Influenza",
          "Haemophilus Influenza Type B",
          "Pneumonias",
        ],
      },
      {
        name: "Filipino Family and Its Characteristics",
        subtopics: [
          "Definition of Family",
          "Types of Families",
          "Functions of the Family",
          "Family Development Model by Evelyn Duvall",
          "Family Life Cycle",
          "Stages and Tasks in the Family Life Cycle",
          "Genogram",
          "Family Assessment Tools",
          "Typology of Nursing Problems in Family Nursing Practice",
        ],
      },
      {
        name: "Care of Normal Families",
        subtopics: [
          "Assessment of Normal Family's Health Status",
          "Nursing Diagnoses for Normal Families",
          "Planning of Normal Family Care",
          "Nursing Intervention for Normal Families",
          "Evaluation of Normal Family Care",
        ],
      },
      {
        name: "Care of Families at Risk",
        subtopics: [
          "Assessment of At-Risk Family's Health Status",
          "Nursing Diagnoses for At-Risk Families",
          "Planning of At-Risk Family Care",
          "Nursing Intervention for At-Risk Families",
          "Evaluation of At-Risk Family Care",
        ],
      },
      {
        name: "Integrated Management of Childhood Illness (IMCI)",
        subtopics: [
          "Basis for Classifying a Child’s Illness (Color-Coded Triage System)",
          "Conditions Requiring Urgent Attention",
          "Cough and Difficulty Breathing",
          "Dehydration Management (Plans A, B, and C)",
          "Fever (Including Malaria Risk)",
          "Management of Sick Young Infants (1 Week to 2 Months)",
        ],
      },
      {
        name: "Care of Population Group with Other Health Priorities",
        subtopics: [
          "Infant",
          "Children",
          "Pregnant Women",
          "Adolescents",
          "Elderly",
        ],
      },
      {
        name: "Care of the Community Utilizing the Nursing Process",
        subtopics: [
          "Basic Concepts of CHN",
          "Philippine Healthcare Delivery System",
          "Care of Community During Disasters",
        ],
      },
      {
        name: "Environmental Health and Sanitation",
        subtopics: [
          "Approved Types of Water Supply Facilities",
          "Approved Types of Toilet Facilities",
          "Rules on Food Safety",
          "Four Rights in Food Safety",
          "Classification of Solid Wastes",
          "Guidelines for Safe Sanitation Systems (Toilets)",
          "Color Coding for Healthcare Waste",
        ],
      },
      {
        name: "Expanded Program for Immunization (EPI)",
        subtopics: [
          "Childhood Vaccines and Their Schedule",
          "Types or Forms of Vaccines",
          "Common Side Effects of Vaccination and Their Management",
          "General Principles in Vaccinating Children",
          "False Contraindications to Immunization",
          "Absolute Contraindications to Immunization",
        ],
      },
      {
        name: "Public Health Programs",
        subtopics: [
          "RA 8976 - Food Fortification Act of 2000",
          "Sangkap Pinoy Seal Program",
          "Recommended Dose and Schedule for Micronutrient Supplementation",
          "Tetanus Toxoid (TT) Vaccination during Pregnancy",
          "RA 9288 - Newborn Screening Act of 2004",
          "Overview of Common Metabolic Disorders",
          "Basic Emergency Obstetric and Newborn Care (BEmONC)",
          "Comprehensive Emergency Obstetric and Newborn Care (CEmONC)",
          "Essential Intrapartum and Newborn Care (EINC) or “Unang Yakap”",
          "RA 8423 - Traditional and Alternative Medicine Act (TAMA)",
          "National Voluntary Blood Services Program",
          "Botika ng Barangay (BnB)",
          "Common Generic Drugs Available in BnB Outlets",
          "RA 10354 - Responsible Parenthood and Reproductive Health Act of 2012",
        ],
      },
      {
        name: "Laws in NP1",
        subtopics: ["Professional Accountability/Reporting"],
      },
    ],
  },
  {
    id: "Nursing Practice II",
    blurb:
      "Care of Mothers and Adolescents, Including Well, At-Risk, and Problem Conditions in All Stages of Human Growth and Development",
    topics: [
      {
        name: "Care of Mother Before Birth",
        subtopics: [
          "Length, Trimesters, Emotional, or Psychosocial Adaptations",
          "Calculation of Delivery Rate",
        ],
      },
      {
        name: "Care of Mother During Labor and Birth",
        subtopics: [
          "Components of Labor Process (5 Ps)",
          "Cardinal Movement of Fetus During Labor",
          "Essential Newborn Care or Unang Yakap",
        ],
      },
      {
        name: "Care of Mother Following Birth",
        subtopics: ["Homan’s sign for DVT", "Rubin’s Three Stages of Psychological Adjustment"],
      },
      {
        name: "Complications of Pregnancy",
        subtopics: ["Premature Rupture of Membrane", "Reproductive Loss and Grieving"],
      },
      {
        name: "Male and Female Reproductive Health",
        subtopics: ["Reproductive anatomy and health teaching"],
      },
      {
        name: "Genetic Disorders",
        subtopics: ["Overview of genetic disorders"],
      },
      {
        name: "Alternative to Childbirth",
        subtopics: ["3rd Party Reproductive Alternatives"],
      },
      {
        name: "Human Growth and Development",
        subtopics: [
          "Psychoanalytic Theory (Sigmund Freud)",
          "Cognitive Development Theory (Jean Piaget)",
          "Social Learning Theory (Albert Bandura)",
          "Psychosocial Theory (Erik Erikson)",
          "Bowlby’s Attachment Style Theory",
          "Ainsworth Attachment Style Theory",
          "Bowlby’s Phases of Separation of Anxiety",
        ],
      },
      {
        name: "Care of Neonate, Infant, Toddler, Preschool, School Age, Child, and Adolescents (Well Clients)",
        subtopics: ["Well-child care across age groups"],
      },
      {
        name: "Neonatal or Infancy Complications",
        subtopics: ["Small for Gestational Age", "Large for Gestational Age"],
      },
      {
        name: "Congenital Anomalies",
        subtopics: ["Cleft lip and palate"],
      },
      {
        name: "Toddler Complications",
        subtopics: ["Common toddler complications"],
      },
      {
        name: "Preschool Complications",
        subtopics: ["Common preschool complications"],
      },
      {
        name: "School Age Complications",
        subtopics: ["Dengue Fever and Dengue Hemorrhagic Fever"],
      },
      {
        name: "Adolescent Complications",
        subtopics: ["Sexually Transmitted Diseases (General)"],
      },
      {
        name: "Maternity and Newborn Medications",
        subtopics: [
          "Analgesics Used in Labor",
          "RhoGAM (Rho(D) Immune Globulin)",
          "Newborn Eye Prophylaxis and Nursing Management",
        ],
      },
      {
        name: "Integumentary Problems",
        subtopics: ["Pediatric integumentary problems"],
      },
    ],
  },
  {
    id: "Nursing Practice III",
    blurb:
      "Care of Clients with Surgical, Oxygenation, Fluid and Electrolytes, Infectious, Inflammatory, Immunologic, and Cellular Aberration Problems",
    topics: [
      {
        name: "Care of patients undergoing Surgery",
        subtopics: ["Classification of Surgical Procedure"],
      },
      {
        name: "Care of patients with problems in Oxygenation",
        subtopics: [
          "Anatomy and Physiology of Respiratory System",
          "Acute Respiratory Distress Syndrome (ARDS)",
          "Chronic Obstructive Pulmonary Disease (COPD)",
          "Pneumonia: Inflammation of the Lung Parenchyma",
        ],
      },
      {
        name: "Care of patients with problems in Fluids and Electrolytes and Acid-Base Balance",
        subtopics: [
          "Fluid and Electrolyte Imbalance",
          "Regulation of acid-base balance",
          "Disorders and Elimination Imbalances",
        ],
      },
      {
        name: "Care of patients with infectious, inflammatory, and immunologic disorders",
        subtopics: ["Infectious and immunologic disorders"],
      },
      {
        name: "Care of patients with cellular aberrations",
        subtopics: ["Cancer of the lungs"],
      },
    ],
  },
  {
    id: "Nursing Practice IV",
    blurb:
      "Care of Clients with Problems in Nutrition, Gastrointestinal, Metabolic, Endocrine, Perception, and Coordination Functions",
    topics: [
      {
        name: "Nutrition and Gastrointestinal Disturbances",
        subtopics: [
          "Oral and Esophageal Disorder",
          "Anatomy and Physiology of Absorption and Elimination",
          "Pancreatic Insufficiency VS Bile Salt Deficiency",
          "Gastric Ulcer VS Duodenal Ulcer",
        ],
      },
      {
        name: "Metabolism and Endocrine",
        subtopics: [
          "Anatomy and Physiology of the Liver",
          "Anatomy and Physiology of Gallbladder",
          "Cholecystitis VS Cholelithiasis VS Choledocholithiasis",
          "Anatomy and Physiology of the Pancreas",
          "Diabetes Mellitus Type 1",
          "Diabetes Mellitus Type 2",
          "Anatomy and Physiology of the Thyroid Gland",
          "Anatomy and Physiology of the Parathyroid Gland",
          "Anatomy and Physiology of Adrenal Glands",
          "Anatomy and Physiology of Pituitary Gland",
        ],
      },
      {
        name: "Perception and Coordination Disturbances",
        subtopics: [
          "Cerebrovascular Accidents or Stroke",
          "Alzheimer Disease and Dementia",
          "Anatomy and Physiology of the Eye",
          "Anatomy and Physiology of the Ear",
          "Conductive Hearing Loss VS Sensorineural Hearing Loss",
        ],
      },
    ],
  },
  {
    id: "Nursing Practice V",
    blurb:
      "Care of Clients with Maladaptive Behaviors, Critical Conditions, and Multi-Organ or High-Acuity Problems",
    topics: [
      {
        name: "State of Mental Health in the Philippines (Mental Health Care Delivery System)",
        subtopics: ["Mental health care delivery system"],
      },
      {
        name: "Psychobiologic Bases of Behavior",
        subtopics: [
          "Concept and Patterns of Human Behavior",
          "Global and Regional Perspectives on Mental Health",
        ],
      },
      {
        name: "Therapeutic Models and its Relevance to Nursing Practice",
        subtopics: [
          "Psychosocial Theory of Erik Erikson",
          "Jean Piaget Cognitive Development",
          "Aaron Black’s Cognitive Therapy",
        ],
      },
      {
        name: "Understanding Stress",
        subtopics: [
          "Acute and Long Term Effects of Stress",
          "General Adaptation Syndrome (GAS)",
          "Measuring Stress and Coping Styles",
        ],
      },
      {
        name: "Psychopathology: Etiology and Psychodynamics",
        subtopics: [
          "Disorders in Childhood Adolescents",
          "Attention Deficit Hyperactivity Disorder (ADHD)",
        ],
      },
      {
        name: "Nursing Process in Psychiatric - Mental Health Care",
        subtopics: [
          "Assessment (Subjective and Objective)",
          "Planning and Implementation of Care",
          "Nutrition and Diet Therapy",
          "Evaluation of Care and Outcome Based",
        ],
      },
      {
        name: "Care of Clients with Altered Ventilatory Function",
        subtopics: ["Acute Respiratory Distress Syndrome"],
      },
      {
        name: "Care of Clients with Altered Tissue Perfusion",
        subtopics: ["Acute Ischemic Heart Disease"],
      },
      {
        name: "Care of Clients with Altered Elimination",
        subtopics: ["Altered elimination in high-acuity care"],
      },
      {
        name: "Care of Clients with Altered Perception",
        subtopics: ["Traumatic Spinal Cord Injury"],
      },
      {
        name: "Care of Client with Multi-System Problem",
        subtopics: [
          "Systemic Inflammatory Response Syndrome",
          "Multi-Organ Dysfunction Syndrome (MODS)",
        ],
      },
      {
        name: "Care of Clients with High Acuity and Emergency Situation Medical Emergencies",
        subtopics: ["High-acuity and emergency medical situations"],
      },
      {
        name: "Enhancing, Empowering and Enabling Concepts",
        subtopics: [
          "Components of Therapeutic Communication",
          "Concepts on Collaboration and Teamwork",
        ],
      },
    ],
  },
  {
    id: "PALMER",
    blurb: "Professional Adjustment, Leadership & Management, Ethics, and Research",
    topics: [
      {
        name: "Professional Adjustment",
        subtopics: ["Roles, rights, and responsibilities of the nurse"],
      },
      {
        name: "Leadership and Management",
        subtopics: [
          "2 Types of Leaders",
          "Principle of Management and Framework",
          "Notable Theory on Management",
          "Kurt Lewin’s Theory of Change",
          "Quality Assurance VS Quality Improvement",
        ],
      },
      {
        name: "Research",
        subtopics: [
          "Basic Concept of Research",
          "Research Process (5 Major Phases and 18 Steps)",
          "Formulating and Delimiting the Problem",
          "Dissemination of Conclusion and Recommendation",
        ],
      },
    ],
  },
];

export function nleSubjectIds() {
  return NLE_SUBJECTS.map((s) => s.id);
}

export function isNleSubject(id: string) {
  return NLE_SUBJECTS.some((s) => s.id === id);
}

export function getNleSubject(id: string) {
  return NLE_SUBJECTS.find((s) => s.id === id) ?? NLE_SUBJECTS[0]!;
}

/** Topics + nested subtopics for Mastery. Falls back to the live question bank for LET. */
export function topicsForComponent(component: string, bank: Question[]): NleTopic[] {
  if (isNleSubject(component)) return getNleSubject(component).topics;
  const groups: Record<string, Set<string>> = {};
  for (const q of bank.filter((row) => row.component === component)) {
    (groups[q.topicGroup] ??= new Set()).add(q.subtopic || q.topic);
  }
  return Object.keys(groups)
    .sort()
    .map((name) => ({ name, subtopics: [...groups[name]!].sort() }));
}

/** Map a bank item onto the nle.ph topic / subtopic labels. */
export function mapQuestionToNle(q: {
  component: string;
  topic: string;
  topicGroup: string;
  subtopic?: string | null;
}): { component: string; topicGroup: string; subtopic: string } {
  const hay = `${q.topicGroup} ${q.subtopic ?? ""} ${q.topic}`.toLowerCase();
  if (!q.component.startsWith("Nursing Practice") && q.component !== "PALMER") {
    return {
      component: q.component,
      topicGroup: q.topicGroup,
      subtopic: q.subtopic ?? q.topic,
    };
  }
  const component = q.component;

  const hit = (topicGroup: string, subtopic: string) => ({
    component,
    topicGroup,
    subtopic,
  });

  if (hay.includes("tuberculosis") || hay.includes("dots")) {
    return hit("Care of Clients with Communicable Diseases (CD)", "Tuberculosis");
  }
  if (hay.includes("dengue")) {
    return hit("Care of Clients with Communicable Diseases (CD)", "Dengue");
  }
  if (hay.includes("prevalence") || hay.includes("incidence") || hay.includes("epidemiology")) {
    return hit("Care of Clients with Communicable Diseases (CD)", "Level of Disease Occurrence");
  }
  if (hay.includes("hypertension") || hay.includes("screening protocol")) {
    return hit(
      "Care of Clients with Non Communicable Diseases (NCD)",
      "Risk Assessment and Screening Procedures"
    );
  }
  if (hay.includes("diabetes")) {
    return hit("Care of Clients with Non Communicable Diseases (NCD)", "Diabetes Mellitus");
  }
  if (hay.includes("doh ncd") || hay.includes("risk factor")) {
    return hit(
      "Care of Clients with Non Communicable Diseases (NCD)",
      "Integrated Community Based NCD Prevention and Control Program"
    );
  }
  if (hay.includes("primary prevention") && hay.includes("ncd")) {
    return hit("Care of Clients with Non Communicable Diseases (NCD)", "Role of Nurse in NCD");
  }
  if (hay.includes("family types") || hay.includes("classification")) {
    return hit("Filipino Family and Its Characteristics", "Types of Families");
  }
  if (hay.includes("at-risk") || hay.includes("at risk")) {
    return hit("Care of Families at Risk", "Assessment of At-Risk Family's Health Status");
  }
  if (hay.includes("home visit")) {
    return hit("Care of Normal Families", "Assessment of Normal Family's Health Status");
  }
  if (hay.includes("disaster") || hay.includes("outbreak")) {
    return hit(
      "Care of the Community Utilizing the Nursing Process",
      "Care of Community During Disasters"
    );
  }
  if (
    hay.includes("vital statistics") ||
    hay.includes("health educator") ||
    hay.includes("policy advocate") ||
    hay.includes("surveillance") ||
    hay.includes("phc") ||
    hay.includes("health education")
  ) {
    return hit("Care of the Community Utilizing the Nursing Process", "Basic Concepts of CHN");
  }
  if (hay.includes("accountability") || hay.includes("ethico") || hay.includes("legal")) {
    return hit("Laws in NP1", "Professional Accountability/Reporting");
  }

  const subject = getNleSubject(component);
  const existingTopic = subject.topics.find((t) => t.name === q.topicGroup);
  if (existingTopic) {
    const sub =
      existingTopic.subtopics.find((s) => s === q.subtopic) ?? existingTopic.subtopics[0]!;
    return hit(existingTopic.name, sub);
  }

  return hit(subject.topics[0]!.name, subject.topics[0]!.subtopics[0]!);
}

export function questionsForSlice(
  bank: Question[],
  component: string,
  topicGroup?: string | null,
  subtopic?: string | null
) {
  return bank.filter((q) => {
    if (q.component !== component) return false;
    if (topicGroup && q.topicGroup !== topicGroup) return false;
    if (subtopic && q.subtopic !== subtopic) return false;
    return true;
  });
}

/**
 * nle.ph: percentage of unique questions in the slice the user has answered correctly.
 */
export function uniqueMasteryPct(
  bank: Question[],
  history: ReviewPayload[],
  component: string,
  topicGroup?: string | null,
  subtopic?: string | null
) {
  const slice = questionsForSlice(bank, component, topicGroup, subtopic);
  if (!slice.length) return 0;
  const ids = new Set(slice.map((q) => q.id));
  const correct = new Set<number>();
  for (const session of history) {
    for (const item of session.items) {
      if (!ids.has(item.q.id)) continue;
      if (item.chosen === item.q.answer) correct.add(item.q.id);
    }
  }
  return Math.round((correct.size / ids.size) * 100);
}
