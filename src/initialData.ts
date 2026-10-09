import {
  BrandSettings,
  Treatment,
  Hospital,
  Doctor,
  TreatmentPackage,
  Hotel,
  Testimonial,
  FAQItem,
  JourneyStep,
  WhyIndiaPoint,
  CurrencyCode,
  CurrencyRate
} from './types';

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', rateToUSD: 1 },
  EUR: { code: 'EUR', symbol: '€', rateToUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rateToUSD: 0.78 },
  AED: { code: 'AED', symbol: 'AED ', rateToUSD: 3.67 },
  INR: { code: 'INR', symbol: '₹', rateToUSD: 84.5 },
  SAR: { code: 'SAR', symbol: 'SAR ', rateToUSD: 3.75 },
  OMR: { code: 'OMR', symbol: 'OMR ', rateToUSD: 0.385 },
  KES: { code: 'KES', symbol: 'KSh ', rateToUSD: 129.5 },
  NGN: { code: 'NGN', symbol: '₦', rateToUSD: 1600.0 },
  BDT: { code: 'BDT', symbol: '৳', rateToUSD: 119.5 }
};

export const INITIAL_BRAND_SETTINGS: BrandSettings = {
  brandName: 'VERIVIA HEALTH',
  tagline: 'Your Global Gateway to Trusted Healthcare in India',
  logoUrl: '/verivia-header-logo.svg',
  faviconUrl: '/verivia-header-logo.svg',
  phone: '+91 98710 45890',
  whatsapp: '+919871045890',
  email: 'care@veriviahealth.com',
  address: 'Level 12, Cyber City, Gurugram, Delhi NCR 122002, India',
  websiteUrl: 'https://veriviahealth.com',
  footerText: 'Verivia Health International Patient Services is a dedicated medical-value-travel advisory and patient facilitation network. We connect international patients with accredited Indian healthcare institutions, clinical specialists, and comprehensive concierge care.',
  copyrightText: '© 2026 VERIVIA HEALTH. All rights reserved.',
  primaryCtaText: 'Get a Treatment Plan',
  secondaryCtaText: 'Explore Treatments',
  socialMedia: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    youtube: 'https://youtube.com'
  },
  googleAnalyticsId: 'G-DEMO123456',
  googleTagManagerId: 'GTM-DEMO789',
  disclaimerText: 'VERIVIA HEALTH is an international patient facilitation platform and does not provide direct medical advice, diagnoses, surgical guarantees, or fixed price promises. All indicative treatment costs, durations, and medical details are subject to clinical evaluation, specialist assessment, investigations, and formal hospital confirmation upon review of medical records.',
  privacyPolicyText: 'We respect patient confidentiality under international healthcare data principles. Uploaded medical reports and personal details are encrypted and shared strictly with accredited hospital clinical boards and certified specialists for treatment planning with your explicit consent.',
  termsText: 'By submitting your medical records, you authorise our patient care coordinators to seek clinical opinions and treatment estimates from verified partner hospitals in India. You maintain full autonomy over your healthcare decisions.'
};

export const INITIAL_WHY_INDIA: WhyIndiaPoint[] = [
  {
    id: 'wi-1',
    title: 'Experienced Specialists',
    description: 'Leading specialists trained at premier institutions across the US, UK, and India with extensive case volumes in complex tertiary surgeries.',
    icon: 'Stethoscope',
    displayOrder: 1
  },
  {
    id: 'wi-2',
    title: 'Advanced Hospitals',
    description: 'State-of-the-art facilities with JCI and NABH accreditations, robotic surgery systems (Da Vinci Xi), proton therapy, and 3T MRI diagnostic suites.',
    icon: 'Building2',
    displayOrder: 2
  },
  {
    id: 'wi-3',
    title: 'Comprehensive Treatment Options',
    description: 'Full spectrum of tertiary medical care from multi-organ transplants and complex paediatric cardiac repairs to CAR-T cell oncology.',
    icon: 'Layers',
    displayOrder: 3
  },
  {
    id: 'wi-4',
    title: 'International Patient Services',
    description: 'Dedicated multi-lingual coordinators, expedited medical visas, airport transfers, direct currency facilitation, and customized dietary arrangements.',
    icon: 'Globe',
    displayOrder: 4
  },
  {
    id: 'wi-5',
    title: 'Personalised Treatment Planning',
    description: 'Independent clinical reviews comparing opinions and quotations across leading multi-speciality hospital networks before you travel.',
    icon: 'FileCheck',
    displayOrder: 5
  },
  {
    id: 'wi-6',
    title: 'Transparent Indicative Value',
    description: 'Potential substantial cost advantage for advanced surgeries with zero compromise on clinical safety, implants, and internationally accredited standards.',
    icon: 'ShieldCheck',
    displayOrder: 6
  }
];

