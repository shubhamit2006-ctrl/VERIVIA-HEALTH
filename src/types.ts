export interface BrandSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  websiteUrl: string;
  footerText: string;
  copyrightText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  disclaimerText: string;
  privacyPolicyText: string;
  termsText: string;
}

export interface WhyIndiaPoint {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  overview: string;
  conditionsTreated: string[];
  procedures: string[];
  whyConsiderIndia: string;
  typicalHospitalStay: string;
  expectedIndiaStay: string;
  indicativeCostMinUSD: number;
  indicativeCostMaxUSD: number;
  costInclusions: string[];
  costExclusions: string[];
  costNotes: string;
  faqs: { question: string; answer: string }[];
  iconName: string;
  coverImage: string;
  published: boolean;
  displayOrder: number;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  address: string;
  logoUrl: string;
  coverImage: string;
  gallery: string[];
  description: string;
  beds: number;
  establishedYear: number;
  accreditation: string[]; // e.g. JCI, NABH, NABL
  specialities: string[];
  treatments: string[]; // treatment IDs or slugs
  facilities: string[];
  internationalServices: string[];
  languages: string[];
  airportDistance: string;
  website: string;
  phone: string;
  email: string;
  published: boolean;
  displayOrder: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  designation: string;
  speciality: string;
  subSpeciality: string;
  hospitalId: string;
  hospitalName: string;
  experienceYears: number;
  education: string[];
  certifications: string[];
  biography: string;
  expertise: string[];
  procedures: string[];
  languages: string[];
  photograph: string;
  consultationOptions: string[]; // e.g. "Online Video", "In-Person in India"
  relatedTreatments: string[]; // treatment IDs
  published: boolean;
  displayOrder: number;
  featured: boolean;
}

export interface TreatmentPackage {
  id: string;
  packageName: string;
  treatmentId: string;
  treatmentName: string;
  hospitalId: string;
  hospitalName: string;
  doctorId?: string;
  doctorName?: string;
  minPriceUSD: number;
  maxPriceUSD: number;
  hospitalStayDays: string;
  icuStayDays: string;
  estimatedIndiaStayDays: string;
  inclusions: string[];
  exclusions: string[];
  notes: string;
  validity: string;
  published: boolean;
  displayOrder: number;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  stars: number; // 3, 4, 5
  city: string;
  location: string;
  coverImage: string;
  gallery: string[];
  distanceFromHospital: string;
  distanceFromAirport: string;
  startingPricePerNightUSD: number;
  amenities: string[];
  familyFriendly: boolean;
  wheelchairAccessible: boolean;
  longStayAvailable: boolean;
  description: string;
  associatedHospitalIds: string[];
  contactPhone: string;
  bookingNotes: string;
  published: boolean;
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  patientName: string; // First name / consented display
  country: string;
  treatment: string;
  hospital: string;
  doctor?: string;
  story: string;
  imageUrl?: string;
  videoUrl?: string;
  date: string;
  published: boolean;
  displayOrder: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  published: boolean;
}

export interface JourneyStep {
  id?: string;
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Treatment Planning'
  | 'Converted'
  | 'Closed'
  | 'Rejected';

export interface LeadDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
  dataBase64?: string; // For protected in-browser demonstration storage
}

export interface PatientLead {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  assignedStaff?: string;
  internalNotes?: string;
  
  // Personal
  fullName: string;
  country: string;
  city: string;
  email: string;
  whatsapp: string;
  preferredCommunication: 'WhatsApp' | 'Email' | 'Phone Call';
  
  // Medical
  treatmentRequired: string;
  medicalCondition: string;
  age: string;
  gender: string;
  preferredSpeciality: string;
  preferredCity: string;
  preferredHospital: string;
  medicalDescription: string;
  
  // Travel
  expectedTravelMonth: string;
  accompanyingPersons: string;
  accommodationRequired: boolean;
  airportAssistanceRequired: boolean;
  
  // Documents
  documents: LeadDocument[];
  
  // Consent
  privacyConsent: boolean;
  hospitalSharingConsent: boolean;

  // Aliases for backward compatibility and Firestore schema sync
  patientName?: string;
  name?: string;
  phone?: string;
  preferredTreatment?: string;
  tentativeTravelMonth?: string;
  medicalHistory?: string;
  consentAgreed?: boolean;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'INR' | 'SAR' | 'OMR' | 'KES' | 'NGN' | 'BDT';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rateToUSD: number; // 1 USD = rate * Currency
}
