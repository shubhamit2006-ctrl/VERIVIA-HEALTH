import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  onAuthStateChanged,
  User,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

/**
 * Designated Google Workspace Administrator account as required.
 * Only this account (and verified records in /admins/{uid}) is granted CMS admin authorization.
 */
export const DESIGNATED_ADMIN_EMAIL = 'swati.soam@primipassiedu.com';

export function isDesignatedAdmin(user?: User | null): boolean {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === DESIGNATED_ADMIN_EMAIL.toLowerCase();
}
import {
  BrandSettings,
  Treatment,
  Hospital,
  Doctor,
  TreatmentPackage,
  Hotel,
  Testimonial,
  FAQItem,
  PatientLead,
  LeadDocument,
  WhyIndiaPoint,
  CurrencyCode,
  JourneyStep
} from '../types';
import {
  CURRENCIES,
  INITIAL_BRAND_SETTINGS,
  INITIAL_WHY_INDIA,
  INITIAL_TREATMENTS,
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_PACKAGES,
  INITIAL_HOTELS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_JOURNEY_STEPS
} from '../initialData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (error instanceof Error && error.message.includes('permission-denied')) {
    throw new Error(JSON.stringify(errInfo));
  }
}

interface AppContextType {
  // Brand & Settings
  brand: BrandSettings;
  updateBrand: (newSettings: Partial<BrandSettings>) => Promise<void>;
  