export const INITIAL_TREATMENTS: Treatment[] = [
  {
    id: 'cardiac-sciences',
    name: 'Cardiac Sciences',
    slug: 'cardiac-sciences',
    category: 'Surgical & Interventional Cardiology',
    shortDescription: 'Advanced open-heart bypass (CABG), minimally invasive valve replacements, and complex paediatric congenital heart repairs.',
    overview: 'India represents a premier global hub for cardiac surgery, executing over 200,000 heart procedures annually. Pioneering hybrid operating suites, robotic coronary bypass, and transcatheter aortic valve implantation (TAVI) are performed with clinical outcomes comparable to top western centres.',
    conditionsTreated: [
      'Coronary Artery Disease (CAD)',
      'Aortic & Mitral Valve Stenosis/Regurgitation',
      'Atrial Septal Defect (ASD) & VSD',
      'Congestive Heart Failure & Cardiomyopathy',
      'Complex Arrhythmias and Heart Block'
    ],
    procedures: [
      'Coronary Artery Bypass Grafting (CABG / Off-Pump)',
      'Heart Valve Replacement (AVR / MVR)',
      'TAVI / TAVR (Transcatheter Valve)',
      'Paediatric Tetralogy of Fallot Repair',
      'Left Ventricular Assist Device (LVAD) & Heart Transplant'
    ],
    whyConsiderIndia: 'High surgical volumes allow Indian cardiac teams to achieve exceptional precision. Accredited centres utilise FDA-approved stents, mechanical and tissue valves, and cutting-edge intraoperative cardiac imaging.',
    typicalHospitalStay: '5 to 7 days',
    expectedIndiaStay: '14 to 21 days',
    indicativeCostMinUSD: 5200,
    indicativeCostMaxUSD: 9800,
    costInclusions: [
      'Surgeon, anaesthetist, and perfusionist fees',
      'Standard ICU and hospital room stay',
      'Routine intra-operative medications and consumables',
      'Pre-op clearance and initial post-op investigations'
    ],
    costExclusions: [
      'Specialised mechanical valves or transcatheter implants (if selected)',
      'Extended ICU care beyond clinical estimate',
      'Treatment of unforeseen pre-existing comorbidities',
      'Post-discharge extended hotel stay and flights'
    ],
    costNotes: 'Indicative pricing. Actual treatment costs depend on the hospital, doctor, procedure complexity, investigations, implants, length of stay, and other clinical factors.',
    faqs: [
      {
        question: 'What is the recovery period after heart surgery in India?',
        answer: 'Patients typically spend 2 days in the ICU and 4-5 days in the cardiac step-down ward. You can usually walk gently within 3 days. A 14-day total stay in India is recommended before taking your return flight.'
      },
      {
        question: 'Are international implants and stents used?',
        answer: 'Yes, leading JCI-accredited partner hospitals exclusively utilise US FDA and CE approved cardiac stents, prosthetic valves (such as Edwards Lifesciences and Medtronic), and pacemakers.'
      }
    ],
    iconName: 'HeartPulse',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    published: true,
    displayOrder: 1
  },
  {
    id: 'oncology',
    name: 'Comprehensive Oncology',
    slug: 'oncology',
    category: 'Medical, Surgical & Radiation Cancer Care',
    shortDescription: 'Multi-disciplinary cancer care featuring robotic surgical oncology, Proton Beam Therapy, CyberKnife, and CAR-T cell immunotherapies.',
    overview: 'Oncology departments in India feature collaborative tumour boards uniting surgical oncologists, medical oncologists, and radiation physicists. Treatment regimens adhere strictly to NCCN (National Comprehensive Cancer Network) and ESMO international clinical protocols.',
    conditionsTreated: [
      'Breast, Ovarian, and Cervical Cancers',
      'Gastrointestinal & Colorectal Cancers',
      'Head, Neck, and Oral Malignancies',
      'Leukaemia, Lymphoma, and Multiple Myeloma',
      'Brain and Spinal Tumours'
    ],
    procedures: [
      'Robotic Cancer Resection (Da Vinci)',
      'Proton Beam Therapy & TrueBeam STx',
      'Bone Marrow / Stem Cell Transplantation',
      'CAR-T Cell Therapy (NexCAR19)',
      'Hyperthermic Intraperitoneal Chemotherapy (HIPEC)'
    ],
    whyConsiderIndia: 'India is one of only a few Asian countries with operational clinical Proton Beam Therapy centres, providing pinpoint radiation that spares surrounding healthy tissue at a fraction of global costs.',
    typicalHospitalStay: '3 to 10 days depending on surgery/regimen',
    expectedIndiaStay: '21 to 45 days',
    indicativeCostMinUSD: 4500,
    indicativeCostMaxUSD: 16000,
    costInclusions: [
      'Surgical oncology team fees',
      'Histopathology, standard frozen sections, and standard staging imaging',
      'Scheduled ward admission and standard nursing care'
    ],
    costExclusions: [
      'Targeted genomic profiling (e.g., FoundationOne)',
      'Specialised biologic or immunotherapy drugs',
      'Bone marrow donor registry searching fees'
    ],
    costNotes: 'Indicative pricing. Actual treatment costs depend on tumour stage, surgical margins, histology, required cycles, and selected radiation modalities.',
    faqs: [
      {
        question: 'How is the cancer treatment plan formulated?',
        answer: 'Each case is evaluated by a multi-speciality Tumour Board including surgical, medical, and radiation specialists to formulate an evidence-based tailored protocol.'
      }
    ],
    iconName: 'Activity',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    published: true,
    displayOrder: 2
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics & Joint Replacement',
    slug: 'orthopaedics',
    category: 'Robotic Arthroplasty & Sports Medicine',
    shortDescription: 'Computer-navigated and Mako robotic total knee and hip replacements, arthroscopy, and complex revision surgeries.',
    overview: 'Specialised Indian orthopaedic institutes perform thousands of joint replacements every month with zero-infection protocols and rapid rehabilitation pathways allowing patients to walk within 24 hours of surgery.',
    conditionsTreated: [
      'Severe Osteoarthritis of Knee and Hip',
      'Avascular Necrosis (AVN) of Femoral Head',
      'ACL/PCL and Meniscal Tears',
      'Failed Previous Joint Replacements',
      'Complex Pelvic Fractures & Deformities'
    ],
    procedures: [
      'Robotic Total Knee Replacement (Mako / Rosa)',
      'Bilateral Knee Arthroplasty in Single Sitting',
      'Total Hip Arthroplasty (Ceramic-on-Ceramic)',
      'Shoulder and Reverse Shoulder Replacement',
      'Arthroscopic Ligament Reconstruction'
    ],
    whyConsiderIndia: 'High implant durability with US FDA-approved titanium and cobalt-chromium joints from Stryker, Zimmer Biomet, and Smith & Nephew coupled with robotic alignment for natural kinematics.',
    typicalHospitalStay: '3 to 5 days',
    expectedIndiaStay: '14 to 18 days',
    indicativeCostMinUSD: 4200,
    indicativeCostMaxUSD: 8500,
    costInclusions: [
      'FDA-approved primary joint implant components',
      'Orthopaedic surgeon & anaesthesia team charges',
      'In-hospital physiotherapy and mobility training',
      'Post-operative imaging and initial mobility aids'
    ],
    costExclusions: [
      'Custom 3D-printed implants for complex revisions',
      'Extended outpatient physiotherapy after hospital discharge'
    ],
    costNotes: 'Indicative pricing. Actual treatment costs depend on unilateral vs bilateral, robotic vs manual navigation, and implant material selection.',
    faqs: [
      {
        question: 'When can I travel back home after joint replacement?',
        answer: 'Most patients fly home comfortably 10 to 14 days after surgery, following suture removal and clearance by the orthopaedic surgeon.'
      }
    ],
    iconName: 'Shield',
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    published: true,
    displayOrder: 3
  },
  {
    id: 'neurosciences',
    name: 'Neurosciences & Spine Surgery',
    slug: 'neurosciences',
    category: 'Neurosurgery, Brain & Complex Spine',
    shortDescription: 'Minimally invasive spine surgeries, scoliosis correction, brain aneurysm coiling, and awake craniotomy with intraoperative neuro-monitoring.',
    overview: 'Equipped with neuro-navigation suites, intraoperative 3T MRI (BrainSuite), and micro-surgical instruments, Indian neurosurgical centres offer microscopic and robotic precision for brain tumours and spinal disorders.',
    conditionsTreated: [
      'Brain Tumours (Gliomas, Meningiomas, Pituitary)',
      'Herniated Discs and Spinal Canal Stenosis',
      'Cervical Spondylotic Myelopathy',
      'Scoliosis and Adolescent Spinal Deformities',
      'Parkinson’s Disease & Intractable Tremors'
    ],
    procedures: [
      'Minimally Invasive Spine Surgery (MISS) & Microdiscectomy',
      'Spinal Fusion (TLIF / ALIF) & Artificial Disc Replacement',
      'Awake Craniotomy with Brain Mapping',
      'Deep Brain Stimulation (DBS)',
      'Endovascular Coiling for Cerebral Aneurysms'
    ],
    whyConsiderIndia: 'Exceptional neurosurgical talent and rigorous intraoperative neuro-monitoring (IONM) safeguarding spinal cord and neurological pathways.',
    typicalHospitalStay: '4 to 7 days',
    expectedIndiaStay: '14 to 21 days',
    indicativeCostMinUSD: 5500,
    indicativeCostMaxUSD: 11000,
    costInclusions: [
      'Neurosurgery and neuro-anaesthesia charges',
      'Intraoperative neuromonitoring and navigation usage',
      'ICU and step-down care with routine medication'
    ],
    costExclusions: [
      'Spinal hardware/screws beyond standard counts',
      'DBS neurostimulator battery implants (Medtronic)'
    ],
    costNotes: 'Indicative pricing. Actual treatment costs depend on the level of spinal fusion or tumour complexity.',
    faqs: [
      {
        question: 'Is minimally invasive spine surgery safe for older patients?',
        answer: 'Yes, smaller incisions and muscle-sparing techniques reduce blood loss and accelerate ambulation, making MISS highly suitable for seniors.'
      }
    ],
    iconName: 'Cpu',
    coverImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    published: true,
    displayOrder: 4
  },
  {
    id: 'organ-transplant',
    name: 'Organ Transplant Sciences',
    slug: 'organ-transplant',
    category: 'Living-Donor Liver, Kidney & Multi-Organ Transplants',
    shortDescription: 'High-success living-donor liver and kidney transplants with comprehensive immunological matching and dedicated post-transplant clean-air ICUs.',
    overview: 'India conducts some of the largest volumes of living-donor liver and kidney transplant surgeries in the world, achieving survival and graft outcomes exceeding 95% under strict statutory authorization committee reviews.',
    conditionsTreated: [
      'End-Stage Renal Disease (ESRD)',
      'End-Stage Liver Cirrhosis & Acute Liver Failure',
      'Biliary Atresia in Paediatrics',
      'Hepatocellular Carcinoma (within Milan criteria)'
    ],
    procedures: [
      'Living-Donor Liver Transplantation (Adult & Paediatric)',
      'Living-Donor Kidney Transplantation',
      'ABO-Incompatible (Blood Group Mismatched) Transplants',
      'Combined Kidney-Pancreas Transplantation'
    ],
    whyConsiderIndia: 'Pioneers in high-risk ABO-incompatible living donor transplants, using state-of-the-art plasmapheresis and immunoadsorption protocols.',
    typicalHospitalStay: '10 to 18 days (Recipient), 5 to 7 days (Donor)',
    expectedIndiaStay: '45 to 60 days',
    indicativeCostMinUSD: 12000,
    indicativeCostMaxUSD: 29000,
    costInclusions: [
      'Pre-op donor and recipient surgical evaluations',
      'Simultaneous recipient and donor operations',
      'Specialised HEPA-filtered transplant ICU stays'
    ],
    costExclusions: [
      'Statutory legal/embassy document translation and notarisation',
      'Long-term immunosuppressive maintenance medication post-discharge'
    ],
    costNotes: 'Living donor must be a legally recognized relative according to statutory medical visa and transplant regulations in India.',
    faqs: [
      {
        question: 'Can an international patient receive an organ from an Indian donor?',
        answer: 'No. Under Indian law (THOA Act), international patients must bring their own genetically or emotionally related living donor from their home country.'
      }
    ],
    iconName: 'RefreshCw',
    coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    published: true,
    displayOrder: 5
  },
  {
    id: 'fertility-ivf',
    name: 'Fertility & Reproductive Medicine',
    slug: 'fertility-ivf',
    category: 'Advanced ART, ICSI & Reproductive Genetics',
    shortDescription: 'Advanced in-vitro fertilisation, ICSI, pre-implantation genetic testing (PGT-A), and fertility preservation with high clinical pregnancy rates.',
    overview: 'Modern reproductive centres in India leverage advanced embryology laboratories with time-lapse incubators, laser-assisted hatching, and genetic diagnostics to help international couples build their families.',
    conditionsTreated: [
      'Unexplained Infertility',
      'Tubal Blockages & Severe Endometriosis',
      'Male Factor Infertility & Low Sperm Motility',
      'Advanced Maternal Age & Diminished Ovarian Reserve',
      'Recurrent Implantation Failure'
    ],
    procedures: [
      'IVF / ICSI (Intracytoplasmic Sperm Injection)',
      'Pre-Implantation Genetic Testing for Aneuploidy (PGT-A / PGT-M)',
      'Blastocyst Culture & Vitrification',
      'Micro-TESE for Severe Male Infertility'
    ],
    whyConsiderIndia: 'High success rates adhering to strict ICMR ethics, transparent embryology practices, and advanced genetic testing capabilities.',
    typicalHospitalStay: 'Day care / Outpatient visits',
    expectedIndiaStay: '18 to 22 days per cycle',
    indicativeCostMinUSD: 3000,
    indicativeCostMaxUSD: 5800,
    costInclusions: [
      'Ovarian stimulation monitoring & egg pick-up',
      'Standard ICSI laboratory procedures',
      'Single fresh or frozen blastocyst transfer'
    ],
    costExclusions: [
      'Hormonal stimulation injection medications (variable dosage)',
      'PGT-A genetic biopsy per embryo',
      'Long-term cryopreservation annual storage fees'
    ],
    costNotes: 'Indicative pricing. Actual cycle costs vary depending on medication requirements, donor gamete regulations, and genetic screening.',
    faqs: [
      {
        question: 'How long does a couple need to stay in India for an IVF cycle?',
        answer: 'Usually 18-21 days for stimulation, monitoring, egg retrieval, and embryo transfer, or it can be split into two short trips.'
      }
    ],
    iconName: 'Users',
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    published: true,
    displayOrder: 6
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Medanta - The Medicity',
    slug: 'medanta-the-medicity-gurugram',
    city: 'Gurugram (Delhi NCR)',
    state: 'Haryana',
    country: 'India',
    address: 'Sector 38, Gurugram, Delhi NCR, 122001, India',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Medanta is one of India’s largest multi-super-speciality institutes, founded by renowned cardiac surgeon Dr. Naresh Trehan. Spanning 43 acres with 1,250 beds and over 45 operation theatres, it houses dedicated institutes for Heart, Cancer, Neurosciences, Bone & Joint, and Liver Transplants.',
    beds: 1250,
    establishedYear: 2009,
    accreditation: ['JCI Accredited', 'NABH Certified', 'NABL Accredited'],
    specialities: ['Cardiac Sciences', 'Liver Transplantation', 'Neurosciences', 'Robotic Surgery', 'Oncology'],
    treatments: ['cardiac-sciences', 'oncology', 'orthopaedics', 'neurosciences', 'organ-transplant'],
    facilities: [
      '45 Modular Operation Theatres',
      'CyberKnife VSI robotic radiosurgery',
      'Intraoperative 3T MRI BrainSuite',
      'Dedicated International Patient Lounge',
      'Multi-cuisine International Cafeteria'
    ],
    internationalServices: [
      'Complimentary Airport Pick-up & Drop',
      'Dedicated Multi-lingual Relationship Managers (Arabic, French, Russian, Swahili)',
      'Expedited Medical Visa Invitation Letter Support',
      'Direct SIM Card & Currency Exchange Assistance',
      'Tele-consultation Pre & Post Discharge'
    ],
    languages: ['English', 'Arabic', 'French', 'Russian', 'Hindi', 'Bengali'],
    airportDistance: '18 km (25 mins drive from Indira Gandhi International Airport, New Delhi)',
    website: 'https://www.medanta.org',
    phone: '+91 124 4141414',
    email: 'international@medanta.org',
    published: true,
    displayOrder: 1,
    featured: true,
    seoTitle: 'Medanta The Medicity Gurugram - International Patient Healthcare',
    seoDescription: 'Explore Medanta The Medicity Delhi NCR: 1,250 bed multi-speciality hospital with JCI accreditation and world-renowned specialists.'
  },
  {
    id: 'hosp-2',
    name: 'Apollo Hospitals, Greams Road',
    slug: 'apollo-hospitals-chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    address: '21 Greams Lane, Thousand Lights, Chennai, 600006, India',
    logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The flagship hospital of the Apollo Group, Apollo Chennai has been a pioneer in contemporary healthcare in Asia since 1983. Renowned globally for complex cardiac procedures, cutting-edge organ transplants, and advanced robotic oncology.',
    beds: 600,
    establishedYear: 1983,
    accreditation: ['JCI Accredited', 'NABH Certified', 'ISO 9001'],
    specialities: ['Cardiology', 'Oncology', 'Organ Transplants', 'Neurosurgery', 'Orthopaedics'],
    treatments: ['cardiac-sciences', 'oncology', 'organ-transplant', 'orthopaedics', 'neurosciences'],
    facilities: [
      'Proton Cancer Centre (South Asia’s First)',
      'Da Vinci Robotic Surgical Suite',
      'Dedicated Paediatric Intensive Care Unit',
      'Private Inpatient Suites with Nurse Call Alert'
    ],
    internationalServices: [
      '24/7 International Desk & Interpreter Services',
      'Hotel & Service Apartment Booking Assistance',
      'Liaison with Embasies & Foreign Missions',
      'Post-Treatment Follow-up Tele-Medicine'
    ],
    languages: ['English', 'Arabic', 'French', 'Tamil', 'Hindi'],
    airportDistance: '15 km from Chennai International Airport (MAA)',
    website: 'https://www.apollohospitals.com',
    phone: '+91 44 28290200',
    email: 'international_chennai@apollohospitals.com',
    published: true,
    displayOrder: 2,
    featured: true,
    seoTitle: 'Apollo Hospitals Chennai - Pioneer in Asian Tertiary Medicine',
    seoDescription: 'Apollo Hospitals Chennai flagship centre offering JCI care, Proton Beam Therapy, and world-class surgical outcomes.'
  },
  {
    id: 'hosp-3',
    name: 'Fortis Memorial Research Institute (FMRI)',
    slug: 'fortis-memorial-research-institute-gurugram',
    city: 'Gurugram (Delhi NCR)',
    state: 'Haryana',
    country: 'India',
    address: 'Sector 44, Opposite HUDA City Centre, Gurugram, 122002, India',
    logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'FMRI is an internationally acclaimed quaternary healthcare centre known as the "Next Generation Hospital". Ranked among the top technologically advanced hospitals worldwide, featuring state-of-the-art diagnostic and robotic surgical modalities.',
    beds: 1000,
    establishedYear: 2013,
    accreditation: ['JCI Accredited', 'NABH Certified', 'NABL Certified'],
    specialities: ['Paediatric Cardiology', 'Haematology & BMT', 'Neurosciences', 'Robotic Joint Replacement'],
    treatments: ['cardiac-sciences', 'oncology', 'neurosciences', 'orthopaedics', 'organ-transplant'],
    facilities: [
      'Two modular hybrid operating rooms',
      '3-Tesla Digital Broadband MRI',
      'Linear accelerators with stereotactic capabilities',
      'Comprehensive Blood Bank with apheresis'
    ],
    internationalServices: [
      'International Patient Executive Support',
      'Customized Halal & Continental Meals',
      'Foreign Exchange Counter on-site',
      'Local Sightseeing & Concierge Care'
    ],
    languages: ['English', 'Arabic', 'Russian', 'French', 'Hindi'],
    airportDistance: '16 km from Indira Gandhi International Airport (DEL)',
    website: 'https://www.fortishealthcare.com',
    phone: '+91 124 4962200',
    email: 'fmri.international@fortishealthcare.com',
    published: true,
    displayOrder: 3,
    featured: true,
    seoTitle: 'Fortis Memorial Research Institute Gurugram - Quaternary Care',
    seoDescription: 'FMRI Gurugram: Next-generation healthcare with robotic surgery, JCI accreditation, and specialised care.'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Naresh Trehan',
    slug: 'dr-naresh-trehan',
    designation: 'Chairman & Chief Cardiac Surgeon',
    speciality: 'Cardiovascular & Cardiothoracic Surgery',
    subSpeciality: 'Off-Pump CABG, Robotic Cardiac Surgery, Heart Transplants',
    hospitalId: 'hosp-1',
    hospitalName: 'Medanta - The Medicity',
    experienceYears: 42,
    education: [
      'MBBS - King George’s Medical University, Lucknow',
      'Diplomate - American Board of Surgery, USA',
      'Diplomate - American Board of Cardiothoracic Surgery, USA'
    ],
    certifications: ['Padma Bhushan & Padma Shri recipient', 'Former President, International Society for Minimally Invasive Cardiac Surgery'],
    biography: 'Dr. Naresh Trehan is a world-renowned cardiovascular surgeon with over 48,000 successful open-heart operations performed. After practising at New York University Medical Center, he returned to India to establish premier heart institutes offering international-standard care.',
    expertise: [
      'Minimally Invasive Coronary Artery Bypass',
      'Aortic Aneurysm Repair',
      'Complex Valve Repair and Replacement',
      'Heart Failure Surgery & Ventricular Remodeling'
    ],
    procedures: [
      'Beating Heart CABG',
      'Aortic Valve Replacement (AVR)',
      'Mitral Valve Repair (MVR)',
      'Total Arterial Revascularisation'
    ],
    languages: ['English', 'Hindi', 'Punjabi'],
    photograph: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    consultationOptions: ['Online Video Assessment', 'Hospital In-Person Review'],
    relatedTreatments: ['cardiac-sciences'],
    published: true,
    displayOrder: 1,
    featured: true
  },
  {
    id: 'doc-2',
    name: 'Dr. Arvinder Singh Soin',
    slug: 'dr-arvinder-singh-soin',
    designation: 'Chairman, Liver Transplantation and Regenerative Medicine',
    speciality: 'Hepatobiliary & Liver Transplantation',
    subSpeciality: 'Living Donor Liver Transplantation, Paediatric Liver Transplant',
    hospitalId: 'hosp-1',
    hospitalName: 'Medanta - The Medicity',
    experienceYears: 34,
    education: [
      'MBBS & MS - All India Institute of Medical Sciences (AIIMS), New Delhi',
      'FRCS - Royal College of Surgeons of Edinburgh and Glasgow, UK',
      'Liver Transplant Fellowship - University of Cambridge & King’s College, London'
    ],
    certifications: ['Padma Shri Recipient', 'Over 3,500 Living Donor Liver Transplants with 95% success rate'],
    biography: 'Dr. A.S. Soin pioneered living-donor liver transplantation in India. His surgical team conducts over 25 liver transplants every month with clinical outcomes benchmarked alongside Cambridge and King’s College London.',
    expertise: [
      'Adult Living Donor Liver Transplants',
      'Paediatric & Neonatal Liver Transplants',
      'Complex Biliary Strictures & Resections',
      'Liver Cancer (HCC) Surgery'
    ],
    procedures: [
      'Living-Donor Liver Transplantation',
      'Extended Hepatectomy for Tumours',
      'Portal Hypertension Shunt Surgery'
    ],
    languages: ['English', 'Hindi'],
    photograph: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
    consultationOptions: ['Online Video Assessment', 'Donor Eligibility Assessment'],
    relatedTreatments: ['organ-transplant'],
    published: true,
    displayOrder: 2,
    featured: true
  },
  {
    id: 'doc-3',
    name: 'Dr. Ashok Rajgopal',
    slug: 'dr-ashok-rajgopal',
    designation: 'Group Chairman, Institute of Musculoskeletal Operations',
    speciality: 'Orthopaedics & Joint Reconstruction',
    subSpeciality: 'Robotic Total Knee Arthroplasty, Revision Hip Surgery',
    hospitalId: 'hosp-1',
    hospitalName: 'Medanta - The Medicity',
    experienceYears: 38,
    education: [
      'MBBS - Pune University',
      'MS (Orthopaedics) - AIIMS, New Delhi',
      'MCh (Ortho) - University of Liverpool, UK',
      'FRCS - Royal College of Surgeons, UK'
    ],
    certifications: ['Padma Shri Awardee', 'Honorary Surgeon to the President of India', 'Over 35,000 Knee Replacements'],
    biography: 'Dr. Ashok Rajgopal is an internationally celebrated knee surgeon who was among the earliest pioneers of computer-navigated and robotic joint replacement in Asia. He has contributed directly to the patent designs of modern knee prosthesis systems.',
    expertise: [
      'Robotic Assisted Total Knee Replacement',
      'Bilateral Simultaneous Knee Replacement',
      'Complex Revision Arthroplasty',
      'Sports Ligament Reconstruction'
    ],
    procedures: [
      'Mako Robotic Knee Arthroplasty',
      'Minimally Invasive Hip Replacement',
      'Arthroscopic Cartilage Restoration'
    ],
    languages: ['English', 'Hindi'],
    photograph: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
    consultationOptions: ['Video Tele-Review', 'Hospital Examination'],
    relatedTreatments: ['orthopaedics'],
    published: true,
    displayOrder: 3,
    featured: true
  }
];

export const INITIAL_PACKAGES: TreatmentPackage[] = [
  {
    id: 'pkg-1',
    packageName: 'Comprehensive Off-Pump CABG (Heart Bypass)',
    treatmentId: 'cardiac-sciences',
    treatmentName: 'Cardiac Sciences',
    hospitalId: 'hosp-1',
    hospitalName: 'Medanta - The Medicity',
    doctorId: 'doc-1',
    doctorName: 'Dr. Naresh Trehan',
    minPriceUSD: 5500,
    maxPriceUSD: 7800,
    hospitalStayDays: '6 days (2 ICU + 4 Ward)',
    icuStayDays: '2 days',
    estimatedIndiaStayDays: '16 days total',
    inclusions: [
      'Surgeon, anaesthetist & surgical assistant fees',
      '6 days hospital accommodation (private room + ICU)',
      'Standard heart-lung bypass machine consumables & standard sutures',
      'Routine pre-op cardiac clearance diagnostics and blood investigations',
      'Post-op echo, chest X-rays, and standard recovery medication'
    ],
    exclusions: [
      'Any special intra-aortic balloon pump (IABP) if clinically required',
      'Extended ICU duration beyond clinical standard',
      'Post-discharge hotel stay and commercial flights'
    ],
    notes: 'Indicative estimate based on single or multi-vessel beating-heart bypass. Final quotation issued following angiography film review.',
    validity: 'Valid until December 2026',
    published: true,
    displayOrder: 1
  },
  {
    id: 'pkg-2',
    packageName: 'Robotic Unilateral Total Knee Replacement',
    treatmentId: 'orthopaedics',
    treatmentName: 'Orthopaedics & Joint Replacement',
    hospitalId: 'hosp-1',
    hospitalName: 'Medanta - The Medicity',
    doctorId: 'doc-3',
    doctorName: 'Dr. Ashok Rajgopal',
    minPriceUSD: 4400,
    maxPriceUSD: 5800,
    hospitalStayDays: '4 days in private room',
    icuStayDays: 'Not normally required',
    estimatedIndiaStayDays: '14 days total',
    inclusions: [
      'FDA-approved high-flexion cobalt-chromium knee prosthesis',
      'Robotic precision surgical suite charges',
      'Orthopaedic surgeon and anaesthesia team charges',
      'In-hospital rehabilitation & physical therapy sessions',
      'Standard post-operative imaging and knee brace'
    ],
    exclusions: [
      'Custom 3D-printed titanium implants',
      'Comorbid ICU monitoring if non-orthopaedic emergency arises'
    ],
    notes: 'Bilateral knee replacement in single sitting available as an upgraded indicative package ($7,500 - $8,800).',
    validity: 'Valid until December 2026',
    published: true,
    displayOrder: 2
  },
  {
    id: 'pkg-3',
    packageName: 'Living Donor Liver Transplant Evaluation & Surgery',
    treatmentId: 'organ-transplant',
    treatmentName: 'Organ Transplant Sciences',
    hospitalId: 'hosp-1',
    hospitalName: 'Medanta - The Medicity',
    doctorId: 'doc-2',
    doctorName: 'Dr. Arvinder Singh Soin',
    minPriceUSD: 24000,
    maxPriceUSD: 28500,
    hospitalStayDays: '21 days (Recipient) + 7 days (Donor)',
    icuStayDays: '7 days Hepa-filtered transplant ICU',
    estimatedIndiaStayDays: '45 to 60 days',
    inclusions: [
      'Comprehensive donor and recipient pre-transplant workup',
      'Surgical fees for both donor hepatectomy and recipient implantation',
      'Dedicated isolation transplant ICU and private room stay',
      'Routine immunosuppressive therapy during inpatient admission',
      'Weekly post-discharge outpatient clinics for 4 weeks'
    ],
    exclusions: [
      'Statutory government committee legal documentation and translation',
      'Specialised anti-rejection monoclonal antibodies (e.g., Thymoglobulin)',
      'Unforeseen infections requiring prolonged advanced antimicrobials'
    ],
    notes: 'Legal compliance with Indian Transplantation of Human Organs Act (THOA) mandatory. Donor must be a confirmed biological or legally approved relative.',
    validity: 'Valid until December 2026',
    published: true,
    displayOrder: 3
  }
];

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'The Westin Gurgaon, New Delhi',
    slug: 'the-westin-gurgaon',
    stars: 5,
    city: 'Gurugram (Delhi NCR)',
    location: 'Number 1, MG Road, Sector 29, Gurugram',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    ],
    distanceFromHospital: '4.5 km from Medanta / FMRI (approx. 10 mins)',
    distanceFromAirport: '14 km from Indira Gandhi International Airport (20 mins)',
    startingPricePerNightUSD: 140,
    amenities: [
      'Wheelchair accessible elevators & rooms',
      'Customised patient recovery dietary options (Low sodium, Halal, Diabetic)',
      '24-hour room service & in-house doctor on call',
      'Spacious family suites with kitchenette',
      'High-speed Wi-Fi and international satellite TV channels'
    ],
    familyFriendly: true,
    wheelchairAccessible: true,
    longStayAvailable: true,
    description: 'A luxurious 5-star hotel equipped for recovering international medical travellers and accompanying families. Features peaceful grounds, sound-proofed suites, and dedicated concierge transport directly to partner hospitals.',
    associatedHospitalIds: ['hosp-1', 'hosp-3'],
    contactPhone: '+91 124 4977777',
    bookingNotes: 'Special discounted medical long-stay tariffs (exceeding 14 nights) available through our patient coordination desk.',
    published: true,
    displayOrder: 1
  },
  {
    id: 'hotel-2',
    name: 'Lemon Tree Premier, City Center',
    slug: 'lemon-tree-premier-gurugram',
    stars: 4,
    city: 'Gurugram (Delhi NCR)',
    location: 'Sector 29, City Center, Gurugram',
    coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
    ],
    distanceFromHospital: '3.8 km from Medanta The Medicity',
    distanceFromAirport: '16 km from Indira Gandhi International Airport',
    startingPricePerNightUSD: 68,
    amenities: [
      'Orthopaedic mattress support in patient rooms',
      'Wheelchair access throughout property',
      'Daily laundry and housekeeping service',
      'Doctor on-call & tie-ups for emergency ambulance transit',
      'High-speed internet for remote family communication'
    ],
    familyFriendly: true,
    wheelchairAccessible: true,
    longStayAvailable: true,
    description: 'An upscale 4-star property offering exceptional hygiene, comfort, and attentive service for medical guests seeking practical and affordable accommodation close to Gurugram healthcare hubs.',
    associatedHospitalIds: ['hosp-1', 'hosp-3'],
    contactPhone: '+91 124 4423232',
    bookingNotes: 'Kitchenette suites available upon advance request for long-stay patient families.',
    published: true,
    displayOrder: 2
  },
  {
    id: 'hotel-3',
    name: 'Taj Coromandel, Nungambakkam',
    slug: 'taj-coromandel-chennai',
    stars: 5,
    city: 'Chennai',
    location: '37, Mahatma Gandhi Rd, Nungambakkam, Chennai',
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'
    ],
    distanceFromHospital: '2.5 km from Apollo Hospitals Greams Road (7 mins)',
    distanceFromAirport: '14 km from Chennai International Airport',
    startingPricePerNightUSD: 130,
    amenities: [
      'Heritage luxury with 24/7 dedicated butler service',
      'Customised therapeutic and international dietary menus',
      'Disabled-friendly suites with wide doorways and grab rails',
      'Quiet courtyards ideal for gentle post-surgical recuperation'
    ],
    familyFriendly: true,
    wheelchairAccessible: true,
    longStayAvailable: true,
    description: 'Chennai’s premier luxury landmark, situated in immediate proximity to Apollo Hospitals. Offers serene surroundings and world-renowned Taj hospitality tailored to international medical travellers.',
    associatedHospitalIds: ['hosp-2'],
    contactPhone: '+91 44 66002827',
    bookingNotes: 'Includes dedicated airport chauffeured transit when booked via Verivia Health patient services.',
    published: true,
    displayOrder: 3
  }
];