  // Currency & Internationalization
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountUSD: number) => string;
  
  // Data Entities
  treatments: Treatment[];
  hospitals: Hospital[];
  doctors: Doctor[];
  packages: TreatmentPackage[];
  hotels: Hotel[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  whyIndia: WhyIndiaPoint[];
  journeySteps: JourneyStep[];
  leads: PatientLead[];
  
  // Auth state
  currentUser: User | null;
  authLoading: boolean;
  isAdminLoggedIn: boolean;
  isAuthorizedAdmin: boolean;
  designatedAdminEmail: string;
  signInWithGoogleAdmin: () => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  setIsAdminLoggedIn: (val: boolean) => void;
  
  // CRUD Actions
  saveTreatment: (treatment: Treatment) => Promise<void>;
  deleteTreatment: (id: string) => Promise<void>;
  
  saveHospital: (hospital: Hospital) => Promise<void>;
  deleteHospital: (id: string) => Promise<void>;
  
  saveDoctor: (doctor: Doctor) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  
  savePackage: (pkg: TreatmentPackage) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  
  saveHotel: (hotel: Hotel) => Promise<void>;
  deleteHotel: (id: string) => Promise<void>;
  
  saveTestimonial: (test: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  
  saveFaq: (faq: FAQItem) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  
  saveJourneyStep: (step: JourneyStep) => Promise<void>;
  deleteJourneyStep: (id: string) => Promise<void>;
  
  submitLead: (lead: Omit<PatientLead, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateLead: (id: string, updates: Partial<PatientLead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  // Reset demo data
  resetToDemoData: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Recursively cleans an object to strip any `undefined` values before sending to Firestore.
 * Firestore will throw a fatal error if any field is undefined.
 */
function cleanFirestoreData<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      result[key] = cleanFirestoreData(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => {
        if (item !== null && typeof item === 'object' && !(item instanceof Date)) {
          return cleanFirestoreData(item);
        }
        return item;
      });
    } else {
      result[key] = value;
    }
  }
  return result;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brand, setBrand] = useState<BrandSettings>(INITIAL_BRAND_SETTINGS);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [treatments, setTreatments] = useState<Treatment[]>(INITIAL_TREATMENTS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [packages, setPackages] = useState<TreatmentPackage[]>(INITIAL_PACKAGES);
  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const cached = localStorage.getItem('verivia_hotels');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return INITIAL_HOTELS;
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [whyIndia, setWhyIndia] = useState<WhyIndiaPoint[]>(INITIAL_WHY_INDIA);
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>(() => {
    const cached = localStorage.getItem('verivia_journey_steps');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return INITIAL_JOURNEY_STEPS;
  });
  const [leads, setLeads] = useState<PatientLead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Track Firebase Auth and enforce strict administrator authorization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsAuthorizedAdmin(false);
        setIsAdminLoggedIn(false);
        setAuthLoading(false);
        localStorage.removeItem('verivia_admin_session');
        localStorage.removeItem('medglobal_admin_session');
        return;
      }

      // Step 1: Check if user matches the designated Google Workspace administrator email
      let authorized = isDesignatedAdmin(user);

      // Step 2: Check administrator role record in Firestore /admins/{uid}
      if (!authorized) {
        try {
          const adminDoc = await getDocFromServer(doc(db, 'admins', user.uid));
          if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
            authorized = true;
          }
        } catch {
          // Unauthorized users are denied read access by Firestore security rules
        }
      }

      if (authorized) {
        // Provision / update verified administrator record in /admins/{uid}
        try {
          await setDoc(doc(db, 'admins', user.uid), {
            uid: user.uid,
            email: user.email?.toLowerCase().trim() || '',
            role: 'admin',
            displayName: user.displayName || 'Administrator',
            photoURL: user.photoURL || '',
            lastLoginAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.warn('Admin record sync note:', err);
        }
        setIsAuthorizedAdmin(true);
        setIsAdminLoggedIn(true);
      } else {
        // User is signed in to Google, but lacks administrative authorization
        setIsAuthorizedAdmin(false);
        setIsAdminLoggedIn(false);
        localStorage.removeItem('verivia_admin_session');
        localStorage.removeItem('medglobal_admin_session');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Secure Sign In with Google for Administrator
  const signInWithGoogleAdmin = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Prompt user to select account (enables Google Workspace account selection)
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;

      let authorized = isDesignatedAdmin(user);
      if (!authorized) {
        try {
          const adminDoc = await getDocFromServer(doc(db, 'admins', user.uid));
          if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
            authorized = true;
          }
        } catch {
          // Denied
        }
      }

      if (!authorized) {
        setIsAuthorizedAdmin(false);
        setIsAdminLoggedIn(false);
        setAuthLoading(false);
        return {
          success: false,
          error: `Access Denied: You are signed in as ${user.email}. This account is not authorized as an administrator for Verivia Health. Only the designated administrator (${DESIGNATED_ADMIN_EMAIL}) has access.`
        };
      }

      // Provision / touch verified administrator record
      try {
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: user.email?.toLowerCase().trim() || '',
          role: 'admin',
          displayName: user.displayName || 'Administrator',
          photoURL: user.photoURL || '',
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Admin record sync note:', err);
      }

      setIsAuthorizedAdmin(true);
      setIsAdminLoggedIn(true);
      setAuthLoading(false);
      return { success: true };
    } catch (err: any) {
      setAuthLoading(false);
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in cancelled: The Google sign-in window was closed.' };
      }
      return { success: false, error: err.message || 'Google sign-in failed. Please try again.' };
    }
  };

  // Secure Logout
  const logoutAdmin = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setCurrentUser(null);
    setIsAuthorizedAdmin(false);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('verivia_admin_session');
    localStorage.removeItem('medglobal_admin_session');
  };

  // Hydrate from Firestore or Local Cache
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        // Validate Firestore connection per system guidelines
        try {
          await getDocFromServer(doc(db, 'test', 'connection'));
        } catch (connErr) {
          if (connErr instanceof Error && connErr.message.includes('the client is offline')) {
            console.warn('Firestore is running in offline mode. Local dataset active.');
          }
        }

        // Load Brand Settings
        try {
          const brandSnap = await getDocs(collection(db, 'settings'));
          if (!brandSnap.empty) {
            const data = brandSnap.docs[0].data() as BrandSettings;
            // Seamlessly migrate legacy brand names to new VERIVIA HEALTH brand
            if (data.brandName === 'MedGlobal India' || data.brandName === 'VERIVIA GLOBAL' || !data.brandName) {
              data.brandName = INITIAL_BRAND_SETTINGS.brandName;
              data.tagline = INITIAL_BRAND_SETTINGS.tagline;
              data.logoUrl = INITIAL_BRAND_SETTINGS.logoUrl;
              data.footerText = INITIAL_BRAND_SETTINGS.footerText;
              data.copyrightText = INITIAL_BRAND_SETTINGS.copyrightText;
              data.disclaimerText = INITIAL_BRAND_SETTINGS.disclaimerText;
              data.email = INITIAL_BRAND_SETTINGS.email;
              data.websiteUrl = INITIAL_BRAND_SETTINGS.websiteUrl;
            }
            if (!data.logoUrl || data.logoUrl.includes('1791174945789') || data.logoUrl.includes('horizontal')) {
              data.logoUrl = INITIAL_BRAND_SETTINGS.logoUrl;
            }
            setBrand({ ...INITIAL_BRAND_SETTINGS, ...data });
          }
        } catch (e) {
          console.warn('Firestore settings load warning, using defaults:', e);
        }

        // Load Treatments
        try {
          const tSnap = await getDocs(collection(db, 'treatments'));
          if (!tSnap.empty) {
            const items = tSnap.docs.map(d => ({ id: d.id, ...d.data() } as Treatment));
            setTreatments(items.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          console.warn('Using initial treatments:', e);
        }

        // Load Hospitals
        try {
          const hSnap = await getDocs(collection(db, 'hospitals'));
          if (!hSnap.empty) {
            const items = hSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital));
            setHospitals(items.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          console.warn('Using initial hospitals:', e);
        }

        // Load Doctors
        try {
          const dSnap = await getDocs(collection(db, 'doctors'));
          if (!dSnap.empty) {
            const items = dSnap.docs.map(d => ({ id: d.id, ...d.data() } as Doctor));
            setDoctors(items.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          console.warn('Using initial doctors:', e);
        }

        // Load Packages
        try {
          const pSnap = await getDocs(collection(db, 'packages'));
          if (!pSnap.empty) {
            const items = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as TreatmentPackage));
            setPackages(items.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          console.warn('Using initial packages:', e);
        }

        // Load Hotels
        try {
          const htSnap = await getDocs(collection(db, 'hotels'));
          if (!htSnap.empty) {
            const items = htSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hotel));
            setHotels(items.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          console.warn('Using initial hotels:', e);
        }

        // Load Testimonials
        try {
          const tmSnap = await getDocs(collection(db, 'testimonials'));
          if (!tmSnap.empty) {
            const items = tmSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
            setTestimonials(items.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          console.warn('Using initial testimonials:', e);
        }

        // Load FAQs
        try {
          const fSnap = await getDocs(collection(db, 'faqs'));
          if (!fSnap.empty) {
            const items = fSnap.docs.map(d => ({ id: d.id, ...d.data() } as FAQItem));
            setFaqs(items.sort((a, b) => a.displayOrder - b.displayOrder));
          }
        } catch (e) {
          console.warn('Using initial faqs:', e);
        }

        // Load Journey Steps (How It Works)
        try {
          const jsSnap = await getDocs(collection(db, 'journeySteps'));
          if (!jsSnap.empty) {
            const items = jsSnap.docs.map(d => ({ id: d.id, ...d.data() } as JourneyStep));
            const sorted = items.sort((a, b) => a.stepNumber - b.stepNumber);
            setJourneySteps(sorted);
            localStorage.setItem('verivia_journey_steps', JSON.stringify(sorted));
          } else {
            // Seed initial steps into Firestore if empty
            for (const step of INITIAL_JOURNEY_STEPS) {
              const stepId = step.id || `step-${step.stepNumber}`;
              setDoc(doc(db, 'journeySteps', stepId), { ...step, id: stepId }).catch(() => {});
            }
          }
        } catch (e) {
          console.warn('Using initial journey steps:', e);
        }

        // Load Leads (Fully synced with Firestore and resiliently cached in localStorage)
        try {
          // Immediately load cached leads so the UI is instantaneous and never flashes empty
          const cachedLeadsRaw = localStorage.getItem('verivia_leads_cache');
          let localCachedList: PatientLead[] = [];
          if (cachedLeadsRaw) {
            try {
              const parsed = JSON.parse(cachedLeadsRaw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                localCachedList = parsed;
                setLeads(localCachedList);
              }
            } catch (err) {
              console.warn('Failed parsing cached leads', err);
            }
          }

          const lSnap = await getDocs(collection(db, 'leads'));
          if (!lSnap.empty) {
            const firestoreItems: PatientLead[] = lSnap.docs.map(d => {
              const data = d.data();
              const resolvedName = (data.fullName || data.patientName || data.name || '').trim() || 'Patient';
              const resolvedPhone = (data.whatsapp || data.phone || '').trim();
              const resolvedTreatment = (data.treatmentRequired || data.preferredTreatment || 'General Medical Evaluation').trim();
              const resolvedTravel = (data.expectedTravelMonth || data.tentativeTravelMonth || 'Within 1 Month').trim();
              const resolvedCondition = (data.medicalCondition || '').trim();
              const resolvedHistory = (data.medicalDescription || data.medicalHistory || '').trim();

              return {
                id: d.id,
                ...data,
                fullName: resolvedName,
                patientName: resolvedName,
                name: resolvedName,
                whatsapp: resolvedPhone,
                phone: resolvedPhone,
                country: (data.country || 'International').trim(),
                city: (data.city || '').trim(),
                email: (data.email || '').trim(),
                preferredCommunication: data.preferredCommunication || 'WhatsApp',
                treatmentRequired: resolvedTreatment,
                preferredTreatment: resolvedTreatment,
                medicalCondition: resolvedCondition,
                medicalDescription: resolvedHistory,
                medicalHistory: resolvedHistory,
                age: data.age !== undefined && data.age !== null ? String(data.age).trim() : '',
                gender: data.gender || 'Not specified',
                preferredSpeciality: (data.preferredSpeciality || '').trim(),
                preferredCity: (data.preferredCity || '').trim(),
                preferredHospital: (data.preferredHospital || '').trim(),
                expectedTravelMonth: resolvedTravel,
                tentativeTravelMonth: resolvedTravel,
                accompanyingPersons: data.accompanyingPersons || '1',
                accommodationRequired: data.accommodationRequired !== undefined ? Boolean(data.accommodationRequired) : true,
                airportAssistanceRequired: data.airportAssistanceRequired !== undefined ? Boolean(data.airportAssistanceRequired) : true,
                documents: Array.isArray(data.documents) ? data.documents : [],
                privacyConsent: data.privacyConsent !== undefined ? Boolean(data.privacyConsent) : true,
                hospitalSharingConsent: data.hospitalSharingConsent !== undefined ? Boolean(data.hospitalSharingConsent) : true,
                status: data.status || 'New',
                assignedStaff: data.assignedStaff || data.assignedCoordinator || '',
                internalNotes: data.internalNotes || '',
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString()
              } as PatientLead;
            });

            // Merge Firestore records with any locally submitted leads
            const mergedMap = new Map<string, PatientLead>();
            firestoreItems.forEach(l => mergedMap.set(l.id, l));
            localCachedList.forEach(l => {
              if (!mergedMap.has(l.id)) {
                mergedMap.set(l.id, l);
                // Also asynchronously sync this local-only lead to Firestore so it never vanishes
                try {
                  setDoc(doc(db, 'leads', l.id), cleanFirestoreData(l)).catch(() => {});
                } catch {}
              }
            });

            const finalLeads = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setLeads(finalLeads);
            localStorage.setItem('verivia_leads_cache', JSON.stringify(finalLeads));
          } else if (localCachedList.length > 0) {
            // Firestore returned empty but we have local leads, push them to Firestore so they are safely backed up
            setLeads(localCachedList);
            localCachedList.forEach(l => {
              try {
                setDoc(doc(db, 'leads', l.id), cleanFirestoreData(l)).catch(() => {});
              } catch {}
            });
          } else {
            // Seed 2 sample demonstration leads for instant testing only if genuine zero leads exist
            const demoLeads: PatientLead[] = [
              {
                id: 'lead-demo-1',
                createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'Treatment Planning',
                assignedStaff: 'Dr. Neha Sharma (Lead Coordinator)',
                internalNotes: 'Patient shared 2D Echocardiography and CT Coronary Angiogram. Evaluated by Medanta Cardiac Board. Preliminary quotation of $6,200 shared.',
                fullName: 'Mustafa Al-Bayati',
                patientName: 'Mustafa Al-Bayati',
                country: 'Iraq',
                city: 'Baghdad',
                email: 'm.albayati@example.com',
                whatsapp: '+964 770 123 4567',
                preferredCommunication: 'WhatsApp',
                treatmentRequired: 'Cardiac Sciences',
                medicalCondition: 'Triple Vessel Coronary Artery Disease with 85% LAD stenosis',
                age: '58',
                gender: 'Male',
                preferredSpeciality: 'Cardiovascular Surgery',
                preferredCity: 'Gurugram (Delhi NCR)',
                preferredHospital: 'Medanta - The Medicity',
                medicalDescription: 'Suffering from progressive exertional angina since 6 months. Seeking beating-heart CABG options.',
                expectedTravelMonth: 'October 2026',
                accompanyingPersons: '2 (Wife and Son)',
                accommodationRequired: true,
                airportAssistanceRequired: true,
                documents: [
                  {
                    id: 'doc-demo-1',
                    name: 'Coronary_Angiography_Scan.jpg',
                    size: 1485760,
                    type: 'image/jpeg',
                    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
                    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80'
                  }
                ],
                privacyConsent: true,
                hospitalSharingConsent: true
              },
              {
                id: 'lead-demo-2',
                createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'New',
                fullName: 'Grace Wambui',
                patientName: 'Grace Wambui',
                country: 'Kenya',
                city: 'Nairobi',
                email: 'grace.wambui@example.com',
                whatsapp: '+254 712 345 678',
                preferredCommunication: 'Email',
                treatmentRequired: 'Orthopaedics & Joint Replacement',
                medicalCondition: 'Grade IV Bilateral Osteoarthritis of Knees',
                age: '62',
                gender: 'Female',
                preferredSpeciality: 'Robotic Arthroplasty',
                preferredCity: 'Chennai',
                preferredHospital: 'Apollo Hospitals, Greams Road',
                medicalDescription: 'Difficulty walking even 50 meters. Both knees in severe varus deformity.',
                expectedTravelMonth: 'November 2026',
                accompanyingPersons: '1 (Daughter)',
                accommodationRequired: true,
                airportAssistanceRequired: true,
                documents: [
                  {
                    id: 'doc-demo-2',
                    name: 'Bilateral_Knee_Radiology_Scan.jpg',
                    size: 1948576,
                    type: 'image/jpeg',
                    uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
                    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
                  }
                ],
                privacyConsent: true,
                hospitalSharingConsent: true
              }
            ];
            setLeads(demoLeads);
            localStorage.setItem('verivia_leads_cache', JSON.stringify(demoLeads));
          }
        } catch (e) {
          console.warn('Leads loaded from resilient cache:', e);
          const cachedLeadsRaw = localStorage.getItem('verivia_leads_cache');
          if (cachedLeadsRaw) {
            try {
              const parsed = JSON.parse(cachedLeadsRaw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setLeads(parsed);
              }
            } catch {}
          }
        }
      } catch (err) {
        console.error('Error during data hydration:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Format price helper
  const formatPrice = (amountUSD: number): string => {
    const currency = CURRENCIES[selectedCurrency] || CURRENCIES.USD;
    const converted = Math.round(amountUSD * currency.rateToUSD);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  // Brand updates
  const updateBrand = async (newSettings: Partial<BrandSettings>) => {
    const updated = { ...brand, ...newSettings };
    setBrand(updated);
    try {
      await setDoc(doc(db, 'settings', 'brand'), updated, { merge: true });
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.UPDATE, 'settings/brand');
      }
      console.error('Failed to update brand in Firestore', e);
    }
  };

  // Treatment CRUD
  const saveTreatment = async (treatment: Treatment) => {
    setTreatments(prev => {
      const idx = prev.findIndex(t => t.id === treatment.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = treatment;
        return copy.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, treatment].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    try {
      await setDoc(doc(db, 'treatments', treatment.id), treatment);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `treatments/${treatment.id}`);
      }
      console.error('Failed to save treatment to Firestore', e);
    }
  };

  const deleteTreatment = async (id: string) => {
    setTreatments(prev => prev.filter(t => t.id !== id));
    try {
      await deleteDoc(doc(db, 'treatments', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `treatments/${id}`);
      }
      console.error('Failed to delete treatment', e);
    }
  };

  // Hospital CRUD
  const saveHospital = async (hospital: Hospital) => {
    setHospitals(prev => {
      const idx = prev.findIndex(h => h.id === hospital.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = hospital;
        return copy.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, hospital].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    try {
      await setDoc(doc(db, 'hospitals', hospital.id), hospital);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `hospitals/${hospital.id}`);
      }
      console.error('Failed to save hospital to Firestore', e);
    }
  };

  const deleteHospital = async (id: string) => {
    setHospitals(prev => prev.filter(h => h.id !== id));
    try {
      await deleteDoc(doc(db, 'hospitals', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `hospitals/${id}`);
      }
      console.error('Failed to delete hospital', e);
    }
  };

  // Doctor CRUD
  const saveDoctor = async (doctor: Doctor) => {
    setDoctors(prev => {
      const idx = prev.findIndex(d => d.id === doctor.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = doctor;
        return copy.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, doctor].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    try {
      await setDoc(doc(db, 'doctors', doctor.id), doctor);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `doctors/${doctor.id}`);
      }
      console.error('Failed to save doctor to Firestore', e);
    }
  };

  const deleteDoctor = async (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    try {
      await deleteDoc(doc(db, 'doctors', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `doctors/${id}`);
      }
      console.error('Failed to delete doctor', e);
    }
  };

  // Package CRUD
  const savePackage = async (pkg: TreatmentPackage) => {
    setPackages(prev => {
      const idx = prev.findIndex(p => p.id === pkg.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = pkg;
        return copy.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, pkg].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    try {
      await setDoc(doc(db, 'packages', pkg.id), pkg);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `packages/${pkg.id}`);
      }
      console.error('Failed to save package', e);
    }
  };

  const deletePackage = async (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'packages', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `packages/${id}`);
      }
      console.error('Failed to delete package', e);
    }
  };

  // Hotel CRUD
  const saveHotel = async (hotel: Hotel) => {
    setHotels(prev => {
      const idx = prev.findIndex(h => h.id === hotel.id);
      let updated: Hotel[];
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = hotel;
        updated = copy.sort((a, b) => a.displayOrder - b.displayOrder);
      } else {
        updated = [...prev, hotel].sort((a, b) => a.displayOrder - b.displayOrder);
      }
      try {
        localStorage.setItem('verivia_hotels', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
      return updated;
    });
    try {
      await setDoc(doc(db, 'hotels', hotel.id), hotel);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `hotels/${hotel.id}`);
      }
      console.error('Failed to save hotel to Firebase', e);
    }
  };

  const deleteHotel = async (id: string) => {
    setHotels(prev => {
      const updated = prev.filter(h => h.id !== id);
      try {
        localStorage.setItem('verivia_hotels', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'hotels', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `hotels/${id}`);
      }
      console.error('Failed to delete hotel from Firebase', e);
    }
  };

  // Testimonial CRUD
  const saveTestimonial = async (test: Testimonial) => {
    setTestimonials(prev => {
      const idx = prev.findIndex(t => t.id === test.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = test;
        return copy.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, test].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    try {
      await setDoc(doc(db, 'testimonials', test.id), test);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `testimonials/${test.id}`);
      }
      console.error('Failed to save testimonial', e);
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `testimonials/${id}`);
      }
      console.error('Failed to delete testimonial', e);
    }
  };

  // FAQ CRUD
  const saveFaq = async (faq: FAQItem) => {
    setFaqs(prev => {
      const idx = prev.findIndex(f => f.id === faq.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = faq;
        return copy.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return [...prev, faq].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    try {
      await setDoc(doc(db, 'faqs', faq.id), faq);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `faqs/${faq.id}`);
      }
      console.error('Failed to save faq', e);
    }
  };

  const deleteFaq = async (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `faqs/${id}`);
      }
      console.error('Failed to delete faq', e);
    }
  };

  // How It Works / Journey Steps CRUD
  const saveJourneyStep = async (step: JourneyStep) => {
    const stepId = step.id || `step-${step.stepNumber || Date.now()}`;
    const preparedStep: JourneyStep = { ...step, id: stepId };

    setJourneySteps(prev => {
      const idx = prev.findIndex(s => s.id === stepId || s.stepNumber === step.stepNumber);
      let updated: JourneyStep[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = preparedStep;
      } else {
        updated = [...prev, preparedStep];
      }
      const sorted = updated.sort((a, b) => a.stepNumber - b.stepNumber);
      localStorage.setItem('verivia_journey_steps', JSON.stringify(sorted));
      return sorted;
    });

    try {
      const cleanData = cleanFirestoreData(preparedStep);
      await setDoc(doc(db, 'journeySteps', stepId), cleanData, { merge: true });
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.WRITE, `journeySteps/${stepId}`);
      }
      console.error('Failed to save journey step', e);
    }
  };

  const deleteJourneyStep = async (id: string) => {
    setJourneySteps(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('verivia_journey_steps', JSON.stringify(updated));
      return updated;
    });

    try {
      await deleteDoc(doc(db, 'journeySteps', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `journeySteps/${id}`);
      }
      console.error('Failed to delete journey step', e);
    }
  };

  // Lead Submission & Management
  const submitLead = async (leadData: Omit<PatientLead, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
    const resolvedName = (leadData.fullName || (leadData as any).patientName || (leadData as any).name || '').trim() || 'Patient';
    const resolvedPhone = (leadData.whatsapp || (leadData as any).phone || '').trim();
    const resolvedTreatment = (leadData.treatmentRequired || (leadData as any).preferredTreatment || 'General Medical Evaluation').trim();
    const resolvedTravel = (leadData.expectedTravelMonth || (leadData as any).tentativeTravelMonth || 'Within 1 Month').trim();
    const resolvedCondition = (leadData.medicalCondition || '').trim();
    const resolvedHistory = (leadData.medicalDescription || (leadData as any).medicalHistory || '').trim();

    // Deterministic unique ID for this lead used identically across local cache and Firestore
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    // Prepare safe, clean sanitized documents
    const sanitizedDocs: LeadDocument[] = (leadData.documents || []).map(doc => {
      const cleanDoc: LeadDocument = {
        id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: doc.name || 'medical_report',
        size: Number(doc.size) || 0,
        type: doc.type || 'application/octet-stream',
        url: doc.url || (doc.dataBase64 && doc.dataBase64.length < 350000 ? doc.dataBase64 : ''),
        uploadedAt: doc.uploadedAt || nowIso
      };
      if (doc.dataBase64 && doc.dataBase64.length < 350000) {
        cleanDoc.dataBase64 = doc.dataBase64;
      }
      return cleanDoc;
    });

    const newLead: PatientLead = {
      id: leadId,
      createdAt: nowIso,
      updatedAt: nowIso,
      status: 'New',
      assignedStaff: leadData.assignedStaff || '',
      internalNotes: leadData.internalNotes || '',

      // Personal details
      fullName: resolvedName,
      country: (leadData.country || 'International').trim(),
      city: (leadData.city || '').trim(),
      email: (leadData.email || '').trim(),
      whatsapp: resolvedPhone,
      preferredCommunication: leadData.preferredCommunication || 'WhatsApp',

      // Clinical & Medical details
      treatmentRequired: resolvedTreatment,
      medicalCondition: resolvedCondition,
      age: leadData.age !== undefined && leadData.age !== null ? String(leadData.age).trim() : '',
      gender: leadData.gender || 'Not specified',
      preferredSpeciality: (leadData.preferredSpeciality || '').trim(),
      preferredCity: (leadData.preferredCity || '').trim(),
      preferredHospital: (leadData.preferredHospital || '').trim(),
      medicalDescription: resolvedHistory,

      // Travel & Concierge details
      expectedTravelMonth: resolvedTravel,
      accompanyingPersons: leadData.accompanyingPersons || '1',
      accommodationRequired: leadData.accommodationRequired !== undefined ? Boolean(leadData.accommodationRequired) : true,
      airportAssistanceRequired: leadData.airportAssistanceRequired !== undefined ? Boolean(leadData.airportAssistanceRequired) : true,

      // Documents
      documents: sanitizedDocs,

      // Consents
      privacyConsent: Boolean(leadData.privacyConsent),
      hospitalSharingConsent: Boolean(leadData.hospitalSharingConsent)
    };

    // Immediately update local React state and localStorage so the UI is instantaneous
    setLeads(prev => {
      const filtered = prev.filter(l => l.id !== leadId);
      const updated = [newLead, ...filtered];
      try {
        localStorage.setItem('verivia_leads_cache', JSON.stringify(updated));
      } catch (err) {
        console.warn('Local leads cache update error:', err);
      }
      return updated;
    });

    // Prepare complete Firestore payload including backward-compatible aliases
    const firestorePayload = cleanFirestoreData({
      ...newLead,
      patientName: resolvedName,
      name: resolvedName,
      phone: resolvedPhone,
      preferredTreatment: resolvedTreatment,
      tentativeTravelMonth: resolvedTravel,
      medicalHistory: resolvedHistory,
      consentAgreed: newLead.privacyConsent,
      documents: sanitizedDocs
    });

    try {
      // Save directly with setDoc to guarantee id consistency between Firestore and local state
      await setDoc(doc(db, 'leads', leadId), firestorePayload);
      console.log('Lead successfully saved to Firebase Firestore:', leadId, resolvedName);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.CREATE, `leads/${leadId}`);
      }
      console.warn('Firestore write warning (retained in resilient local cache):', e);
    }

    return leadId;
  };

  const updateLead = async (id: string, updates: Partial<PatientLead>) => {
    const updatedLead = { ...updates, updatedAt: new Date().toISOString() };
    setLeads(prev => {
      const updated = prev.map(l => (l.id === id ? { ...l, ...updatedLead } : l));
      try {
        localStorage.setItem('verivia_leads_cache', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const cleaned = cleanFirestoreData(updatedLead);
      await updateDoc(doc(db, 'leads', id), cleaned);
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.UPDATE, `leads/${id}`);
      }
      console.error('Failed to update lead in Firestore', e);
    }
  };

  const deleteLead = async (id: string) => {
    setLeads(prev => {
      const remaining = prev.filter(l => l.id !== id);
      try {
        localStorage.setItem('verivia_leads_cache', JSON.stringify(remaining));
      } catch {}
      return remaining;
    });

    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (e) {
      if (e instanceof Error && e.message.includes('permission-denied')) {
        handleFirestoreError(e, OperationType.DELETE, `leads/${id}`);
      }
      console.error('Failed to delete lead from Firestore', e);
    }
  };

  const resetToDemoData = async () => {
    setIsLoading(true);
    try {
      setBrand(INITIAL_BRAND_SETTINGS);
      setTreatments(INITIAL_TREATMENTS);
      setHospitals(INITIAL_HOSPITALS);
      setDoctors(INITIAL_DOCTORS);
      setPackages(INITIAL_PACKAGES);
      setHotels(INITIAL_HOTELS);
      setTestimonials(INITIAL_TESTIMONIALS);
      setFaqs(INITIAL_FAQS);
      setWhyIndia(INITIAL_WHY_INDIA);

      await setDoc(doc(db, 'settings', 'brand'), INITIAL_BRAND_SETTINGS);
      for (const t of INITIAL_TREATMENTS) await setDoc(doc(db, 'treatments', t.id), t);
      for (const h of INITIAL_HOSPITALS) await setDoc(doc(db, 'hospitals', h.id), h);
      for (const d of INITIAL_DOCTORS) await setDoc(doc(db, 'doctors', d.id), d);
      for (const p of INITIAL_PACKAGES) await setDoc(doc(db, 'packages', p.id), p);
      for (const ht of INITIAL_HOTELS) await setDoc(doc(db, 'hotels', ht.id), ht);
      for (const tm of INITIAL_TESTIMONIALS) await setDoc(doc(db, 'testimonials', tm.id), tm);
      for (const f of INITIAL_FAQS) await setDoc(doc(db, 'faqs', f.id), f);
      for (const js of INITIAL_JOURNEY_STEPS) await setDoc(doc(db, 'journeySteps', js.id!), js);
      setJourneySteps(INITIAL_JOURNEY_STEPS);
      localStorage.setItem('verivia_journey_steps', JSON.stringify(INITIAL_JOURNEY_STEPS));
    } catch (e) {
      console.error('Reset demo error', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        brand,
        updateBrand,
        selectedCurrency,
        setSelectedCurrency,
        formatPrice,
        treatments,
        hospitals,
        doctors,
        packages,
        hotels,
        testimonials,
        faqs,
        whyIndia,
        journeySteps,
        leads,
        currentUser,
        authLoading,
        isAdminLoggedIn,
        isAuthorizedAdmin,
        designatedAdminEmail: DESIGNATED_ADMIN_EMAIL,
        signInWithGoogleAdmin,
        logoutAdmin,
        setIsAdminLoggedIn,
        saveTreatment,
        deleteTreatment,
        saveHospital,
        deleteHospital,
        saveDoctor,
        deleteDoctor,
        savePackage,
        deletePackage,
        saveHotel,
        deleteHotel,
        saveTestimonial,
        deleteTestimonial,
        saveFaq,
        deleteFaq,
        saveJourneyStep,
        deleteJourneyStep,
        submitLead,
        updateLead,
        deleteLead,
        resetToDemoData,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