export const INITIAL_JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Share Your Medical Needs',
    description: 'Submit your clinical enquiry along with recent investigations, doctor prescriptions, and medical history through our secure portal.',
    icon: 'FileText'
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Clinical Review & Second Opinions',
    description: 'Our medical panel coordinates with senior department heads across leading accredited hospital centres in India to evaluate your case.',
    icon: 'Stethoscope'
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Receive Tailored Treatment Plan',
    description: 'Compare comprehensive treatment options, surgeon credentials, hospital choices, indicative stay requirements, and transparent pricing estimates.',
    icon: 'FileSpreadsheet'
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Medical Visa & Travel Planning',
    description: 'Receive formal hospital visa invitation letters for yourself and your medical attendants, with dedicated embassy guidance.',
    icon: 'Plane'
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Airport Arrival & Concierge Transfer',
    description: 'Our relationship manager receives you at the arrival terminal with dedicated vehicle transit, mobile SIM cards, and immediate currency assistance.',
    icon: 'Car'
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Hospital Admission & Surgery',
    description: 'Priority hospital admission, language interpreter support, personal care coordination, and continuous clinical updates provided to your family.',
    icon: 'Activity'
  },
  {
    id: 'step-7',
    stepNumber: 7,
    title: 'Recuperation & Comfortable Stay',
    description: 'Transition smoothly to verified post-discharge recuperation accommodation with nurse-on-call availability and dietary arrangements.',
    icon: 'Home'
  },
  {
    id: 'step-8',
    stepNumber: 8,
    title: 'Safe Journey Home & Tele-Follow-up',
    description: 'Fit-to-fly clinical certification, complete medical dossiers, and scheduled digital follow-up consultations with your treating specialist in India.',
    icon: 'HeartHandshake'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    patientName: 'Amina K. (Family)',
    country: 'Nairobi, Kenya',
    treatment: 'Paediatric Cardiac Surgery',
    hospital: 'Fortis Memorial Research Institute',
    story: 'When our 4-year-old son was diagnosed with a complex ventricular septal defect, we were overwhelmed. Verivia Health connected us with the paediatric cardiology board within 48 hours. From our arrival at Delhi airport to our son’s successful operation and recovery, we were supported with genuine empathy and professional care.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    date: 'February 2026',
    published: true,
    displayOrder: 1
  },
  {
    id: 'test-2',
    patientName: 'Tariq Al-Mansoor',
    country: 'Muscat, Oman',
    treatment: 'Robotic Bilateral Knee Replacement',
    hospital: 'Medanta - The Medicity',
    doctor: 'Dr. Ashok Rajgopal',
    story: 'I had been in severe arthritic pain for over five years and could barely walk stairs. The transparency in pricing, the Mako robotic precision, and the dedicated Arabic-speaking care coordinator made the entire medical travel experience seamless. I was walking with assistance on the very next morning.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    date: 'January 2026',
    published: true,
    displayOrder: 2
  },
  {
    id: 'test-3',
    patientName: 'David & Sarah M.',
    country: 'Manchester, United Kingdom',
    treatment: 'Complex Spine Decompression & Fusion',
    hospital: 'Apollo Hospitals Chennai',
    story: 'Facing an 18-month waiting list in the UK while my mobility rapidly deteriorated was terrifying. Seeking private treatment in India under an internationally accredited JCI hospital gave me back my active life. The standards of clinical hygiene and the expertise of the neuro-spine team were second to none.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    date: 'November 2025',
    published: true,
    displayOrder: 3
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I obtain an Indian Medical Visa (MED Visa)?',
    answer: 'Once you choose your hospital and treatment plan, the accredited hospital issues a formal Medical Visa Invitation Letter referencing your passport details. You submit this to the Indian Embassy or apply through the Indian e-Medical Visa online portal. You can also bring up to two medical attendants (MEDX Visa). Our international team provides step-by-step guidance.',
    category: 'Travel & Visa',
    displayOrder: 1,
    published: true
  },
  {
    id: 'faq-2',
    question: 'Are the doctors and surgeons in India internationally certified?',
    answer: 'Yes. Senior department heads and lead surgeons at premier Indian institutions typically hold dual international qualifications, including FRCS (UK), American Board certifications, or advanced clinical fellowships from world-renowned teaching hospitals in the United States, United Kingdom, Europe, and Australia.',
    category: 'Medical Quality',
    displayOrder: 2,
    published: true
  },
  {
    id: 'faq-3',
    question: 'How does indicative pricing work, and will there be unexpected costs?',
    answer: 'We provide an itemised Indicative Treatment Estimate based on your submitted diagnostic files and specialist review. It clearly delineates surgeon fees, bed category, medications, and standard implants. However, because clinical care must respond to individual physiology, the final invoice is determined by the hospital based on actual investigations, duration of stay, and implant choices.',
    category: 'Costs & Billing',
    displayOrder: 3,
    published: true
  },
  {
    id: 'faq-4',
    question: 'Who will help me with language barriers when I arrive in India?',
    answer: 'All doctors and clinical staff in top-tier private Indian hospitals speak fluent English. Additionally, our partner hospitals provide dedicated in-house multi-lingual language interpreters covering Arabic, French, Russian, Swahili, Bengali, and Uzbek throughout your consultations, admission, and recovery.',
    category: 'Patient Services',
    displayOrder: 4,
    published: true
  },
  {
    id: 'faq-5',
    question: 'What happens if I require medical follow-up after returning to my home country?',
    answer: 'Before your discharge, you are provided with a comprehensive English discharge dossier, operative notes, diagnostic imagery on CD/digital portal, and medication instructions. We coordinate scheduled video tele-consultations between you, your local family physician, and your treating specialist in India to monitor your ongoing healing.',
    category: 'Post-Treatment Care',
    displayOrder: 5,
    published: true
  }
];

export const INITIAL_SUPPORT_SERVICES = [
  {
    title: 'Medical Record Review',
    description: 'Complimentary preliminary case evaluation by clinical coordinators and specialist panels.',
    icon: 'FileText'
  },
  {
    title: 'Hospital & Doctor Selection',
    description: 'Unbiased comparison of accredited healthcare institutions, surgical credentials, and bed availability.',
    icon: 'Building2'
  },
  {
    title: 'Transparent Treatment Estimates',
    description: 'Detailed indicative cost breakdowns with itemised inclusions, exclusions, and duration expectations.',
    icon: 'Receipt'
  },
  {
    title: 'Medical Visa Assistance',
    description: 'Expedited hospital visa invitation letters and comprehensive consular documentation support.',
    icon: 'ShieldAlert'
  },
  {
    title: 'Airport Transfer & SIM Cards',
    description: 'Personal chauffeur reception at the arrival terminal with dedicated communication and connectivity setup.',
    icon: 'Car'
  },
  {
    title: 'Multi-Lingual Interpreters',
    description: 'On-ground assistance in Arabic, French, Russian, Swahili, and other regional languages.',
    icon: 'Languages'
  },
  {
    title: 'Family Accommodation & Stay',
    description: 'Vetted partner hotels and service apartments in close proximity to hospitals with medical rates.',
    icon: 'Home'
  },
  {
    title: 'Post-Discharge Follow-up',
    description: 'Seamless tele-consultations with your operating surgeon and structured recovery tracking.',
    icon: 'HeartHandshake'
  }
];
