import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Users,
    Church,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Plus,
    Trash2,
    Search,
    Printer,
    Eye,
    HeartHandshake,
    ShieldAlert,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Check,
    X,
    Filter,
    Calendar,
    Phone,
    MapPin,
    Award,
    Sparkles,
    Send,
    Settings,
    Pencil,
    ListChecks,
    ArrowLeft,
    Home,
    BarChart3,
    HeartPulse,
    Baby,
    GraduationCap,
    Briefcase,
    Building,
    BookOpen,
    ClipboardCheck
} from 'lucide-react';
import PastorReportsDashboard from '@/components/pastor/PastorReportsDashboard';
import MemberSurveyModal from '@/components/volunteer/MemberSurveyModal';

// --- TYPES ---
export interface FamilyMember {
    id: string;
    dbId?: number;
    fullName: string;
    relationship: 'Head' | 'Spouse' | 'Son' | 'Daughter' | 'Parent' | 'Relative' | 'Other';
    sex: 'Male' | 'Female';
    age: number;
    birthdate?: string;
    civilStatus: 'Single' | 'Married (Church)' | 'Civilly Married' | 'Cohabiting' | 'Widowed' | 'Separated';
    // Questionnaire additions:
    occupation?: string;
    employmentType?: string;
    yearsInService?: string;
    education?: string;
    maritalSituation?: string;
    marriageDateParish?: string;
    isBaptized: boolean;
    isFirstCommunion: boolean;
    isConfirmed: boolean;
    isChurchMarried: boolean;
    needsSacramentPrep?: boolean;
    isHomebound?: boolean;
    specialNeeds?: string;
    isSenior?: boolean;
    isPwd?: boolean;
    pwdDetails?: string;
    needsCommunionAnointing?: boolean;
    needsPastoralVisit?: boolean;
    isOutOfSchoolYouth?: boolean;
    youthMinistryInvolvement?: boolean;
    parishMinistries?: string[];
    skillsTalents?: string[];
}

export interface Household {
    id: string;
    dbId?: number;
    familyName: string;
    headName: string;
    address: string;
    barangay: string;
    sitioPurok: string;
    becCluster: string;
    contactNumber: string;
    // Questionnaire additions:
    housingSituation?: string;
    monthlyIncome?: string;
    isVulnerable?: boolean;
    livelihoodAssistanceNeeded?: string;
    pastoralFollowup?: {
        homeVisits?: boolean;
        referral?: string;
        assistanceProvided?: string;
        sacramentalFollowup?: boolean;
        ministryResponsible?: string;
        nextPastoralAction?: string;
    };
    trainingNeeds?: string[];
    dateEncoded: string;
    status: 'Pending Review' | 'Approved' | 'Returned for Correction';
    correctionNote?: string;
    encodedBy: string;
    members: FamilyMember[];
    // Pastoral & Listening Data
    massFrequency: 'Every week' | 'Almost every week' | 'Occasionally' | 'Rarely / Never';
    becParticipation: 'Regular' | 'Sometimes' | 'Rarely' | 'Not active';
    pastoralNeeds: string[];
    volunteerSkills: string[];
    familyJoy: string;
    familyConcern: string;
    howParishCanHelp: string;
    consentGiven: boolean;
}

interface CertificateRecord {
    id: string;
    dbId?: number;
    requestId: string;
    recipientName: string;
    familyId: string;
    householdDbId?: number;
    certificateType: 'Baptismal' | 'Confirmation' | 'First Communion';
    dateOfSacrament: string;
    placeOfSacrament: string;
    ministerName: string;
    bookNo: string;
    pageNo: string;
    lineNo: string;
    sponsorNames: string;
    purpose: string;
    dateIssued?: string;
    status: 'Pending Review' | 'Approved & Issued' | 'Declined';
    issuedBy?: string;
    declineReason?: string;
}

export const UNIVERSITY_TRAINING_TOPICS = [
    'Digital Literacy for Everyday Life (using smartphones, QR codes, government e-services)',
    'Basic Accounting & Bookkeeping for Micro-Enterprises',
    'Building Saving & Emergency Fund',
    'Basic First Aid & Disaster Risk Reduction / Emergency Preparedness',
    'Nutrition for Non-Communicable Diseases (Hypertension, Diabetes)',
    'Maternal and Child Healthcare & Immunization',
    'Small Business Start-up & Agri-business Opportunities',
    'Basic Electrical, Plumbing & Carpentry Maintenance',
    'English & Tagalog Communication & Work Readiness',
    'Parenting in the Digital Age & Youth Guidance',
    'Environmental Care & Solid Waste Segregation (Laudato Si\')',
];

// Initial Sample Data (San Isidro Parish)
const INITIAL_HOUSEHOLDS: Household[] = [
    {
        id: 'FAM-2026-0042',
        familyName: 'Santos',
        headName: 'Roberto Santos',
        address: '142 Rizal Street',
        barangay: 'San Isidro',
        sitioPurok: 'Purok 3',
        becCluster: 'BEC St. Jude',
        contactNumber: '0917-555-1234',
        dateEncoded: '2026-09-20',
        status: 'Approved',
        encodedBy: 'Ana Ramos (Volunteer)',
        housingSituation: 'Owned (Sariling Bahay at Lupa)',
        monthlyIncome: '₱10,001 – ₱15,000',
        isVulnerable: false,
        massFrequency: 'Every week',
        becParticipation: 'Regular',
        pastoralNeeds: ['Home communion for elderly grandmother', 'Youth catechesis for daughter'],
        volunteerSkills: ['Teaching / Catechesis', 'Choir & Music', 'Carpentry & Maintenance'],
        familyJoy: 'Grateful for good health and eldest son graduating high school.',
        familyConcern: 'Rising prices of basic medicine and groceries.',
        howParishCanHelp: 'Monthly home visit for Lola Rosa to receive Holy Communion.',
        pastoralFollowup: {
            homeVisits: true,
            referral: 'Barangay Health Center',
            assistanceProvided: 'First Friday Communion visit scheduled',
            sacramentalFollowup: false,
            nextPastoralAction: 'BEC St. Jude home visit on 1st Friday of the month',
        },
        trainingNeeds: [
            'Digital Literacy for Everyday Life (using smartphones, QR codes, government e-services)',
            'Building Saving & Emergency Fund',
            'Nutrition for Non-Communicable Diseases (Hypertension, Diabetes)',
        ],
        consentGiven: true,
        members: [
            {
                id: 'm-1',
                fullName: 'Roberto Santos',
                relationship: 'Head',
                sex: 'Male',
                age: 45,
                civilStatus: 'Married (Church)',
                occupation: 'Carpenter & Small Contractor',
                employmentType: 'Self-employed / Business Owner',
                yearsInService: 'More than 10 years',
                education: 'High School Level / Graduate',
                maritalSituation: 'Sacramental (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
                parishMinistries: ['Facilities & Maintenance'],
                skillsTalents: ['Carpentry & Maintenance'],
            },
            {
                id: 'm-2',
                fullName: 'Maria Santos',
                relationship: 'Spouse',
                sex: 'Female',
                age: 43,
                civilStatus: 'Married (Church)',
                occupation: 'Market Vendor (Sari-Sari)',
                employmentType: 'Self-employed / Business Owner',
                yearsInService: '5–10 years',
                education: 'High School Level / Graduate',
                maritalSituation: 'Sacramental (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
                parishMinistries: ['Choir & Music Ministry'],
                skillsTalents: ['Choir & Music'],
            },
            {
                id: 'm-3',
                fullName: 'Juan Santos',
                relationship: 'Son',
                sex: 'Male',
                age: 16,
                civilStatus: 'Single',
                occupation: 'High School Student',
                employmentType: 'Student',
                education: 'High School Level / Graduate',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: false,
                youthMinistryInvolvement: true,
                parishMinistries: ['Youth Ministry', 'Altar Server'],
                skillsTalents: ['Youth Mentorship', 'Sports'],
            },
            {
                id: 'm-4',
                fullName: 'Sofia Santos',
                relationship: 'Daughter',
                sex: 'Female',
                age: 9,
                civilStatus: 'Single',
                occupation: 'Elementary Student',
                employmentType: 'Student',
                education: 'Elementary Level / Graduate',
                isBaptized: true,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
                needsSacramentPrep: true,
            },
            {
                id: 'm-5',
                fullName: 'Rosa Santos',
                relationship: 'Parent',
                sex: 'Female',
                age: 78,
                civilStatus: 'Widowed',
                occupation: 'Retired / Senior',
                employmentType: 'Retired',
                education: 'Elementary Level / Graduate',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
                isSenior: true,
                isHomebound: true,
                needsCommunionAnointing: true,
                needsPastoralVisit: true,
                specialNeeds: 'Homebound senior grandmother; needs home Holy Communion',
            }
        ]
    },
    {
        id: 'FAM-2026-0043',
        familyName: 'Dela Cruz',
        headName: 'Eduardo Dela Cruz',
        address: '77 Sampaguita Lane',
        barangay: 'San Isidro',
        sitioPurok: 'Purok 1',
        becCluster: 'BEC San Pedro',
        contactNumber: '0928-888-4321',
        dateEncoded: '2026-09-24',
        status: 'Pending Review',
        encodedBy: 'Mark Villanueva (Volunteer)',
        housingSituation: 'Renting (Upa)',
        monthlyIncome: '₱5,000 – ₱10,000',
        isVulnerable: true,
        livelihoodAssistanceNeeded: 'Seed capital for seasonal farming and vegetable retail',
        massFrequency: 'Occasionally',
        becParticipation: 'Sometimes',
        pastoralNeeds: ['Sacramental preparation for children', 'Church wedding guidance (Kasalang Bayan)'],
        volunteerSkills: ['Carpentry & Repairs'],
        familyJoy: 'New baby born healthy last month.',
        familyConcern: 'Seasonal farming income uncertainty.',
        howParishCanHelp: 'Assistance for civil marriage regularization (Kasalang Bayan) and baptism for infant.',
        pastoralFollowup: {
            homeVisits: true,
            referral: 'Caritas Parish Social Action',
            assistanceProvided: 'Food pack and wedding documentation assistance',
            sacramentalFollowup: true,
            nextPastoralAction: 'Counseling for Kasalang Bayan wedding on Dec 10',
        },
        trainingNeeds: [
            'Small Business Start-up & Agri-business Opportunities',
            'Building Saving & Emergency Fund',
            'Parenting in the Digital Age & Youth Guidance',
        ],
        consentGiven: true,
        members: [
            {
                id: 'm-6',
                fullName: 'Eduardo Dela Cruz',
                relationship: 'Head',
                sex: 'Male',
                age: 34,
                civilStatus: 'Civilly Married',
                occupation: 'Seasonal Farmer & Laborer',
                employmentType: 'Daily / Casual Worker',
                education: 'High School Level / Graduate',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: false,
                isChurchMarried: false,
                skillsTalents: ['Carpentry & Maintenance'],
            },
            {
                id: 'm-7',
                fullName: 'Teresa Dela Cruz',
                relationship: 'Spouse',
                sex: 'Female',
                age: 32,
                civilStatus: 'Civilly Married',
                occupation: 'Homemaker',
                employmentType: 'Homemaker',
                education: 'High School Level / Graduate',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: false,
            },
            {
                id: 'm-8',
                fullName: 'Mateo Dela Cruz',
                relationship: 'Son',
                sex: 'Male',
                age: 3,
                civilStatus: 'Single',
                education: 'Preschool / Early Childhood',
                isBaptized: false,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
                needsSacramentPrep: true,
            }
        ]
    },
    {
        id: 'FAM-2026-0044',
        familyName: 'Morales',
        headName: 'Carmelo Morales',
        address: 'Block 4 Lot 9, Riverside',
        barangay: 'San Isidro',
        sitioPurok: 'Purok 4',
        becCluster: 'BEC St. Jude',
        contactNumber: '0919-222-3344',
        dateEncoded: '2026-09-22',
        status: 'Returned for Correction',
        correctionNote: 'Please clarify date of birth for eldest child and confirm if Father Carmelo is open to home visit.',
        encodedBy: 'Ana Ramos (Volunteer)',
        housingSituation: 'Informal Settler / Living with Relatives',
        monthlyIncome: 'Under ₱5,000',
        isVulnerable: true,
        livelihoodAssistanceNeeded: 'Medical aid and shelter reinforcement assistance',
        massFrequency: 'Rarely / Never',
        becParticipation: 'Not active',
        pastoralNeeds: ['Pastoral home visit', 'Youth catechesis'],
        volunteerSkills: [],
        familyJoy: 'Children doing well in public school.',
        familyConcern: 'Flooding in riverside area during monsoon rains.',
        howParishCanHelp: 'Visit from the parish team or BEC leaders.',
        pastoralFollowup: {
            homeVisits: true,
            referral: 'Barangay Disaster Risk & Health Unit',
            assistanceProvided: 'Emergency relief assessment',
            sacramentalFollowup: true,
            nextPastoralAction: 'PPC home accompaniment visit scheduled',
        },
        trainingNeeds: [
            'Basic First Aid & Disaster Risk Reduction / Emergency Preparedness',
            'Nutrition for Non-Communicable Diseases (Hypertension, Diabetes)',
        ],
        consentGiven: true,
        members: [
            {
                id: 'm-9',
                fullName: 'Carmelo Morales',
                relationship: 'Head',
                sex: 'Male',
                age: 41,
                civilStatus: 'Single',
                isBaptized: true,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
            },
            {
                id: 'm-10',
                fullName: 'Gabriel Morales',
                relationship: 'Son',
                sex: 'Male',
                age: 14,
                civilStatus: 'Single',
                isBaptized: false,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
            }
        ]
    },
    {
        id: 'FAM-2026-0045',
        familyName: 'Mendoza',
        headName: 'Ramon Mendoza',
        address: '88 Mabini Street',
        barangay: 'San Isidro',
        sitioPurok: 'Purok 2',
        becCluster: 'BEC San Lorenzo',
        contactNumber: '0918-777-6543',
        dateEncoded: '2026-09-25',
        status: 'Approved',
        encodedBy: 'Mark Villanueva (Volunteer)',
        massFrequency: 'Every week',
        becParticipation: 'Regular',
        pastoralNeeds: ['Sacramental preparation for children', 'Church wedding assistance (Kasalang Bayan)'],
        volunteerSkills: ['Choir & Music', 'Youth Mentorship'],
        familyJoy: 'Children are healthy and doing great in school.',
        familyConcern: 'Need legal and church guidance to regularize civil marriage.',
        howParishCanHelp: 'Kasalang Bayan marriage seminar and baptism for our baby.',
        consentGiven: true,
        members: [
            {
                id: 'm-11',
                fullName: 'Ramon Mendoza',
                relationship: 'Head',
                sex: 'Male',
                age: 38,
                civilStatus: 'Civilly Married',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: false,
                isChurchMarried: false,
            },
            {
                id: 'm-12',
                fullName: 'Gina Mendoza',
                relationship: 'Spouse',
                sex: 'Female',
                age: 36,
                civilStatus: 'Civilly Married',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: false,
            },
            {
                id: 'm-13',
                fullName: 'Carlo Mendoza',
                relationship: 'Son',
                sex: 'Male',
                age: 10,
                civilStatus: 'Single',
                isBaptized: true,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
            },
            {
                id: 'm-14',
                fullName: 'Angel Mendoza',
                relationship: 'Daughter',
                sex: 'Female',
                age: 1,
                civilStatus: 'Single',
                isBaptized: false,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
            }
        ]
    },
    {
        id: 'FAM-2026-0046',
        familyName: 'Flores',
        headName: 'Lito Flores',
        address: '22 Ilang-Ilang St.',
        barangay: 'San Isidro',
        sitioPurok: 'Purok 3',
        becCluster: 'BEC St. Jude',
        contactNumber: '0920-333-8899',
        dateEncoded: '2026-09-26',
        status: 'Approved',
        encodedBy: 'Ana Ramos (Volunteer)',
        massFrequency: 'Every week',
        becParticipation: 'Regular',
        pastoralNeeds: ['Home communion for elderly / sick', 'Pastoral home visit by Parish team'],
        volunteerSkills: ['Medical / First Aid', 'Teaching / Catechesis'],
        familyJoy: 'Grateful for wife passing nurse licensing and serving the clinic.',
        familyConcern: 'Tatay Mariano is bedridden and cannot walk to church.',
        howParishCanHelp: 'Monthly home communion and anointing of the sick for Tatay Mariano.',
        consentGiven: true,
        members: [
            {
                id: 'm-15',
                fullName: 'Lito Flores',
                relationship: 'Head',
                sex: 'Male',
                age: 52,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
            },
            {
                id: 'm-16',
                fullName: 'Carmen Flores',
                relationship: 'Spouse',
                sex: 'Female',
                age: 50,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
            },
            {
                id: 'm-17',
                fullName: 'Mariano Flores',
                relationship: 'Parent',
                sex: 'Male',
                age: 82,
                civilStatus: 'Widowed',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
                isHomebound: true,
                specialNeeds: 'Bedridden senior; stroke survivor needing Viaticum',
            },
            {
                id: 'm-18',
                fullName: 'Paolo Flores',
                relationship: 'Son',
                sex: 'Male',
                age: 17,
                civilStatus: 'Single',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: false,
                isChurchMarried: false,
            }
        ]
    },
    {
        id: 'FAM-2026-0047',
        familyName: 'Bautista',
        headName: 'Noel Bautista',
        address: '56 MacArthur Highway',
        barangay: 'San Isidro',
        sitioPurok: 'Purok 5',
        becCluster: 'BEC San Pedro',
        contactNumber: '0917-888-9900',
        dateEncoded: '2026-09-27',
        status: 'Approved',
        encodedBy: 'Ana Ramos (Volunteer)',
        massFrequency: 'Every week',
        becParticipation: 'Regular',
        pastoralNeeds: ['Pastoral home visit by Parish team'],
        volunteerSkills: ['BEC Leader / Coordinator', 'Carpentry & Maintenance', 'Teaching / Catechesis'],
        familyJoy: 'Son Joshua successfully completed vocational electrical training.',
        familyConcern: 'Need more active volunteers for local purok chapel upkeep.',
        howParishCanHelp: 'Blessing of our house and family workshop.',
        consentGiven: true,
        members: [
            {
                id: 'm-19',
                fullName: 'Noel Bautista',
                relationship: 'Head',
                sex: 'Male',
                age: 48,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
            },
            {
                id: 'm-20',
                fullName: 'Elena Bautista',
                relationship: 'Spouse',
                sex: 'Female',
                age: 46,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
            },
            {
                id: 'm-21',
                fullName: 'Joshua Bautista',
                relationship: 'Son',
                sex: 'Male',
                age: 19,
                civilStatus: 'Single',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: false,
            }
        ]
    }
];

const INITIAL_CERTIFICATES: CertificateRecord[] = [
    {
        id: 'CERT-2026-001',
        requestId: 'REQ-101',
        recipientName: 'Juan Santos',
        familyId: 'FAM-2026-0042',
        certificateType: 'Baptismal',
        dateOfSacrament: 'October 14, 2014',
        placeOfSacrament: 'San Isidro Labrador Parish Church',
        ministerName: 'Rev. Fr. Emmanuel D. Garcia',
        bookNo: 'XIV',
        pageNo: '88',
        lineNo: '12',
        sponsorNames: 'Carlos Ramos & Elena Gutierrez',
        purpose: 'School Enrollment & First Communion Verification',
        dateIssued: '2026-09-21',
        status: 'Approved & Issued',
        issuedBy: 'Rev. Fr. Emmanuel D. Garcia (Parish Priest)'
    },
    {
        id: 'CERT-2026-002',
        requestId: 'REQ-102',
        recipientName: 'Sofia Santos',
        familyId: 'FAM-2026-0042',
        certificateType: 'Baptismal',
        dateOfSacrament: 'May 19, 2018',
        placeOfSacrament: 'San Isidro Labrador Parish Church',
        ministerName: 'Rev. Fr. Emmanuel D. Garcia',
        bookNo: 'XVI',
        pageNo: '45',
        lineNo: '06',
        sponsorNames: 'Miguel Perez & Carmela Ramos',
        purpose: 'First Holy Communion Class Requirement',
        status: 'Pending Review'
    }
];

interface ParishOptionItem {
    id: number;
    type: string;
    label: string;
    sort_order: number;
}

interface PrototypeProps {
    initialHouseholds?: any[];
    initialCertificates?: any[];
    parishOptions?: Record<string, ParishOptionItem[]>;
}

export default function Prototype({ initialHouseholds, initialCertificates, parishOptions }: PrototypeProps) {
    const mapBackendHousehold = (h: any): Household => ({
        id: h.family_code || `FAM-${h.id}`,
        dbId: h.id,
        familyName: h.family_name,
        headName: h.head_name,
        address: h.address,
        barangay: h.barangay,
        sitioPurok: h.sitio_purok,
        becCluster: h.bec_cluster,
        contactNumber: h.contact_number || '',
        housingSituation: h.housing_situation || 'Owned',
        monthlyIncome: h.monthly_income || '₱10,001 – ₱15,000',
        isVulnerable: Boolean(h.is_vulnerable),
        livelihoodAssistanceNeeded: h.livelihood_assistance_needed || '',
        pastoralFollowup: h.pastoral_followup || {},
        trainingNeeds: Array.isArray(h.training_needs) ? h.training_needs : [],
        dateEncoded: h.date_encoded ? String(h.date_encoded).split('T')[0] : '',
        status: h.status === 'approved' ? 'Approved' : h.status === 'returned_for_correction' ? 'Returned for Correction' : 'Pending Review',
        correctionNote: h.correction_notes,
        encodedBy: h.encoded_by?.name || 'Volunteer Encoder',
        massFrequency: h.mass_frequency || 'Every week',
        becParticipation: h.bec_participation || 'Regular',
        pastoralNeeds: Array.isArray(h.pastoral_needs) ? h.pastoral_needs : [],
        volunteerSkills: Array.isArray(h.volunteer_skills) ? h.volunteer_skills : [],
        familyJoy: h.family_joy || '',
        familyConcern: h.family_concern || '',
        howParishCanHelp: h.how_parish_can_help || '',
        consentGiven: Boolean(h.consent_given),
        members: (h.members || []).map((m: any) => ({
            id: `m-${m.id}`,
            dbId: m.id,
            fullName: m.full_name,
            relationship: m.relationship,
            sex: m.sex || 'Male',
            age: m.age || 0,
            birthdate: m.birthdate ? String(m.birthdate).split('T')[0] : undefined,
            civilStatus: m.civil_status || 'Single',
            occupation: m.occupation || '',
            employmentType: m.employment_type || '',
            yearsInService: m.years_in_service || '',
            education: m.education || '',
            maritalSituation: m.marital_situation || '',
            marriageDateParish: m.marriage_date_parish || '',
            isBaptized: Boolean(m.is_baptized),
            isFirstCommunion: Boolean(m.is_first_communion),
            isConfirmed: Boolean(m.is_confirmed),
            isChurchMarried: Boolean(m.is_church_married),
            needsSacramentPrep: Boolean(m.needs_sacrament_prep),
            isHomebound: Boolean(m.is_homebound),
            specialNeeds: m.special_needs,
            isSenior: Boolean(m.is_senior || (m.age >= 60)),
            isPwd: Boolean(m.is_pwd),
            pwdDetails: m.pwd_details || '',
            needsCommunionAnointing: Boolean(m.needs_communion_anointing),
            needsPastoralVisit: Boolean(m.needs_pastoral_visit),
            isOutOfSchoolYouth: Boolean(m.is_out_of_school_youth),
            youthMinistryInvolvement: Boolean(m.youth_ministry_involvement),
            parishMinistries: Array.isArray(m.parish_ministries) ? m.parish_ministries : [],
            skillsTalents: Array.isArray(m.skills_talents) ? m.skills_talents : [],
        })),
    });

    const mapBackendCertificate = (c: any): CertificateRecord => ({
        id: c.certificate_code || `CERT-${c.id}`,
        dbId: c.id,
        requestId: `REQ-${c.id}`,
        recipientName: c.recipient_name,
        familyId: c.household?.family_code || `FAM-${c.household_id}`,
        householdDbId: c.household_id,
        certificateType: c.certificate_type,
        dateOfSacrament: c.date_of_sacrament ? String(c.date_of_sacrament).split('T')[0] : 'Recorded in Parish Registry',
        placeOfSacrament: c.place_of_sacrament || 'San Isidro Labrador Parish Church',
        ministerName: c.minister_name || 'Rev. Fr. Emmanuel D. Garcia',
        bookNo: c.book_no || 'TBA',
        pageNo: c.page_no || 'TBA',
        lineNo: c.line_no || 'TBA',
        sponsorNames: c.sponsor_names || 'On file',
        purpose: c.purpose,
        dateIssued: c.issued_at ? String(c.issued_at).split('T')[0] : undefined,
        status: c.status === 'approved_and_issued' ? 'Approved & Issued' : 'Pending Review',
        issuedBy: c.issued_by?.name || 'Rev. Fr. Emmanuel D. Garcia (Parish Priest)',
    });

    // Top-level Role State (initialized with URL parameter if provided, e.g. /prototype?role=pastor)
    const [currentRole, setCurrentRole] = useState<'volunteer' | 'pastor' | 'member' | 'ppc'>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const role = params.get('role');
            if (role === 'volunteer' || role === 'pastor' || role === 'member' || role === 'ppc') {
                return role;
            }
        }
        return 'volunteer';
    });

    const setRoleWithUrl = (role: 'volunteer' | 'pastor' | 'member' | 'ppc') => {
        setCurrentRole(role);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('role', role);
            window.history.replaceState({}, '', url.toString());
        }
    };

    // Central Data Stores (Interactive Prototype connected to MySQL)
    const [households, setHouseholds] = useState<Household[]>(() => {
        if (initialHouseholds && initialHouseholds.length > 0) {
            return initialHouseholds.map(mapBackendHousehold);
        }
        return INITIAL_HOUSEHOLDS;
    });

    const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
        if (initialCertificates && initialCertificates.length > 0) {
            return initialCertificates.map(mapBackendCertificate);
        }
        return INITIAL_CERTIFICATES;
    });

    useEffect(() => {
        if (initialHouseholds && initialHouseholds.length > 0) {
            setHouseholds(initialHouseholds.map(mapBackendHousehold));
        }
    }, [initialHouseholds]);

    useEffect(() => {
        if (initialCertificates && initialCertificates.length > 0) {
            setCertificates(initialCertificates.map(mapBackendCertificate));
        }
    }, [initialCertificates]);

    // Volunteer Form State
    const [surveyStep, setSurveyStep] = useState<number>(1);
    const [volunteerTab, setVolunteerTab] = useState<'survey' | 'submissions'>('survey');
    const [formFamilyName, setFormFamilyName] = useState('');
    const [formHeadName, setFormHeadName] = useState('');
    const [formAddress, setFormAddress] = useState('');
    const [formTown, setFormTown] = useState('San Isidro');
    const [formProvince, setFormProvince] = useState('Pangasinan');
    const [formBarangay, setFormBarangay] = useState('San Isidro');
    const [formSitio, setFormSitio] = useState('Purok 2');
    const [formBec, setFormBec] = useState('BEC St. Jude');
    const [formContact, setFormContact] = useState('');

    // Area 8: Housing & Socio-Economic Status (Household level)
    const [formHousing, setFormHousing] = useState<string>('Owned');
    const [formIncome, setFormIncome] = useState<string>('₱10,001 – ₱15,000');
    const [formIsVulnerable, setFormIsVulnerable] = useState<boolean>(false);
    const [formLivelihoodAssistance, setFormLivelihoodAssistance] = useState<string>('');

    // Area 12: Pastoral Follow-up & Community Training Needs
    const [formFollowupHomeVisits, setFormFollowupHomeVisits] = useState<boolean>(false);
    const [formFollowupReferral, setFormFollowupReferral] = useState<string>('');
    const [formFollowupAssistance, setFormFollowupAssistance] = useState<string>('');
    const [formFollowupSacrament, setFormFollowupSacrament] = useState<boolean>(false);
    const [formFollowupNextAction, setFormFollowupNextAction] = useState<string>('');
    const [formTrainingNeeds, setFormTrainingNeeds] = useState<string[]>([
        'Digital Literacy for Everyday Life (using smartphones, QR codes, government e-services)',
        'Building Saving & Emergency Fund',
    ]);

    // Smart Member Modal State
    const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);
    const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
    const [memberDraft, setMemberDraft] = useState<FamilyMember>({
        id: 'new-1',
        fullName: '',
        relationship: 'Head',
        sex: 'Male',
        age: 40,
        birthdate: '1986-06-15',
        civilStatus: 'Married (Church)',
        occupation: '',
        employmentType: 'Permanent',
        yearsInService: '1–5 years',
        education: 'College Level / Graduate',
        maritalSituation: 'Sacramental',
        marriageDateParish: '',
        isBaptized: true,
        isFirstCommunion: true,
        isConfirmed: true,
        isChurchMarried: true,
        needsSacramentPrep: false,
        isHomebound: false,
        specialNeeds: '',
        isSenior: false,
        isPwd: false,
        pwdDetails: '',
        needsCommunionAnointing: false,
        needsPastoralVisit: false,
        isOutOfSchoolYouth: false,
        youthMinistryInvolvement: false,
        parishMinistries: [],
        skillsTalents: [],
    });

    const [formMembers, setFormMembers] = useState<FamilyMember[]>([
        {
            id: 'new-1',
            fullName: 'Juan Dela Cruz',
            relationship: 'Head',
            sex: 'Male',
            age: 42,
            birthdate: '1984-03-12',
            civilStatus: 'Married (Church)',
            occupation: 'Carpenter & Small Contractor',
            employmentType: 'Self-employed / Business Owner',
            yearsInService: 'More than 10 years',
            education: 'High School Level / Graduate',
            maritalSituation: 'Sacramental (Church)',
            marriageDateParish: '2008-05-10 / San Isidro Parish',
            isBaptized: true,
            isFirstCommunion: true,
            isConfirmed: true,
            isChurchMarried: true,
            needsSacramentPrep: false,
            isHomebound: false,
            isSenior: false,
            isPwd: false,
            parishMinistries: ['Facilities Maintenance'],
            skillsTalents: ['Carpentry & Maintenance'],
        }
    ]);
    const [formMassFreq, setFormMassFreq] = useState<'Every week' | 'Almost every week' | 'Occasionally' | 'Rarely / Never'>('Every week');
    const [formBecPart, setFormBecPart] = useState<'Regular' | 'Sometimes' | 'Rarely' | 'Not active'>('Regular');
    const [formNeeds, setFormNeeds] = useState<string[]>([]);
    const [formOtherNeed, setFormOtherNeed] = useState('');
    const [formSkills, setFormSkills] = useState<string[]>([]);
    const [formJoy, setFormJoy] = useState('');
    const [formConcern, setFormConcern] = useState('');
    const [formHelp, setFormHelp] = useState('');
    const [formConsent, setFormConsent] = useState(false);
    const [volunteerSuccessMsg, setVolunteerSuccessMsg] = useState('');

    // Form Completeness & Pre-Submission Audit
    interface FormAuditItem {
        id: string;
        label: string;
        step: number;
        severity: 'required' | 'recommended';
        detail?: string;
    }

    const auditItems: FormAuditItem[] = [];
    if (!formFamilyName.trim()) {
        auditItems.push({ id: 'family_name', label: 'Family / Household Name', step: 1, severity: 'required', detail: 'Family surname is required.' });
    }
    if (!formHeadName.trim()) {
        auditItems.push({ id: 'head_name', label: 'Household Head Name', step: 1, severity: 'required', detail: 'Full name of household head.' });
    }
    if (!formAddress.trim()) {
        auditItems.push({ id: 'address', label: 'Complete Street Address', step: 1, severity: 'required', detail: 'House number or street address.' });
    }
    if (formMembers.length === 0) {
        auditItems.push({ id: 'members_count', label: 'Household Members Roster', step: 2, severity: 'required', detail: 'Add at least 1 family member to this survey.' });
    } else {
        const missingNameIdx = formMembers.findIndex(m => !m.fullName.trim());
        if (missingNameIdx !== -1) {
            auditItems.push({ id: 'member_name', label: `Member #${missingNameIdx + 1} Name`, step: 2, severity: 'required', detail: `Member #${missingNameIdx + 1} is missing a full name.` });
        }
    }
    if (!formConsent) {
        auditItems.push({ id: 'consent', label: 'Respondent Informed Consent', step: 4, severity: 'required', detail: 'Check consent checkbox before submitting.' });
    }

    // Recommended checks
    if (!formContact.trim()) {
        auditItems.push({ id: 'contact', label: 'Contact Phone Number', step: 1, severity: 'recommended', detail: 'Adding a mobile number aids parish follow-up.' });
    }
    if (formNeeds.length === 0 && !formOtherNeed.trim()) {
        auditItems.push({ id: 'pastoral_needs', label: 'Pastoral Care Needs', step: 3, severity: 'recommended', detail: 'Check if household has sacramental or pastoral needs.' });
    }

    const requiredIssues = auditItems.filter(i => i.severity === 'required');
    const recommendedIssues = auditItems.filter(i => i.severity === 'recommended');
    const isFormReadyToSubmit = requiredIssues.length === 0;

    // Dynamic dropdown options from database
    const barangayOptions: ParishOptionItem[] = parishOptions?.barangay ?? [];
    const sitioPurokOptions: ParishOptionItem[] = parishOptions?.sitio_purok ?? [];
    const becClusterOptions: ParishOptionItem[] = parishOptions?.bec_cluster ?? [];

    // Fallback defaults when DB is empty
    const barangayLabels = barangayOptions.length > 0 ? barangayOptions.map(o => o.label) : ['San Isidro', 'Santa Rosa', 'San Roque'];
    const sitioPurokLabels = sitioPurokOptions.length > 0 ? sitioPurokOptions.map(o => o.label) : ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4'];
    const becClusterLabels = becClusterOptions.length > 0 ? becClusterOptions.map(o => o.label) : ['BEC St. Jude', 'BEC San Pedro', 'BEC San Lorenzo'];

    // Settings (CRUD) state
    const [settingsCategory, setSettingsCategory] = useState<'barangay' | 'sitio_purok' | 'bec_cluster'>('barangay');
    const [newOptionLabel, setNewOptionLabel] = useState('');
    const [editingOptionId, setEditingOptionId] = useState<number | null>(null);
    const [editingOptionLabel, setEditingOptionLabel] = useState('');

    const handleAddOption = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOptionLabel.trim()) return;
        router.post('/parish-options', { type: settingsCategory, label: newOptionLabel.trim() }, {
            preserveScroll: true,
            onSuccess: () => setNewOptionLabel(''),
        });
    };

    const handleUpdateOption = (id: number) => {
        if (!editingOptionLabel.trim()) return;
        router.patch(`/parish-options/${id}`, { label: editingOptionLabel.trim() }, {
            preserveScroll: true,
            onSuccess: () => { setEditingOptionId(null); setEditingOptionLabel(''); },
        });
    };

    const handleDeleteOption = (id: number, label: string) => {
        if (!confirm(`Remove "${label}" from the list?`)) return;
        router.delete(`/parish-options/${id}`, { preserveScroll: true });
    };

    // Pastor View State (Defaults to useful Reports Dashboard)
    const [pastorTab, setPastorTab] = useState<'reports' | 'review' | 'certificates' | 'records' | 'settings'>('reports');
    const [selectedHouseholdForReview, setSelectedHouseholdForReview] = useState<Household | null>(null);
    const [correctionNoteInput, setCorrectionNoteInput] = useState('');
    const [searchRegistry, setSearchRegistry] = useState('');
    const [filterBec, setFilterBec] = useState('All');

    // Certificate Issuance State (Pastor)
    const [selectedCertToIssue, setSelectedCertToIssue] = useState<CertificateRecord | null>(null);
    const [certBookNo, setCertBookNo] = useState('XVI');
    const [certPageNo, setCertPageNo] = useState('52');
    const [certLineNo, setCertLineNo] = useState('08');
    const [certSponsors, setCertSponsors] = useState('Pedro Bautista & Teresa Mendoza');

    // Member View State
    const [viewingCertificate, setViewingCertificate] = useState<CertificateRecord | null>(null);
    const [accessDeniedAlert, setAccessDeniedAlert] = useState(false);
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [requestMemberName, setRequestMemberName] = useState('Juan Santos');
    const [requestPurpose, setRequestPurpose] = useState('School Requirement');

    // --- VOLUNTEER ACTIONS ---
    const handleOpenAddMember = () => {
        setEditingMemberIndex(null);
        setMemberDraft({
            id: `new-${Date.now()}`,
            fullName: '',
            relationship: formMembers.length === 0 ? 'Head' : formMembers.length === 1 ? 'Spouse' : 'Son',
            sex: 'Male',
            age: 20,
            birthdate: '',
            civilStatus: 'Single',
            occupation: '',
            employmentType: 'Permanent (P)',
            yearsInService: '1–5 years',
            education: 'High School Level / Graduate',
            maritalSituation: 'Single',
            marriageDateParish: '',
            isBaptized: true,
            isFirstCommunion: true,
            isConfirmed: false,
            isChurchMarried: false,
            needsSacramentPrep: false,
            isHomebound: false,
            specialNeeds: '',
            isSenior: false,
            isPwd: false,
            pwdDetails: '',
            needsCommunionAnointing: false,
            needsPastoralVisit: false,
            isOutOfSchoolYouth: false,
            youthMinistryInvolvement: false,
            parishMinistries: [],
            skillsTalents: [],
        });
        setIsMemberModalOpen(true);
    };

    const handleOpenEditMember = (index: number) => {
        setEditingMemberIndex(index);
        setMemberDraft({ ...formMembers[index] });
        setIsMemberModalOpen(true);
    };

    const handleSaveMemberDraft = (saved: FamilyMember) => {
        if (editingMemberIndex !== null) {
            const updated = [...formMembers];
            updated[editingMemberIndex] = saved;
            setFormMembers(updated);
        } else {
            setFormMembers([...formMembers, { ...saved, id: `new-${Date.now()}` }]);
        }
        setIsMemberModalOpen(false);
    };

    const removeMember = (index: number) => {
        if (formMembers.length === 1) {
            alert('A household profile must contain at least 1 member.');
            return;
        }
        setFormMembers(formMembers.filter((_, i) => i !== index));
    };

    const toggleNeed = (need: string) => {
        setFormNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);
    };

    const toggleSkill = (skill: string) => {
        setFormSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };

    const toggleTrainingNeed = (topic: string) => {
        setFormTrainingNeeds(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
    };

    const handleVolunteerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formFamilyName.trim()) {
            alert('Please enter the family or household name.');
            return;
        }
        if (!formConsent) {
            alert('Consent must be checked before submitting.');
            return;
        }

        router.post('/households', {
            family_name: formFamilyName,
            head_name: formHeadName,
            address: formAddress,
            barangay: formBarangay,
            sitio_purok: formSitio,
            bec_cluster: formBec,
            contact_number: formContact,
            housing_situation: formHousing,
            monthly_income: formIncome,
            is_vulnerable: formIsVulnerable,
            livelihood_assistance_needed: formLivelihoodAssistance,
            mass_frequency: formMassFreq,
            bec_participation: formBecPart,
            pastoral_needs: formOtherNeed.trim() ? [...formNeeds, `Other: ${formOtherNeed.trim()}`] : formNeeds,
            volunteer_skills: formSkills,
            pastoral_followup: {
                homeVisits: formFollowupHomeVisits,
                referral: formFollowupReferral,
                assistanceProvided: formFollowupAssistance,
                sacramentalFollowup: formFollowupSacrament,
                nextPastoralAction: formFollowupNextAction,
            },
            training_needs: formTrainingNeeds,
            family_joy: formJoy,
            family_concern: formConcern,
            how_parish_can_help: formHelp,
            consent_given: formConsent,
            members: formMembers.map(m => ({
                full_name: m.fullName.trim() || 'Household Member',
                relationship: m.relationship,
                sex: m.sex,
                age: m.age,
                birthdate: m.birthdate || null,
                civil_status: m.civilStatus,
                occupation: m.occupation || null,
                employment_type: m.employmentType || null,
                years_in_service: m.yearsInService || null,
                education: m.education || null,
                marital_situation: m.maritalSituation || null,
                marriage_date_parish: m.marriageDateParish || null,
                is_baptized: m.isBaptized,
                is_first_communion: m.isFirstCommunion,
                is_confirmed: m.isConfirmed,
                is_church_married: m.isChurchMarried,
                needs_sacrament_prep: m.needsSacramentPrep ?? false,
                is_homebound: m.isHomebound ?? false,
                special_needs: m.specialNeeds ?? '',
                is_senior: m.isSenior ?? (m.age >= 60),
                is_pwd: m.isPwd ?? false,
                pwd_details: m.pwdDetails ?? '',
                needs_communion_anointing: m.needsCommunionAnointing ?? false,
                needs_pastoral_visit: m.needsPastoralVisit ?? false,
                is_out_of_school_youth: m.isOutOfSchoolYouth ?? false,
                youth_ministry_involvement: m.youthMinistryInvolvement ?? false,
                parish_ministries: m.parishMinistries ?? [],
                skills_talents: m.skillsTalents ?? [],
            }))
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setVolunteerSuccessMsg(`Survey for the ${formFamilyName} family saved to the database and sent to the Pastor.`);
                setVolunteerTab('submissions');
                // Reset form
                setFormFamilyName('');
                setFormHeadName('');
                setFormAddress('');
                setFormContact('');
                setFormHousing('Owned');
                setFormIncome('₱10,001 – ₱15,000');
                setFormIsVulnerable(false);
                setFormLivelihoodAssistance('');
                setFormJoy('');
                setFormConcern('');
                setFormHelp('');
                setFormNeeds([]);
                setFormOtherNeed('');
                setFormSkills([]);
                setFormTrainingNeeds([
                    'Digital Literacy for Everyday Life (using smartphones, QR codes, government e-services)',
                    'Building Saving & Emergency Fund',
                ]);
                setFormFollowupHomeVisits(false);
                setFormFollowupReferral('');
                setFormFollowupAssistance('');
                setFormFollowupNextAction('');
                setFormConsent(false);
                setSurveyStep(1);
            }
        });
    };

    // --- PASTOR ACTIONS ---
    const handleApproveHousehold = (id: string) => {
        const target = households.find(h => h.id === id);
        if (!target) return;

        if (target.dbId) {
            router.post(`/households/${target.dbId}/review`, {
                action: 'approve'
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedHouseholdForReview(null);
                }
            });
        } else {
            setHouseholds(households.map(h => h.id === id ? { ...h, status: 'Approved', correctionNote: undefined } : h));
            setSelectedHouseholdForReview(null);
        }
    };

    const handleReturnForCorrection = (id: string) => {
        if (!correctionNoteInput.trim()) {
            alert('Please write a note explaining what needs correction.');
            return;
        }

        const target = households.find(h => h.id === id);
        if (!target) return;

        if (target.dbId) {
            router.post(`/households/${target.dbId}/review`, {
                action: 'return_for_correction',
                correction_notes: correctionNoteInput
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedHouseholdForReview(null);
                    setCorrectionNoteInput('');
                }
            });
        } else {
            setHouseholds(households.map(h => h.id === id ? {
                ...h,
                status: 'Returned for Correction',
                correctionNote: correctionNoteInput
            } : h));
            setSelectedHouseholdForReview(null);
            setCorrectionNoteInput('');
        }
    };

    const handleIssueCertificate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCertToIssue) return;

        if (selectedCertToIssue.dbId) {
            router.post(`/certificates/${selectedCertToIssue.dbId}/issue`, {
                book_no: certBookNo,
                page_no: certPageNo,
                line_no: certLineNo,
                sponsor_names: certSponsors,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedCertToIssue(null);
                }
            });
        } else {
            setCertificates(certificates.map(c => c.id === selectedCertToIssue.id ? {
                ...c,
                status: 'Approved & Issued',
                dateIssued: new Date().toISOString().split('T')[0],
                bookNo: certBookNo,
                pageNo: certPageNo,
                lineNo: certLineNo,
                sponsorNames: certSponsors,
                issuedBy: 'Rev. Fr. Emmanuel D. Garcia (Parish Priest)'
            } : c));
            setSelectedCertToIssue(null);
        }
    };

    // --- MEMBER ACTIONS ---
    const handleMemberRequestCertificate = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedHousehold = households.find(h => h.id === 'FAM-2026-0042') || households[0];
        const targetMember = selectedHousehold?.members.find(m => m.fullName === requestMemberName) || selectedHousehold?.members[0];

        if (selectedHousehold?.dbId && targetMember?.dbId) {
            router.post('/certificates/request', {
                household_id: selectedHousehold.dbId,
                family_member_id: targetMember.dbId,
                certificate_type: 'Baptismal',
                purpose: requestPurpose,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setRequestModalOpen(false);
                }
            });
        } else {
            const newReq: CertificateRecord = {
                id: `CERT-2026-00${certificates.length + 1}`,
                requestId: `REQ-${Date.now().toString().slice(-3)}`,
                recipientName: requestMemberName,
                familyId: selectedHousehold?.id || 'FAM-2026-0042',
                certificateType: 'Baptismal',
                dateOfSacrament: 'Recorded in Parish Registry',
                placeOfSacrament: 'San Isidro Labrador Parish Church',
                ministerName: 'Rev. Fr. Emmanuel D. Garcia',
                bookNo: 'To be assigned by Pastor',
                pageNo: 'To be assigned by Pastor',
                lineNo: 'To be assigned by Pastor',
                sponsorNames: 'On file',
                purpose: requestPurpose,
                status: 'Pending Review'
            };
            setCertificates([...certificates, newReq]);
            setRequestModalOpen(false);
        }
    };

    // Filtered households for registry
    const filteredHouseholds = households.filter(h => {
        const matchesSearch = h.familyName.toLowerCase().includes(searchRegistry.toLowerCase()) ||
            h.headName.toLowerCase().includes(searchRegistry.toLowerCase()) ||
            h.address.toLowerCase().includes(searchRegistry.toLowerCase());
        const matchesBec = filterBec === 'All' || h.becCluster === filterBec;
        return matchesSearch && matchesBec;
    });

    const pendingHouseholdCount = households.filter(h => h.status === 'Pending Review').length;
    const pendingCertCount = certificates.filter(c => c.status === 'Pending Review').length;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title="Parish Information System - Prototype" />

            {/* TOP HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
                        {/* Logo & Simple Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                                <Church className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                                    San Isidro Labrador Parish
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Prototype
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Parish Family, BEC & Sacramental Records
                                </p>
                            </div>
                        </div>

                        {/* WELCOME PAGE & ROLE SWITCHER */}
                        <div className="flex items-center gap-2">
                            <a
                                href="/"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-xs"
                                title="Back to Public Welcome Page"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                                <span>Welcome Page</span>
                            </a>

                            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 overflow-x-auto text-xs font-medium">
                                <button
                                    onClick={() => setRoleWithUrl('volunteer')}
                                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${currentRole === 'volunteer'
                                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <Users className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Volunteer</span>
                                </button>

                                <button
                                    onClick={() => setRoleWithUrl('pastor')}
                                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap relative ${currentRole === 'pastor'
                                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <Church className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Pastor</span>
                                    {(pendingHouseholdCount > 0 || pendingCertCount > 0) && (
                                        <span className="w-4 h-4 text-[10px] rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                                            {pendingHouseholdCount + pendingCertCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setRoleWithUrl('member')}
                                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${currentRole === 'member'
                                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <Award className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Family Member</span>
                                </button>

                                <button
                                    onClick={() => setRoleWithUrl('ppc')}
                                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${currentRole === 'ppc'
                                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Parish Council (PPC)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HELPER BANNER */}
                <div className="bg-slate-100/80 border-t border-slate-200/60 px-4 py-1.5 text-[11px] text-slate-600 text-center flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>
                        Viewing as: <strong>{currentRole === 'volunteer' ? 'Volunteer Field Encoder' : currentRole === 'pastor' ? 'Parish Priest (Sole Approval & Issuer)' : currentRole === 'member' ? 'Parishioner (Santos Household)' : 'Parish Pastoral Council (Summary)'}</strong>. Use the buttons on top to switch roles anytime.
                    </span>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* ========================================================================= */}
                {/* 1. VOLUNTEER VIEW                                                         */}
                {/* ========================================================================= */}
                {currentRole === 'volunteer' && (
                    <div className="space-y-6">
                        {/* Header Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">Assigned Area</span>
                                <p className="text-base font-bold text-slate-900 mt-1">Barangay San Isidro</p>
                                <span className="text-[11px] text-slate-500">BEC St. Jude & San Pedro</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">Approved Families</span>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">
                                    {households.filter(h => h.status === 'Approved').length}
                                </p>
                                <span className="text-[11px] text-slate-500">Verified by Pastor</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">Pending Review</span>
                                <p className="text-2xl font-bold text-amber-600 mt-1">{pendingHouseholdCount}</p>
                                <span className="text-[11px] text-slate-500">Awaiting approval</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">Returned for Correction</span>
                                <p className="text-2xl font-bold text-rose-600 mt-1">
                                    {households.filter(h => h.status === 'Returned for Correction').length}
                                </p>
                                <span className="text-[11px] text-slate-500">Requires follow-up</span>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">
                            <button
                                onClick={() => setVolunteerTab('survey')}
                                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${volunteerTab === 'survey'
                                    ? 'border-emerald-600 text-emerald-700 font-semibold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                New Family Survey
                            </button>
                            <button
                                onClick={() => setVolunteerTab('submissions')}
                                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${volunteerTab === 'submissions'
                                    ? 'border-emerald-600 text-emerald-700 font-semibold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                <FileText className="w-4 h-4" />
                                Submissions & Status ({households.length})
                            </button>
                        </div>

                        {/* SUBMISSIONS TAB */}
                        {volunteerTab === 'submissions' && (
                            <div className="space-y-4">
                                {volunteerSuccessMsg && (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>{volunteerSuccessMsg}</span>
                                        </div>
                                        <button onClick={() => setVolunteerSuccessMsg('')} className="text-emerald-700 font-bold hover:underline text-xs">
                                            Dismiss
                                        </button>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-900 text-sm">Family Records Encoded</h3>
                                        <span className="text-xs text-slate-500">Click a record to see notes or details</span>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {households.map(h => (
                                            <div key={h.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 text-sm">{h.familyName} Family</span>
                                                        <span className="text-xs text-slate-400">({h.id})</span>
                                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${h.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                                            h.status === 'Returned for Correction' ? 'bg-rose-100 text-rose-800' :
                                                                'bg-amber-100 text-amber-800'
                                                            }`}>
                                                            {h.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                                                        <span><strong>Head:</strong> {h.headName}</span>
                                                        <span><strong>Address:</strong> {h.address}, {h.sitioPurok}</span>
                                                        <span><strong>BEC:</strong> {h.becCluster}</span>
                                                        <span><strong>Members:</strong> {h.members.length} persons</span>
                                                    </div>
                                                    {h.correctionNote && (
                                                        <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
                                                            <strong>Pastor Note:</strong> {h.correctionNote}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400">Date: {h.dateEncoded}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SURVEY FORM TAB */}
                        {volunteerTab === 'survey' && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
                                {/* Stepper Navigation */}
                                <div className="border-b border-slate-200 pb-4">
                                    <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-medium">
                                        <button
                                            onClick={() => setSurveyStep(1)}
                                            className={`flex items-center gap-1.5 ${surveyStep === 1 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
                                        >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${surveyStep === 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
                                            Household
                                        </button>
                                        <div className="w-8 h-px bg-slate-200"></div>
                                        <button
                                            onClick={() => setSurveyStep(2)}
                                            className={`flex items-center gap-1.5 ${surveyStep === 2 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
                                        >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${surveyStep === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
                                            Members & Sacraments
                                        </button>
                                        <div className="w-8 h-px bg-slate-200"></div>
                                        <button
                                            onClick={() => setSurveyStep(3)}
                                            className={`flex items-center gap-1.5 ${surveyStep === 3 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
                                        >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${surveyStep === 3 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
                                            Needs & Gifts
                                        </button>
                                        <div className="w-8 h-px bg-slate-200"></div>
                                        <button
                                            type="button"
                                            onClick={() => setSurveyStep(4)}
                                            className={`flex items-center gap-1.5 ${surveyStep === 4 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
                                        >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${surveyStep === 4 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>4</span>
                                            <span>Review & Submit</span>
                                            {requiredIssues.length > 0 ? (
                                                <span className="w-2 h-2 rounded-full bg-amber-500" title={`${requiredIssues.length} items to check`} />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-emerald-500" title="All required fields ready" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                                    {/* STEP 1: HOUSEHOLD INFORMATION */}
                                    {surveyStep === 1 && (
                                        <div className="space-y-4 max-w-2xl mx-auto">
                                            <div className="border-b border-slate-100 pb-2">
                                                <h3 className="font-semibold text-slate-900 text-base">Step 1: Household Identification</h3>
                                                <p className="text-xs text-slate-500">Record basic family location and contact details.</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Family / Household Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formFamilyName}
                                                        onChange={e => setFormFamilyName(e.target.value)}
                                                        placeholder="e.g. Dela Cruz"
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Household Head Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formHeadName}
                                                        onChange={e => setFormHeadName(e.target.value)}
                                                        placeholder="e.g. Juan Dela Cruz"
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Complete Address / House Number & Street *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formAddress}
                                                        onChange={e => setFormAddress(e.target.value)}
                                                        placeholder="e.g. 45 Magsaysay St."
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Town / Municipality
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formTown}
                                                        onChange={e => setFormTown(e.target.value)}
                                                        placeholder="e.g. San Isidro"
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Province
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formProvince}
                                                        onChange={e => setFormProvince(e.target.value)}
                                                        placeholder="e.g. Pangasinan"
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Barangay
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formBarangay}
                                                            onChange={e => setFormBarangay(e.target.value)}
                                                            className="w-full appearance-none text-sm px-3 pr-8 py-2 border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
                                                        >
                                                            {barangayLabels.map(label => (
                                                                <option key={label} value={label}>{label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Sitio / Purok
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formSitio}
                                                            onChange={e => setFormSitio(e.target.value)}
                                                            className="w-full appearance-none text-sm px-3 pr-8 py-2 border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
                                                        >
                                                            {sitioPurokLabels.map(label => (
                                                                <option key={label} value={label}>{label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        BEC (Barangay Ecclesiastical Community)
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formBec}
                                                            onChange={e => setFormBec(e.target.value)}
                                                            className="w-full appearance-none text-sm px-3 pr-8 py-2 border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
                                                        >
                                                            {becClusterLabels.map(label => (
                                                                <option key={label} value={label}>{label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Contact Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formContact}
                                                        onChange={e => setFormContact(e.target.value)}
                                                        placeholder="09xx-xxx-xxxx"
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                                                    />
                                                </div>
                                            </div>

                                            {/* SOCIO-ECONOMIC & HOUSING PROFILE (HOUSEHOLD LEVEL) */}
                                            <div className="pt-4 border-t border-slate-200 space-y-3.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                                        <Home className="w-3.5 h-3.5 text-emerald-700" />
                                                        Household Socio-Economic &amp; Housing Situation
                                                    </span>
                                                    <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                        Household Shared Data
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                                            Housing Situation
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={formHousing}
                                                                onChange={e => setFormHousing(e.target.value)}
                                                                className="w-full appearance-none text-xs px-3 pr-8 py-2 border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
                                                            >
                                                                <option value="Owned">Owned (O) — Sariling Bahay at Lupa</option>
                                                                <option value="Rented">Rented (R) — Upa</option>
                                                                <option value="Living with extended family">Living with Extended Family (E) — Nakatira sa Kamag-anak</option>
                                                            </select>
                                                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                                            Monthly Household Income
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={formIncome}
                                                                onChange={e => setFormIncome(e.target.value)}
                                                                className="w-full appearance-none text-xs px-3 pr-8 py-2 border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
                                                            >
                                                                <option value="Below ₱5,000">Below ₱5,000</option>
                                                                <option value="₱5,001 – ₱10,000">₱5,001 – ₱10,000</option>
                                                                <option value="₱10,001 – ₱15,000">₱10,001 – ₱15,000</option>
                                                                <option value="Above ₱15,000">Above ₱15,000</option>
                                                            </select>
                                                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                                                            <input
                                                                type="checkbox"
                                                                checked={formIsVulnerable}
                                                                onChange={e => setFormIsVulnerable(e.target.checked)}
                                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                                            />
                                                            <span>Vulnerable Household with Material / Livelihood Needs</span>
                                                        </label>
                                                        {formIsVulnerable && (
                                                            <input
                                                                type="text"
                                                                value={formLivelihoodAssistance}
                                                                onChange={e => setFormLivelihoodAssistance(e.target.value)}
                                                                placeholder="Specify livelihood assistance requested (e.g. Sari-sari store capital, fishing gear, rice assistance)"
                                                                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(4)}
                                                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                                                >
                                                    <ClipboardCheck className="w-4 h-4 text-slate-400" /> Review Form First
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(2)}
                                                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 flex items-center gap-1.5 shadow-xs"
                                                >
                                                    Next: Family Members Roster <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: MEMBERS ROSTER & PROGRESSIVE DISCLOSURE DRAWER */}
                                    {surveyStep === 2 && (
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                                                        <span>Step 2: Household Members Roster</span>
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                            {formMembers.length} Person{formMembers.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </h3>
                                                    <p className="text-xs text-slate-500">
                                                        Click &ldquo;Add Family Member&rdquo; or &ldquo;Edit Profile&rdquo; to complete the detailed questionnaire for each person.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleOpenAddMember}
                                                    className="px-3.5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition-colors self-start sm:self-auto"
                                                >
                                                    Add Family Member
                                                </button>
                                            </div>

                                            {/* MEMBERS CARDS LIST */}
                                            <div className="space-y-3">
                                                {formMembers.map((member, index) => (
                                                    <div
                                                        key={member.id}
                                                        className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-2xs"
                                                    >
                                                        <div className="flex items-start gap-3.5 flex-1">
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm border border-emerald-200">
                                                                {index + 1}
                                                            </div>

                                                            <div className="space-y-1.5 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-bold text-slate-900 text-sm">
                                                                        {member.fullName || '(Name not entered)'}
                                                                    </span>
                                                                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[11px] font-semibold">
                                                                        {member.relationship}
                                                                    </span>
                                                                    <span className="text-xs text-slate-500">
                                                                        {member.sex} &bull; {member.age} yrs old &bull; {member.civilStatus}
                                                                    </span>
                                                                </div>

                                                                {/* Education & Occupation summary */}
                                                                <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                                                                    {member.occupation && (
                                                                        <span><strong>Work:</strong> {member.occupation} ({member.employmentType || 'Permanent'})</span>
                                                                    )}
                                                                    {member.education && (
                                                                        <span><strong>Education:</strong> {member.education}</span>
                                                                    )}
                                                                    {member.marriageDateParish && (
                                                                        <span><strong>Marriage:</strong> {member.marriageDateParish}</span>
                                                                    )}
                                                                </div>

                                                                {/* Sacramental & Care Badges */}
                                                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                                                        member.isBaptized ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                                                                    }`}>
                                                                        {member.isBaptized ? '✓ Baptized' : '✗ Unbaptized'}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                                                        member.isFirstCommunion ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                                                                    }`}>
                                                                        {member.isFirstCommunion ? '✓ Communion' : '— No Communion'}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                                                        member.isConfirmed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                                                                    }`}>
                                                                        {member.isConfirmed ? '✓ Confirmed' : '— No Confirmation'}
                                                                    </span>
                                                                    {member.isChurchMarried && (
                                                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                            ✓ Church Married
                                                                        </span>
                                                                    )}

                                                                    {/* Flags */}
                                                                    {member.needsSacramentPrep && (
                                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                                                            ⚠️ Needs Sacraments
                                                                        </span>
                                                                    )}
                                                                    {(member.isSenior || member.age >= 60) && (
                                                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                                                            Senior 60+
                                                                        </span>
                                                                    )}
                                                                    {member.isHomebound && (
                                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                                                            🏠 Homebound
                                                                        </span>
                                                                    )}
                                                                    {member.isPwd && (
                                                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                                            ♿ PWD
                                                                        </span>
                                                                    )}
                                                                    {member.needsCommunionAnointing && (
                                                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                                            🕊️ Viaticum Call
                                                                        </span>
                                                                    )}
                                                                    {member.isOutOfSchoolYouth && (
                                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                                                            OSY Youth
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEditMember(index)}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" /> Edit Profile
                                                            </button>

                                                            {formMembers.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMember(index)}
                                                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                                                                    title="Remove member"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(1)}
                                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1"
                                                >
                                                    <ChevronLeft className="w-4 h-4" /> Back to Household
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSurveyStep(4)}
                                                        className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <ClipboardCheck className="w-4 h-4 text-slate-400" /> Review Form
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSurveyStep(3)}
                                                        className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 flex items-center gap-1 shadow-xs"
                                                    >
                                                        Next: Pastoral Needs & Gifts <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: PASTORAL NEEDS, EXTENSION TRAINING & STEWARDSHIP */}
                                    {surveyStep === 3 && (
                                        <div className="space-y-6 max-w-2xl mx-auto">
                                            <div className="border-b border-slate-100 pb-2">
                                                <h3 className="font-semibold text-slate-900 text-base">Step 3: Pastoral Care, Community Training & Follow-up</h3>
                                                <p className="text-xs text-slate-500">Record religious participation, university extension training interests, and parish follow-up actions.</p>
                                            </div>

                                            {/* Mass & BEC */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">Sunday Mass Attendance</label>
                                                    <div className="relative">
                                                        <select
                                                            value={formMassFreq}
                                                            onChange={e => setFormMassFreq(e.target.value as any)}
                                                            className="w-full text-xs pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                                                        >
                                                            <option value="Every week">Every week</option>
                                                            <option value="Almost every week">Almost every week</option>
                                                            <option value="Occasionally">Occasionally</option>
                                                            <option value="Rarely / Never">Rarely / Never</option>
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">BEC Gathering Participation</label>
                                                    <div className="relative">
                                                        <select
                                                            value={formBecPart}
                                                            onChange={e => setFormBecPart(e.target.value as any)}
                                                            className="w-full text-xs pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                                                        >
                                                            <option value="Regular">Regular</option>
                                                            <option value="Sometimes">Sometimes</option>
                                                            <option value="Rarely">Rarely</option>
                                                            <option value="Not active">Not active</option>
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pastoral Needs Checklist */}
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                    Pastoral Needs Requested by Household:
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                    {[
                                                        'Sacramental preparation for children',
                                                        'Home communion for elderly / sick',
                                                        'Church wedding assistance (Kasalang Bayan)',
                                                        'Youth catechesis / involvement',
                                                        'Livelihood / educational help',
                                                        'Pastoral home visit by Parish team'
                                                    ].map(need => (
                                                        <label key={need} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                checked={formNeeds.includes(need)}
                                                                onChange={() => toggleNeed(need)}
                                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                                            />
                                                            <span className="text-slate-800">{need}</span>
                                                        </label>
                                                    ))}
                                                </div>

                                                {/* Other / custom need */}
                                                <div className="pt-1">
                                                    <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs">
                                                        <input
                                                            type="checkbox"
                                                            checked={formOtherNeed.length > 0}
                                                            onChange={e => { if (!e.target.checked) setFormOtherNeed(''); }}
                                                            className="rounded text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="text-slate-800 font-medium">Other specific pastoral need</span>
                                                    </label>
                                                    {formOtherNeed !== undefined && (
                                                        <input
                                                            type="text"
                                                            value={formOtherNeed}
                                                            onChange={e => setFormOtherNeed(e.target.value)}
                                                            placeholder="Please describe the specific pastoral need..."
                                                            className="mt-1.5 w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-emerald-500 bg-white"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Community Training Needs */}
                                            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <GraduationCap className="w-4 h-4 text-emerald-700" />
                                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                                Community Training Needs
                                                            </h4>
                                                        </div>
                                                        <p className="text-[11px] text-slate-600 mt-0.5">
                                                            Select skills and extension training workshops this household is interested in attending.
                                                        </p>
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                                                        {formTrainingNeeds.length} Selected
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {UNIVERSITY_TRAINING_TOPICS.map(topic => {
                                                        const isSelected = formTrainingNeeds.includes(topic);
                                                        return (
                                                            <button
                                                                key={topic}
                                                                type="button"
                                                                onClick={() => toggleTrainingNeed(topic)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all flex items-center gap-1.5 border ${
                                                                    isSelected
                                                                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                                                                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                                                                }`}
                                                            >
                                                                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 text-[10px] ${
                                                                    isSelected ? 'bg-emerald-800 text-white' : 'border border-slate-300'
                                                                }`}>
                                                                    {isSelected ? '✓' : ''}
                                                                </span>
                                                                <span>{topic}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Pastoral Follow-up & Accompanying Action */}
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                                                    <HeartHandshake className="w-4 h-4 text-purple-700" />
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                        Pastoral Follow-Up & Accompanying Action
                                                    </h4>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formFollowupHomeVisits}
                                                            onChange={e => setFormFollowupHomeVisits(e.target.checked)}
                                                            className="rounded text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <div>
                                                            <span className="text-xs font-semibold text-slate-900 block">Home Visit Recommended</span>
                                                            <span className="text-[11px] text-slate-500">Requires pastoral or BEC leader visit</span>
                                                        </div>
                                                    </label>

                                                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formFollowupSacrament}
                                                            onChange={e => setFormFollowupSacrament(e.target.checked)}
                                                            className="rounded text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <div>
                                                            <span className="text-xs font-semibold text-slate-900 block">Sacramental Follow-up</span>
                                                            <span className="text-[11px] text-slate-500">Kasalang Bayan, Baptism, etc.</span>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                    <div>
                                                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                                                            Referral to Partner Organization
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formFollowupReferral}
                                                            onChange={e => setFormFollowupReferral(e.target.value)}
                                                            placeholder="e.g. Caritas, Barangay Health, DSWD, Social Action"
                                                            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                                                            Assistance Provided / Proposed
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formFollowupAssistance}
                                                            onChange={e => setFormFollowupAssistance(e.target.value)}
                                                            placeholder="e.g. Relief pack, medical referral, counseling"
                                                            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                                                        Next Pastoral Action & Target Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formFollowupNextAction}
                                                        onChange={e => setFormFollowupNextAction(e.target.value)}
                                                        placeholder="e.g. Follow-up visit by BEC St. Jude team on November 15"
                                                        className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            {/* Stewardship Gifts Checklist */}
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-2">
                                                    Gifts / Talents the Family is Willing to Share:
                                                </label>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {[
                                                        'Teaching / Catechesis',
                                                        'Choir & Music',
                                                        'Medical / First Aid',
                                                        'Carpentry & Maintenance',
                                                        'BEC Leader / Coordinator',
                                                        'Youth Mentorship'
                                                    ].map(skill => (
                                                        <label key={skill} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formSkills.includes(skill)}
                                                                onChange={() => toggleSkill(skill)}
                                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                                            />
                                                            <span className="text-slate-800">{skill}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Listening Questions */}
                                            <div className="space-y-3 pt-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        What is one main joy or blessing your family has right now?
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formJoy}
                                                        onChange={e => setFormJoy(e.target.value)}
                                                        placeholder="e.g. Health, children studying, small business"
                                                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        What is the biggest difficulty or concern your family faces?
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formConcern}
                                                        onChange={e => setFormConcern(e.target.value)}
                                                        placeholder="e.g. Flooding, employment, medicine expenses"
                                                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        How can the parish or BEC accompany your family?
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formHelp}
                                                        onChange={e => setFormHelp(e.target.value)}
                                                        placeholder="e.g. Prayers, visits, connecting with neighborhood BEC"
                                                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(2)}
                                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1"
                                                >
                                                    <ChevronLeft className="w-4 h-4" /> Back to Members
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(4)}
                                                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 flex items-center gap-1 shadow-xs"
                                                >
                                                    Next: Review & Submit <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4: FORM REVIEW & FINAL SUBMISSION */}
                                    {surveyStep === 4 && (
                                        <div className="space-y-5 max-w-2xl mx-auto">
                                            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-base">Step 4: Form Review & Final Submission</h3>
                                                    <p className="text-xs text-slate-500">
                                                        Review all recorded questionnaire information and check completeness before sending to Pastor.
                                                    </p>
                                                </div>
                                                <div className="self-start sm:self-auto">
                                                    {isFormReadyToSubmit ? (
                                                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Form Complete & Ready
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
                                                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> {requiredIssues.length} Missing Field{requiredIssues.length !== 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* AUDIT / COMPLETENESS CHECKLIST BANNER */}
                                            {!isFormReadyToSubmit ? (
                                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2.5">
                                                    <div className="flex items-start gap-2.5">
                                                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-xs font-bold text-amber-900">
                                                                Attention: Required Fields Need Completion ({requiredIssues.length})
                                                            </h4>
                                                            <p className="text-[11px] text-amber-700">
                                                                Some fields may have been missed. Click any item below to jump straight to that section to complete it:
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 pt-1">
                                                        {requiredIssues.map(issue => (
                                                            <button
                                                                key={issue.id}
                                                                type="button"
                                                                onClick={() => setSurveyStep(issue.step)}
                                                                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-medium hover:bg-amber-100/80 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                                            >
                                                                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                                                                    {issue.step}
                                                                </span>
                                                                <span>{issue.label}</span>
                                                                <ChevronRight className="w-3 h-3 text-amber-600" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : recommendedIssues.length > 0 ? (
                                                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                                    <div className="flex items-center gap-2 text-emerald-900 font-medium">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                        <span>All essential fields are completed. You can safely submit now!</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {recommendedIssues.map(issue => (
                                                            <button
                                                                key={issue.id}
                                                                type="button"
                                                                onClick={() => setSurveyStep(issue.step)}
                                                                className="px-2 py-0.5 text-[11px] bg-white border border-emerald-300 rounded text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                                                            >
                                                                + Add {issue.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                    <span>Excellent! All required and recommended fields are thoroughly filled.</span>
                                                </div>
                                            )}

                                            {/* SECTION REVIEW CARDS */}
                                            <div className="space-y-3.5">
                                                {/* 1. Step 1 Review Card */}
                                                <div className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 space-y-3 transition-colors">
                                                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">1</span>
                                                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Household Profile & Housing</h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSurveyStep(1)}
                                                            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                                                        >
                                                            <Pencil className="w-3 h-3" /> Edit Step 1
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                                                        <div>
                                                            <span className="text-slate-400 block text-[11px]">Family Name</span>
                                                            <span className="font-semibold text-slate-900">{formFamilyName || <span className="text-amber-600 italic">Missing surname</span>}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 block text-[11px]">Household Head</span>
                                                            <span className="font-semibold text-slate-900">{formHeadName || <span className="text-amber-600 italic">Missing head name</span>}</span>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <span className="text-slate-400 block text-[11px]">Address & BEC Cluster</span>
                                                            <span>{formAddress || <span className="text-amber-600 italic">Missing address</span>}, {formSitio}, {formBarangay} &bull; <strong>{formBec}</strong></span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 block text-[11px]">Housing & Monthly Income</span>
                                                            <span>{formHousing} &bull; ₱ {formIncome}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 block text-[11px]">Contact Number</span>
                                                            <span>{formContact || <span className="text-slate-400 italic">None provided</span>}</span>
                                                        </div>
                                                        {formIsVulnerable && (
                                                            <div className="sm:col-span-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                                                                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                                                <span><strong>Priority Assistance:</strong> {formLivelihoodAssistance || 'Needs livelihood / financial assistance'}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 2. Step 2 Review Card */}
                                                <div className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 space-y-3 transition-colors">
                                                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">2</span>
                                                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                                                                Household Members Roster ({formMembers.length})
                                                            </h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSurveyStep(2)}
                                                            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                                                        >
                                                            <Pencil className="w-3 h-3" /> Edit Step 2 / Add Member
                                                        </button>
                                                    </div>

                                                    {formMembers.length === 0 ? (
                                                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                                                            <span>No family members added yet. Please add at least 1 member.</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSurveyStep(2)}
                                                                className="px-2.5 py-1 bg-amber-700 text-white rounded text-xs font-semibold"
                                                            >
                                                                Go to Step 2
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pb-1">
                                                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                                    {formMembers.filter(m => m.isBaptized).length} Baptized
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                                    {formMembers.filter(m => m.isFirstCommunion).length} 1st Communion
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                                    {formMembers.filter(m => m.isConfirmed).length} Confirmed
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                                                                    {formMembers.filter(m => m.isChurchMarried).length} Church Married
                                                                </span>
                                                                {formMembers.filter(m => m.isSenior || m.age >= 60).length > 0 && (
                                                                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                                                        {formMembers.filter(m => m.isSenior || m.age >= 60).length} Senior
                                                                    </span>
                                                                )}
                                                                {formMembers.filter(m => m.isPwd).length > 0 && (
                                                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                                                        {formMembers.filter(m => m.isPwd).length} PWD
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="divide-y divide-slate-200 max-h-44 overflow-y-auto">
                                                                {formMembers.map((m, idx) => (
                                                                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                                                                        <div>
                                                                            <span className="font-semibold text-slate-900">{m.fullName || <span className="text-amber-600 italic">Missing Member Name</span>}</span>
                                                                            <span className="text-slate-500 text-[11px]"> &bull; {m.relationship}, {m.age}y &bull; {m.civilStatus}</span>
                                                                            <p className="text-[10px] text-slate-400">
                                                                                {m.occupation ? `Work: ${m.occupation}` : m.education ? `Educ: ${m.education}` : 'No occupation details'}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-[10px]">
                                                                            <span className={`px-1.5 py-0.5 rounded ${m.isBaptized ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-400'}`} title="Baptism">B</span>
                                                                            <span className={`px-1.5 py-0.5 rounded ${m.isFirstCommunion ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-400'}`} title="First Communion">C</span>
                                                                            <span className={`px-1.5 py-0.5 rounded ${m.isConfirmed ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-400'}`} title="Confirmation">K</span>
                                                                            <span className={`px-1.5 py-0.5 rounded ${m.isChurchMarried ? 'bg-purple-100 text-purple-800 font-bold' : 'bg-slate-200 text-slate-400'}`} title="Church Marriage">M</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 3. Step 3 Review Card */}
                                                <div className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 space-y-3 transition-colors">
                                                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">3</span>
                                                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Pastoral Needs & Training</h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSurveyStep(3)}
                                                            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                                                        >
                                                            <Pencil className="w-3 h-3" /> Edit Step 3
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2 text-xs text-slate-700">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <p>• <strong>Sunday Mass:</strong> {formMassFreq}</p>
                                                            <p>• <strong>BEC Participation:</strong> {formBecPart}</p>
                                                        </div>

                                                        <div>
                                                            <strong className="block text-slate-900 text-[11px] mb-1">Community Training Needs:</strong>
                                                            {formTrainingNeeds.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {formTrainingNeeds.map(topic => (
                                                                        <span key={topic} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-medium">
                                                                            🎓 {topic}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400 italic text-[11px]">No training topics selected</span>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <strong className="block text-slate-900 text-[11px] mb-1">Pastoral Needs Requested:</strong>
                                                            {formNeeds.length > 0 || formOtherNeed.trim() ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {formNeeds.map(need => (
                                                                        <span key={need} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px]">
                                                                            {need}
                                                                        </span>
                                                                    ))}
                                                                    {formOtherNeed.trim() && (
                                                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px]">
                                                                            Other: {formOtherNeed.trim()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400 italic text-[11px]">None requested</span>
                                                            )}
                                                        </div>

                                                        {formSkills.length > 0 && (
                                                            <div>
                                                                <strong className="block text-slate-900 text-[11px] mb-1">Talents & Ministries Offered:</strong>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {formSkills.map(skill => (
                                                                        <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px]">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CONSENT CONFIRMATION */}
                                            <label className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                                                !formConsent
                                                    ? 'bg-amber-50/70 border-amber-300'
                                                    : 'bg-emerald-50/70 border-emerald-300'
                                            }`}>
                                                <input
                                                    type="checkbox"
                                                    checked={formConsent}
                                                    onChange={e => setFormConsent(e.target.checked)}
                                                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                                    required
                                                />
                                                <div className="text-xs text-slate-700">
                                                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                                        <span>Informed Consent Obtained</span>
                                                        {!formConsent && <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">Required to Submit</span>}
                                                    </span>
                                                    The respondent has willingly consented to share this household information for pastoral accompaniment, sacramental verification, and church registry purposes.
                                                </div>
                                            </label>

                                            {/* NAVIGATION / SUBMISSION CONTROLS */}
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(3)}
                                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1 w-full sm:w-auto justify-center cursor-pointer"
                                                >
                                                    <ChevronLeft className="w-4 h-4" /> Back to Step 3
                                                </button>

                                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                                    {!isFormReadyToSubmit && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSurveyStep(requiredIssues[0].step)}
                                                            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors w-full sm:w-auto cursor-pointer"
                                                        >
                                                            <AlertCircle className="w-4 h-4" /> Jump to Missing: {requiredIssues[0].label}
                                                        </button>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        disabled={!isFormReadyToSubmit}
                                                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors w-full sm:w-auto ${
                                                            isFormReadyToSubmit
                                                                ? 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer'
                                                                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
                                                        }`}
                                                    >
                                                        <Send className="w-4 h-4" /> Submit for Pastor Review
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                )}


                {/* ========================================================================= */}
                {/* 2. PASTOR VIEW                                                            */}
                {/* ========================================================================= */}
                {currentRole === 'pastor' && (
                    <div className="space-y-6">
                        {/* Top Role Indicator — 30% deep green */}
                        <div className="bg-green-900 text-white rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-semibold text-green-400 uppercase tracking-widest">Pastor Portal</span>
                                <h2 className="text-lg font-bold mt-0.5">Rev. Fr. Emmanuel D. Garcia</h2>
                                <p className="text-xs text-green-300 mt-0.5">
                                    Approves household surveys and issues sacramental certificates.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {[
                                    { label: 'Total Parishioners', value: households.reduce((acc, h) => acc + h.members.length, 0) },
                                    { label: 'Pending Surveys',    value: pendingHouseholdCount },
                                    { label: 'Pending Certs',      value: pendingCertCount },
                                    { label: 'Care Priority Families', value: households.filter(h => h.isVulnerable || h.members.some(m => (m.specialNeeds && m.specialNeeds.length > 0) || m.age >= 60)).length },
                                ].map(stat => (
                                    <div key={stat.label} className="text-center px-3 py-1.5 bg-green-800 rounded-lg border border-green-700">
                                        <span className="text-[10px] text-green-300 block">{stat.label}</span>
                                        <span className="text-lg font-bold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-stone-200 gap-6 text-sm font-medium overflow-x-auto pb-px">
                            {[
                                { key: 'reports',      label: 'Reports & Lists',                    count: null             },
                                { key: 'review',       label: 'Pending Surveys',                    count: pendingHouseholdCount },
                                { key: 'certificates', label: 'Certificate Requests',               count: pendingCertCount },
                                { key: 'records',      label: 'Parish Registry',                    count: null             },
                                { key: 'settings',     label: 'Form Settings',                      count: null             },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setPastorTab(tab.key as any)}
                                    className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap text-sm ${
                                        pastorTab === tab.key
                                            ? 'border-green-900 text-green-900 font-semibold'
                                            : 'border-transparent text-stone-400 hover:text-stone-700'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count !== null && tab.count > 0 && (
                                        <span className="text-[10px] font-bold bg-amber-700 text-white px-1.5 py-0.5 rounded-full">{tab.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* TAB 0: PASTORAL REPORTS DASHBOARD */}
                        {pastorTab === 'reports' && (
                            <PastorReportsDashboard
                                households={households}
                                onSelectHousehold={(h) => setSelectedHouseholdForReview(h)}
                                onSwitchTab={(tab) => setPastorTab(tab)}
                            />
                        )}

                        {/* TAB 1: PENDING HOUSEHOLDS REVIEW */}
                        {pastorTab === 'review' && (
                            <div className="space-y-4">
                                {/* Section header */}
                                <div className="bg-green-900 text-white rounded-xl px-5 py-3.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold text-green-400 uppercase tracking-widest">For Your Review</p>
                                        <h3 className="font-bold text-base">Pending Family Surveys</h3>
                                    </div>
                                    <span className="text-sm font-bold bg-amber-700 px-3 py-1 rounded-lg">{pendingHouseholdCount} pending</span>
                                </div>

                                {pendingHouseholdCount === 0 ? (
                                    <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
                                        <CheckCircle2 className="w-10 h-10 text-green-700 mx-auto mb-2" />
                                        <h4 className="font-bold text-stone-900">All surveys have been reviewed.</h4>
                                        <p className="text-xs text-stone-400 mt-1">No pending household submissions from volunteers.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
                                        {households.filter(h => h.status === 'Pending Review').map(h => (
                                            <div key={h.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="font-bold text-green-900 text-sm">{h.familyName} Family</span>
                                                        <span className="text-xs text-stone-400">({h.id})</span>
                                                        <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-800">
                                                            Awaiting Verification
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-stone-600">
                                                        <strong>Head:</strong> {h.headName} &nbsp;•&nbsp; <strong>Address:</strong> {h.address}, {h.sitioPurok} &nbsp;•&nbsp; <strong>BEC:</strong> {h.becCluster}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                        {h.housingSituation && (
                                                            <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                                                                🏠 {h.housingSituation}
                                                            </span>
                                                        )}
                                                        {h.monthlyIncome && (
                                                            <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                                                                ₱ {h.monthlyIncome}
                                                            </span>
                                                        )}
                                                        {h.isVulnerable && (
                                                            <span className="text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">
                                                                ⚠️ Priority Assistance
                                                            </span>
                                                        )}
                                                        {h.trainingNeeds && h.trainingNeeds.length > 0 && (
                                                            <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                                                                🎓 Training: {h.trainingNeeds[0]} {h.trainingNeeds.length > 1 ? `+${h.trainingNeeds.length - 1}` : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-stone-400">
                                                        Encoded by {h.encodedBy} on {h.dateEncoded} &nbsp;•&nbsp; {h.members.length} member{h.members.length !== 1 ? 's' : ''}
                                                    </p>
                                                    {h.pastoralNeeds.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                            {h.pastoralNeeds.map(need => (
                                                                <span key={need} className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                                                    {need}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => setSelectedHouseholdForReview(h)}
                                                    className="shrink-0 px-3.5 py-1.5 text-xs font-semibold bg-green-900 hover:bg-green-800 text-white rounded-lg flex items-center gap-1.5"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Review
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: CERTIFICATE REQUESTS */}
                        {pastorTab === 'certificates' && (
                            <div className="space-y-4">
                                <div className="bg-green-900 text-white rounded-xl px-5 py-3.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold text-green-400 uppercase tracking-widest">Certificates</p>
                                        <h3 className="font-bold text-base">Certificate Requests</h3>
                                    </div>
                                    <span className="text-sm font-bold bg-amber-700 px-3 py-1 rounded-lg">{pendingCertCount} pending</span>
                                </div>

                                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                                    <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50">
                                        <p className="text-xs text-stone-500">Verify the registry book entry and issue official certificates to parishioners.</p>
                                    </div>
                                    <div className="divide-y divide-stone-100">
                                        {certificates.map(cert => (
                                            <div key={cert.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="font-bold text-green-900 text-sm">{cert.recipientName}</span>
                                                        <span className="text-xs font-medium px-2 py-0.5 rounded border border-stone-300 bg-stone-100 text-stone-700">
                                                            {cert.certificateType} Certificate
                                                        </span>
                                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                                                            cert.status === 'Approved & Issued'
                                                                ? 'border-green-300 bg-green-50 text-green-800'
                                                                : 'border-amber-300 bg-amber-50 text-amber-800'
                                                        }`}>
                                                            {cert.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-stone-600">
                                                        <strong>Purpose:</strong> {cert.purpose} &nbsp;•&nbsp; <strong>Family ID:</strong> {cert.familyId}
                                                    </p>
                                                    {cert.dateIssued && (
                                                        <p className="text-[11px] text-stone-400">Issued on {cert.dateIssued} by {cert.issuedBy}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    {cert.status === 'Pending Review' ? (
                                                        <button
                                                            onClick={() => setSelectedCertToIssue(cert)}
                                                            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-700 hover:bg-amber-600 text-white rounded-lg flex items-center gap-1.5"
                                                        >
                                                            <Award className="w-3.5 h-3.5" /> Verify &amp; Issue
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setViewingCertificate(cert)}
                                                            className="px-3 py-1.5 text-xs font-medium border border-green-800 text-green-800 hover:bg-green-50 rounded-lg flex items-center gap-1"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" /> View Certificate
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: APPROVED REGISTRY */}
                        {pastorTab === 'records' && (
                            <div className="space-y-4">
                                <div className="bg-green-900 text-white rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-semibold text-green-400 uppercase tracking-widest">Records</p>
                                        <h3 className="font-bold text-base">Parish Registry</h3>
                                    </div>
                                    {/* Search & Filter */}
                                    <div className="flex flex-wrap gap-2">
                                        <div className="relative">
                                            <Search className="w-3.5 h-3.5 text-green-400 absolute left-2.5 top-2" />
                                            <input
                                                type="text"
                                                value={searchRegistry}
                                                onChange={e => setSearchRegistry(e.target.value)}
                                                placeholder="Search family..."
                                                className="text-xs pl-8 pr-3 py-1.5 bg-green-800 border border-green-700 text-green-100 placeholder-green-500 rounded-lg focus:outline-none w-44"
                                            />
                                        </div>
                                        <select
                                            value={filterBec}
                                            onChange={e => setFilterBec(e.target.value)}
                                            className="text-xs px-3 py-1.5 bg-green-800 border border-green-700 text-green-100 rounded-lg focus:outline-none"
                                        >
                                            <option value="All">All BECs</option>
                                            <option value="BEC St. Jude">BEC St. Jude</option>
                                            <option value="BEC San Pedro">BEC San Pedro</option>
                                            <option value="BEC San Lorenzo">BEC San Lorenzo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                                    <div className="divide-y divide-stone-100">
                                        {filteredHouseholds.map(h => (
                                            <div key={h.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="font-bold text-green-900 text-sm">{h.familyName} Family</span>
                                                        <span className="text-xs text-stone-400">({h.id})</span>
                                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                                                            h.status === 'Approved'
                                                                ? 'border-green-300 bg-green-50 text-green-800'
                                                                : 'border-stone-300 bg-stone-100 text-stone-600'
                                                        }`}>
                                                            {h.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-stone-500 mt-0.5">
                                                        {h.address}, {h.sitioPurok} &nbsp;•&nbsp; <strong>BEC:</strong> {h.becCluster} &nbsp;•&nbsp; {h.members.length} members
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                        {h.housingSituation && (
                                                            <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                                                                🏠 {h.housingSituation}
                                                            </span>
                                                        )}
                                                        {h.monthlyIncome && (
                                                            <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                                                                ₱ {h.monthlyIncome}
                                                            </span>
                                                        )}
                                                        {h.isVulnerable && (
                                                            <span className="text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">
                                                                ⚠️ Priority Assistance
                                                            </span>
                                                        )}
                                                        {h.trainingNeeds && h.trainingNeeds.length > 0 && (
                                                            <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                                                                🎓 Training: {h.trainingNeeds[0]} {h.trainingNeeds.length > 1 ? `+${h.trainingNeeds.length - 1}` : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-stone-400 mt-1">
                                                        {h.members.map(m => m.fullName).join(', ')}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedHouseholdForReview(h)}
                                                    className="shrink-0 px-3 py-1.5 text-xs font-medium border border-green-800 text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: FORM SETTINGS */}
                        {pastorTab === 'settings' && (
                            <div className="space-y-5">
                                {/* Header */}
                                <div className="bg-green-900 text-white rounded-xl px-5 py-3.5">
                                    <p className="text-[11px] font-semibold text-green-400 uppercase tracking-widest">Admin</p>
                                    <h3 className="font-bold text-base">Form Settings</h3>
                                    <p className="text-xs text-green-300 mt-0.5">Manage dropdown choices volunteers see when encoding household surveys.</p>
                                </div>

                                {/* Category Switcher */}
                                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-medium w-fit">
                                    {([
                                        { key: 'barangay',   label: 'Barangay'     },
                                        { key: 'sitio_purok', label: 'Sitio / Purok' },
                                        { key: 'bec_cluster', label: 'BEC Cluster'  },
                                    ] as const).map(cat => (
                                        <button
                                            key={cat.key}
                                            onClick={() => setSettingsCategory(cat.key)}
                                            className={`px-4 py-1.5 rounded-md transition-all ${
                                                settingsCategory === cat.key
                                                    ? 'bg-green-900 text-white font-semibold'
                                                    : 'text-stone-600 hover:text-stone-900'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Current options list */}
                                    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                                        <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                                            <ListChecks className="w-4 h-4 text-green-900" />
                                            <span className="font-semibold text-green-900 text-sm">
                                                {settingsCategory === 'barangay' ? 'Barangay' : settingsCategory === 'sitio_purok' ? 'Sitio / Purok' : 'BEC Cluster'} Options
                                            </span>
                                        </div>

                                        <div className="divide-y divide-stone-100">
                                            {(settingsCategory === 'barangay' ? barangayOptions : settingsCategory === 'sitio_purok' ? sitioPurokOptions : becClusterOptions).map(opt => (
                                                <div key={opt.id} className="px-5 py-3 flex items-center justify-between gap-2 hover:bg-stone-50 transition-colors">
                                                    {editingOptionId === opt.id ? (
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input
                                                                type="text"
                                                                value={editingOptionLabel}
                                                                onChange={e => setEditingOptionLabel(e.target.value)}
                                                                className="flex-1 text-sm px-2 py-1 border border-green-700 rounded-lg focus:outline-green-800"
                                                                onKeyDown={e => { if (e.key === 'Enter') handleUpdateOption(opt.id); if (e.key === 'Escape') setEditingOptionId(null); }}
                                                                autoFocus
                                                            />
                                                            <button onClick={() => handleUpdateOption(opt.id)} className="p-1 text-green-800 hover:bg-green-50 rounded">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => setEditingOptionId(null)} className="p-1 text-stone-400 hover:bg-stone-100 rounded">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm text-stone-800 font-medium">{opt.label}</span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => { setEditingOptionId(opt.id); setEditingOptionLabel(opt.label); }}
                                                                    className="p-1.5 text-stone-400 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                                                    title="Rename"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteOption(opt.id, opt.label)}
                                                                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                            {(settingsCategory === 'barangay' ? barangayOptions : settingsCategory === 'sitio_purok' ? sitioPurokOptions : becClusterOptions).length === 0 && (
                                                <div className="p-6 text-center text-xs text-stone-400">No options yet. Add one using the form on the right.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add new option form */}
                                    <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-green-900 text-sm">Add New Option</h4>
                                            <p className="text-xs text-stone-400 mt-0.5">
                                                Enter a new {settingsCategory === 'barangay' ? 'barangay name' : settingsCategory === 'sitio_purok' ? 'sitio or purok name' : 'BEC cluster name'} to add it to the dropdown list.
                                            </p>
                                        </div>

                                        <form onSubmit={handleAddOption} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newOptionLabel}
                                                onChange={e => setNewOptionLabel(e.target.value)}
                                                placeholder={settingsCategory === 'barangay' ? 'e.g. San Antonio' : settingsCategory === 'sitio_purok' ? 'e.g. Purok 5' : 'e.g. BEC St. Francis'}
                                                className="flex-1 text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-green-800"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors"
                                            >
                                                <Plus className="w-4 h-4" /> Add
                                            </button>
                                        </form>

                                        <div className="pt-3 border-t border-stone-100">
                                            <p className="text-[11px] text-stone-400">
                                                Click the <span className="font-medium text-green-800">pencil icon</span> to rename, or the <span className="font-medium text-red-700">trash icon</span> to remove. Removing does not affect households already encoded with that value.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* ========================================================================= */}
                {/* 3. PARISHIONER / MEMBER VIEW                                              */}
                {/* ========================================================================= */}
                {/* ========================================================================= */}
                {/* 3. PARISHIONER / MEMBER VIEW                                              */}
                {/* ========================================================================= */}
                {currentRole === 'member' && (() => {
                    const memberHousehold = households.find(h => h.id === 'FAM-2026-0042') || households[0];
                    return (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {/* Member Household Header Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                Parishioner Household Portal
                                            </span>
                                            <span className="text-xs font-medium text-slate-400">ID: {memberHousehold.id}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mt-1">{memberHousehold.familyName} Family</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {memberHousehold.address}, {memberHousehold.sitioPurok}, {memberHousehold.barangay} &bull; <strong>{memberHousehold.becCluster}</strong>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setRequestModalOpen(true)}
                                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
                                    >
                                        <Plus className="w-4 h-4" /> Request Sacramental Certificate
                                    </button>
                                </div>

                                {/* Household Glance Chips */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs text-slate-700">
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block font-medium">Housing Situation</span>
                                        <span className="font-semibold text-slate-800">{memberHousehold.housingSituation || 'Sariling Bahay at Lupa'}</span>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block font-medium">Income Bracket</span>
                                        <span className="font-semibold text-slate-800">{memberHousehold.monthlyIncome || '₱10,001 – ₱15,000'}</span>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block font-medium">BEC Participation</span>
                                        <span className="font-semibold text-emerald-700">{memberHousehold.becParticipation || 'Regular'} Active</span>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block font-medium">Parish Registry Status</span>
                                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Pastor
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Registered Family Members */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">Family Members Roster ({memberHousehold.members.length})</h3>
                                        <p className="text-xs text-slate-500">Official church records, educational & employment details, and sacramental milestones.</p>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                        {memberHousehold.members.filter(m => m.isBaptized).length} Baptized &bull; {memberHousehold.members.filter(m => m.isSenior || m.age >= 60).length} Senior
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {memberHousehold.members.map(member => (
                                        <div key={member.id} className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5 transition-all">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="font-bold text-slate-900 text-sm block">{member.fullName}</span>
                                                    <span className="text-slate-500 text-[11px]">
                                                        {member.relationship} &bull; {member.age} yrs &bull; {member.civilStatus}
                                                    </span>
                                                </div>
                                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                                                    {member.relationship}
                                                </span>
                                            </div>

                                            {/* Work & Education */}
                                            {(member.occupation || member.education) && (
                                                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 space-y-0.5">
                                                    {member.occupation && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Briefcase className="w-3 h-3 text-slate-400" />
                                                            <span><strong>Work:</strong> {member.occupation} {member.employmentType ? `(${member.employmentType})` : ''}</span>
                                                        </div>
                                                    )}
                                                    {member.education && (
                                                        <div className="flex items-center gap-1.5">
                                                            <GraduationCap className="w-3 h-3 text-slate-400" />
                                                            <span><strong>Education:</strong> {member.education}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Sacraments Checklist */}
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-400 font-medium block">Sacraments Received:</span>
                                                <div className="flex flex-wrap gap-1 text-[10px]">
                                                    <span className={`px-2 py-0.5 rounded font-medium ${member.isBaptized ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                                                        {member.isBaptized ? '✓ Baptized' : '✗ Unbaptized'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded font-medium ${member.isFirstCommunion ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                                                        {member.isFirstCommunion ? '✓ 1st Communion' : '— No Communion'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded font-medium ${member.isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                                                        {member.isConfirmed ? '✓ Confirmed' : '— No Confirmation'}
                                                    </span>
                                                    {member.isChurchMarried && (
                                                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                                                            ✓ Church Married
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Care / Ministry Badges */}
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {(member.isSenior || member.age >= 60) && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                                        👵 Senior 60+
                                                    </span>
                                                )}
                                                {member.isHomebound && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                                        🏠 Homebound Care
                                                    </span>
                                                )}
                                                {member.isPwd && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                        ♿ PWD
                                                    </span>
                                                )}
                                                {member.needsSacramentPrep && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                                        ⚠️ Awaiting Sacramental Prep
                                                    </span>
                                                )}
                                                {member.parishMinistries && member.parishMinistries.map(min => (
                                                    <span key={min} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        🕊️ {min}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pastoral Accompaniment & Extension Training */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Area 11: Universidad de Dagupan Training */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Community Training Needs</h4>
                                            <p className="text-[11px] text-slate-500">Skills & livelihood tracks enrolled by family</p>
                                        </div>
                                    </div>

                                    {memberHousehold.trainingNeeds && memberHousehold.trainingNeeds.length > 0 ? (
                                        <div className="space-y-1.5 pt-1">
                                            {memberHousehold.trainingNeeds.map(topic => (
                                                <div key={topic} className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                                                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                                    <span>{topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No university extension tracks currently enrolled.</p>
                                    )}
                                </div>

                                {/* Area 12: Pastoral Accompaniment */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                                            <HeartHandshake className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Pastoral Accompaniment</h4>
                                            <p className="text-[11px] text-slate-500">Care visits & BEC community connection</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-700 pt-1">
                                        {memberHousehold.pastoralNeeds && memberHousehold.pastoralNeeds.length > 0 && (
                                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                                <span className="font-semibold text-slate-800 block text-[11px]">Requested Pastoral Care:</span>
                                                <span className="text-slate-600">{memberHousehold.pastoralNeeds.join(' • ')}</span>
                                            </div>
                                        )}

                                        {memberHousehold.pastoralFollowup?.nextPastoralAction && (
                                            <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200 text-purple-900">
                                                <span className="font-semibold block text-[11px]">Scheduled Next Action:</span>
                                                <span>{memberHousehold.pastoralFollowup.nextPastoralAction}</span>
                                            </div>
                                        )}

                                        {memberHousehold.volunteerSkills && memberHousehold.volunteerSkills.length > 0 && (
                                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                                <span className="font-semibold text-slate-800 block text-[11px]">Stewardship Talents Shared:</span>
                                                <span className="text-emerald-700 font-medium">{memberHousehold.volunteerSkills.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Certificates Available for Household */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Issued Sacramental Certificates</h3>
                                        <p className="text-xs text-slate-500">Official certificates signed by the Parish Priest.</p>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                                    {certificates.filter(c => c.familyId === memberHousehold.id).map(cert => (
                                        <div key={cert.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900 text-xs">{cert.recipientName}</span>
                                                    <span className="text-[10px] bg-purple-100 text-purple-800 font-medium px-2 py-0.5 rounded-full">
                                                        {cert.certificateType} Certificate
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${cert.status === 'Approved & Issued' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'bg-amber-100 text-amber-800'}`}>
                                                        {cert.status}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    Purpose: {cert.purpose} • Date of Sacrament: {cert.dateOfSacrament}
                                                </p>
                                            </div>

                                            <div>
                                                {cert.status === 'Approved & Issued' ? (
                                                    <button
                                                        onClick={() => setViewingCertificate(cert)}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> View / Print Certificate
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Under review by Pastor</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Security Check Demo */}
                                <div className="pt-2 border-t border-slate-100">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <span className="text-xs font-bold text-slate-800 block">Family Relationship Security Check</span>
                                            <span className="text-[11px] text-slate-500">
                                                Per Church privacy canon, members can only view records of verified household members.
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAccessDeniedAlert(true)}
                                            className="px-3 py-1.5 text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg whitespace-nowrap shrink-0"
                                        >
                                            Test Outside Access
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* ========================================================================= */}
                {/* 4. PARISH PASTORAL COUNCIL (PPC) SUMMARY DASHBOARD                        */}
                {/* ========================================================================= */}
                {currentRole === 'ppc' && (() => {
                    const allMembers = households.flatMap(h => h.members);
                    const unbaptizedCount = allMembers.filter(m => !m.isBaptized).length;
                    const communionAwaitingCount = allMembers.filter(m => m.age >= 7 && !m.isFirstCommunion).length;
                    const confirmationAwaitingCount = allMembers.filter(m => m.age >= 12 && !m.isConfirmed).length;
                    const couplesForChurchWedding = households.filter(h => h.members.some(m => m.civilStatus === 'Civilly Married' || m.civilStatus === 'Cohabiting')).length;

                    const youthCount = allMembers.filter(m => m.age >= 13 && m.age <= 22).length;
                    const osyCount = allMembers.filter(m => m.isOutOfSchoolYouth).length;
                    const catechismNeedCount = households.filter(h => h.pastoralNeeds.some(n => n.toLowerCase().includes('catechesis') || n.toLowerCase().includes('sacrament') || n.toLowerCase().includes('children'))).length;

                    const vulnerableCount = households.filter(h => h.isVulnerable || !!h.livelihoodAssistanceNeeded).length;
                    const homeboundElderlyCount = allMembers.filter(m => m.isHomebound || m.needsCommunionAnointing).length;
                    const pwdCount = allMembers.filter(m => m.isPwd).length;
                    const totalCareRequests = households.filter(h => h.pastoralFollowup?.homeVisits || h.pastoralNeeds.some(n => n.toLowerCase().includes('visit') || n.toLowerCase().includes('communion'))).length;

                    // Dynamic Universidad de Dagupan Training Tracks Ranking
                    const trainingMap: Record<string, number> = {};
                    households.forEach(h => {
                        (h.trainingNeeds || []).forEach(t => {
                            trainingMap[t] = (trainingMap[t] || 0) + 1;
                        });
                    });
                    const sortedTrainingTracks = Object.entries(trainingMap).sort((a, b) => b[1] - a[1]);
                    const totalTrainingEnrollees = Object.values(trainingMap).reduce((a, b) => a + b, 0);

                    // Dynamic Talents Map
                    const talentMap: Record<string, number> = {};
                    households.forEach(h => {
                        (h.volunteerSkills || []).forEach(s => {
                            talentMap[s] = (talentMap[s] || 0) + 1;
                        });
                        h.members.forEach(m => {
                            (m.skillsTalents || []).forEach(s => {
                                talentMap[s] = (talentMap[s] || 0) + 1;
                            });
                        });
                    });
                    const sortedTalents = Object.entries(talentMap).sort((a, b) => b[1] - a[1]);

                    const becActivePercentage = Math.round(
                        (households.filter(h => h.becParticipation === 'Regular' || h.becParticipation === 'Sometimes').length / Math.max(1, households.length)) * 100
                    );

                    return (
                        <div className="space-y-6">
                            {/* Intro banner */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                        Parish Pastoral Council
                                    </span>
                                    <h2 className="text-xl font-bold text-slate-900 mt-1">Parish Pastoral Discernment Summary</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Aggregated data from household surveys across all BEC clusters for pastoral planning, community accompaniment, and university extension.
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[11px] text-slate-400 block">Total Parishioners</span>
                                    <span className="text-2xl font-bold text-slate-900">{allMembers.length}</span>
                                </div>
                            </div>

                            {/* Top 4 KPI Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                    <span className="text-xs font-medium text-slate-500">Families Surveyed</span>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{households.length}</p>
                                    <span className="text-[11px] text-emerald-600 font-medium">Across all BEC clusters</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                    <span className="text-xs font-medium text-slate-500">BEC Participation Rate</span>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">{becActivePercentage}%</p>
                                    <span className="text-[11px] text-slate-500">Active grassroots presence</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                    <span className="text-xs font-medium text-slate-500">Care Priority Families</span>
                                    <p className="text-2xl font-bold text-amber-600 mt-1">{vulnerableCount + totalCareRequests}</p>
                                    <span className="text-[11px] text-slate-500">Vulnerable / Homebound visits</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                    <span className="text-xs font-medium text-slate-500">Community Training Demand</span>
                                    <p className="text-2xl font-bold text-emerald-600 mt-1">{totalTrainingEnrollees}</p>
                                    <span className="text-[11px] text-slate-500">Community training tracks</span>
                                </div>
                            </div>

                            {/* Three Commissions Grid (Worship, Evangelization, Social Services) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Commission on Worship */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                            W
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm">Commission on Worship</h3>
                                            <p className="text-[11px] text-slate-500">Sacramental & liturgical accompaniment</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Children needing Baptism</span>
                                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                                {unbaptizedCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Awaiting First Communion</span>
                                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                                {communionAwaitingCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Awaiting Confirmation</span>
                                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                                {confirmationAwaitingCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Couples for Church Wedding</span>
                                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                                {couplesForChurchWedding}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Commission on Evangelization */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                            E
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm">Commission on Evangelization</h3>
                                            <p className="text-[11px] text-slate-500">Faith formation & youth guidance</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Youth (13–22 yrs)</span>
                                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                {youthCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Out-of-School Youth (OSY)</span>
                                            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                {osyCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Catechesis & Formation Needs</span>
                                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                {catechismNeedCount} families
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Inactive Families for Accompaniment</span>
                                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                {households.filter(h => h.becParticipation === 'Not active' || h.massFrequency === 'Rarely / Never').length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Commission on Social Services */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                                            S
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm">Commission on Social Services</h3>
                                            <p className="text-[11px] text-slate-500">Care for sick, elderly & vulnerable</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Vulnerable / Livelihood Needs</span>
                                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                {vulnerableCount} families
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Homebound Elderly & Sick</span>
                                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                {homeboundElderlyCount} members
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Persons with Disability (PWD)</span>
                                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                                {pwdCount} members
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                                            <span className="text-slate-700">Home Visits Requested</span>
                                            <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                                {totalCareRequests} families
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Community Training Needs & Workshop Demand */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm">Community Training Needs & Workshop Demand</h3>
                                            <p className="text-xs text-slate-500">Skills training tracks requested by parishioners to schedule with training teams.</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                                        {sortedTrainingTracks.length} Active Tracks
                                    </span>
                                </div>

                                {sortedTrainingTracks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        {sortedTrainingTracks.map(([topic, count]) => (
                                            <div key={topic} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                                                <div className="space-y-0.5">
                                                    <span className="font-semibold text-slate-900 block">{topic}</span>
                                                    <span className="text-[11px] text-slate-500">Community Extension Track</span>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-base font-bold text-emerald-700">{count}</span>
                                                    <span className="text-[10px] text-slate-400 block">families</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No training needs recorded yet.</p>
                                )}
                            </div>

                            {/* Stewardship Pool: Available Talents */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Stewardship Talents Offered by Parishioners</h3>
                                    <p className="text-xs text-slate-500">
                                        Parishioners willing to share time, skills, and charisms to build up the church and BEC communities.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    {sortedTalents.length > 0 ? sortedTalents.map(([talent, count]) => (
                                        <div key={talent} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                            <span className="text-slate-800 font-medium">{talent}</span>
                                            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                                                {count}
                                            </span>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-slate-400 italic">No volunteer talents recorded yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </main>

            {/* ========================================================================= */}
            {/* MODAL: PASTOR REVIEW HOUSEHOLD                                            */}
            {/* ========================================================================= */}
            {selectedHouseholdForReview && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {selectedHouseholdForReview.familyName} Family Record
                                    </h3>
                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                        selectedHouseholdForReview.status === 'Approved'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : selectedHouseholdForReview.status === 'Returned for Correction'
                                                ? 'bg-rose-100 text-rose-800'
                                                : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {selectedHouseholdForReview.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    ID: {selectedHouseholdForReview.id} &bull; Encoded by: {selectedHouseholdForReview.encodedBy || 'Parish Volunteer'} &bull; Date: {selectedHouseholdForReview.dateEncoded}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedHouseholdForReview(null)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Location & Contact Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <div><strong>Head:</strong> {selectedHouseholdForReview.headName}</div>
                            <div><strong>Contact:</strong> {selectedHouseholdForReview.contactNumber || 'None'}</div>
                            <div><strong>Address:</strong> {selectedHouseholdForReview.address}</div>
                            <div><strong>Barangay & Sitio:</strong> {selectedHouseholdForReview.barangay}, {selectedHouseholdForReview.sitioPurok}</div>
                            <div><strong>BEC Cluster:</strong> {selectedHouseholdForReview.becCluster}</div>
                            <div><strong>Sunday Mass:</strong> {selectedHouseholdForReview.massFrequency}</div>
                        </div>

                        {/* Socio-Economics & Housing (Area 10) */}
                        <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-xs space-y-2">
                            <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-blue-700" /> Socio-Economic & Housing Profile
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                                <div><span className="text-slate-500 block text-[10px]">Housing Situation:</span> <strong>{selectedHouseholdForReview.housingSituation || 'Not specified'}</strong></div>
                                <div><span className="text-slate-500 block text-[10px]">Monthly Income:</span> <strong>{selectedHouseholdForReview.monthlyIncome || 'Not disclosed'}</strong></div>
                                <div><span className="text-slate-500 block text-[10px]">BEC Gathering:</span> <strong>{selectedHouseholdForReview.becParticipation}</strong></div>
                                <div>
                                    <span className="text-slate-500 block text-[10px]">Vulnerability:</span>
                                    {selectedHouseholdForReview.isVulnerable ? (
                                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] inline-block">
                                            ⚠️ Flagged Vulnerable
                                        </span>
                                    ) : (
                                        <span className="text-slate-600 font-medium text-[11px]">Standard</span>
                                    )}
                                </div>
                            </div>
                            {selectedHouseholdForReview.livelihoodAssistanceNeeded && (
                                <p className="pt-1 text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                                    <strong>Livelihood Assistance Requested:</strong> {selectedHouseholdForReview.livelihoodAssistanceNeeded}
                                </p>
                            )}
                        </div>

                        {/* Members Table */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Household Members ({selectedHouseholdForReview.members.length})
                                </h4>
                                <span className="text-[11px] text-slate-500">
                                    {selectedHouseholdForReview.members.filter(m => m.isBaptized).length} Baptized &bull; {selectedHouseholdForReview.members.filter(m => m.isSenior || m.age >= 60).length} Senior &bull; {selectedHouseholdForReview.members.filter(m => m.isPwd).length} PWD
                                </span>
                            </div>
                            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                                <table className="w-full text-left divide-y divide-slate-200">
                                    <thead className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                                        <tr>
                                            <th className="p-2.5">Name & Relation</th>
                                            <th className="p-2.5">Age / Sex</th>
                                            <th className="p-2.5">Work & Education</th>
                                            <th className="p-2.5">Sacraments</th>
                                            <th className="p-2.5">Care Needs / Flags</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {selectedHouseholdForReview.members.map(m => (
                                            <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="p-2.5">
                                                    <span className="font-bold text-slate-900 block">{m.fullName}</span>
                                                    <span className="text-[10px] text-slate-500">{m.relationship} &bull; {m.civilStatus}</span>
                                                </td>
                                                <td className="p-2.5 text-slate-600">
                                                    {m.age} yrs &bull; {m.sex}
                                                    {m.birthdate && <span className="block text-[10px] text-slate-400">{m.birthdate}</span>}
                                                </td>
                                                <td className="p-2.5 text-slate-600">
                                                    <div>{m.occupation || '—'}</div>
                                                    <span className="text-[10px] text-slate-400 block">{m.education || ''}</span>
                                                </td>
                                                <td className="p-2.5">
                                                    <div className="flex flex-wrap gap-1 text-[10px]">
                                                        <span className={`px-1.5 py-0.5 rounded ${m.isBaptized ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                                                            {m.isBaptized ? 'Bap' : 'No Bap'}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded ${m.isFirstCommunion ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                                                            {m.isFirstCommunion ? 'Com' : 'No Com'}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded ${m.isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                                                            {m.isConfirmed ? 'Conf' : 'No Conf'}
                                                        </span>
                                                        {m.isChurchMarried && (
                                                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                                                Church Wed
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-2.5">
                                                    <div className="flex flex-wrap gap-1 text-[10px]">
                                                        {m.needsSacramentPrep && (
                                                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                                                                Needs Sacraments
                                                            </span>
                                                        )}
                                                        {(m.isSenior || m.age >= 60) && (
                                                            <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                                                                Senior 60+
                                                            </span>
                                                        )}
                                                        {m.isHomebound && (
                                                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                                                                🏠 Homebound
                                                            </span>
                                                        )}
                                                        {m.isPwd && (
                                                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                                                ♿ PWD
                                                            </span>
                                                        )}
                                                        {m.needsCommunionAnointing && (
                                                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                                                                Viaticum Call
                                                            </span>
                                                        )}
                                                        {m.isOutOfSchoolYouth && (
                                                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                                                                OSY Youth
                                                            </span>
                                                        )}
                                                        {!m.needsSacramentPrep && !m.isSenior && m.age < 60 && !m.isHomebound && !m.isPwd && !m.needsCommunionAnointing && !m.isOutOfSchoolYouth && (
                                                            <span className="text-slate-400">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Community Training & Follow-up */}
                        {((selectedHouseholdForReview.trainingNeeds && selectedHouseholdForReview.trainingNeeds.length > 0) || selectedHouseholdForReview.pastoralFollowup) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                {selectedHouseholdForReview.trainingNeeds && selectedHouseholdForReview.trainingNeeds.length > 0 && (
                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                                        <div className="font-bold text-emerald-900 text-[11px] flex items-center gap-1.5">
                                            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                                            Community Training Needs Requested:
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedHouseholdForReview.trainingNeeds.map(topic => (
                                                <span key={topic} className="px-2 py-0.5 bg-white text-emerald-800 rounded text-[10px] font-medium border border-emerald-200">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedHouseholdForReview.pastoralFollowup && (
                                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-purple-950">
                                        <div className="font-bold text-purple-900 text-[11px] flex items-center gap-1.5">
                                            <HeartHandshake className="w-3.5 h-3.5 text-purple-700" />
                                            Pastoral Follow-Up Actions:
                                        </div>
                                        {selectedHouseholdForReview.pastoralFollowup.homeVisits && (
                                            <p className="text-[11px] text-purple-800 font-semibold">• Home Visit Requested</p>
                                        )}
                                        {selectedHouseholdForReview.pastoralFollowup.referral && (
                                            <p className="text-[11px]"><strong>Referral:</strong> {selectedHouseholdForReview.pastoralFollowup.referral}</p>
                                        )}
                                        {selectedHouseholdForReview.pastoralFollowup.nextPastoralAction && (
                                            <p className="text-[11px]"><strong>Next Action:</strong> {selectedHouseholdForReview.pastoralFollowup.nextPastoralAction}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pastoral Listening Details */}
                        <div className="space-y-2 text-xs">
                            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Pastoral Listening Responses</h4>
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-slate-700">
                                <p><strong>Joy / Blessing:</strong> {selectedHouseholdForReview.familyJoy || 'None noted'}</p>
                                <p><strong>Difficulty / Concern:</strong> {selectedHouseholdForReview.familyConcern || 'None noted'}</p>
                                <p><strong>How Parish Can Accompany:</strong> {selectedHouseholdForReview.howParishCanHelp || 'None noted'}</p>
                                {selectedHouseholdForReview.volunteerSkills.length > 0 && (
                                    <p><strong>Gifts & Talents Offered:</strong> {selectedHouseholdForReview.volunteerSkills.join(', ')}</p>
                                )}
                            </div>
                        </div>

                        {/* Pastor Action Form */}
                        {selectedHouseholdForReview.status !== 'Approved' && (
                            <div className="border-t border-slate-200 pt-4 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Notes if returning for correction (optional for approval):
                                    </label>
                                    <input
                                        type="text"
                                        value={correctionNoteInput}
                                        onChange={e => setCorrectionNoteInput(e.target.value)}
                                        placeholder="e.g. Please verify birthdate of eldest child..."
                                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleReturnForCorrection(selectedHouseholdForReview.id)}
                                        className="px-4 py-2 border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                                    >
                                        Return to Volunteer for Correction
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleApproveHousehold(selectedHouseholdForReview.id)}
                                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                                    >
                                        <Check className="w-4 h-4" /> Approve & Save Record
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL: SMART MEMBER SURVEY (PROGRESSIVE DISCLOSURE)                       */}
            {/* ========================================================================= */}
            <MemberSurveyModal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
                member={memberDraft}
                onSave={handleSaveMemberDraft}
                isNew={editingMemberIndex === null}
            />

            {/* ========================================================================= */}
            {/* MODAL: PASTOR ISSUE CERTIFICATE                                           */}
            {/* ========================================================================= */}
            {selectedCertToIssue && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Issue Baptismal Certificate</h3>
                                <p className="text-xs text-slate-500">Recipient: <strong>{selectedCertToIssue.recipientName}</strong></p>
                            </div>
                            <button
                                onClick={() => setSelectedCertToIssue(null)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p><strong>Request ID:</strong> {selectedCertToIssue.requestId}</p>
                                <p><strong>Purpose:</strong> {selectedCertToIssue.purpose}</p>
                                <p><strong>Church:</strong> San Isidro Labrador Parish Church</p>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Book No.</label>
                                    <input
                                        type="text"
                                        value={certBookNo}
                                        onChange={e => setCertBookNo(e.target.value)}
                                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Page No.</label>
                                    <input
                                        type="text"
                                        value={certPageNo}
                                        onChange={e => setCertPageNo(e.target.value)}
                                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Line No.</label>
                                    <input
                                        type="text"
                                        value={certLineNo}
                                        onChange={e => setCertLineNo(e.target.value)}
                                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium text-slate-700 mb-1">Sponsors (Godparents)</label>
                                <input
                                    type="text"
                                    value={certSponsors}
                                    onChange={e => setCertSponsors(e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCertToIssue(null)}
                                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                                >
                                    <Award className="w-4 h-4" /> Sign & Issue Certificate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL: VIEW / PRINT OFFICIAL SACRAMENTAL CERTIFICATE                       */}
            {/* ========================================================================= */}
            {viewingCertificate && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative">
                        {/* Close button */}
                        <button
                            onClick={() => setViewingCertificate(null)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 print:hidden"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Printable Certificate Template */}
                        <div className="border-4 border-double border-amber-900/40 p-6 rounded-xl bg-amber-50/20 text-center space-y-4">
                            {/* Church Header */}
                            <div className="space-y-1">
                                <div className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold">
                                    Archdiocese of Tuguegarao
                                </div>
                                <h2 className="text-xl font-serif font-bold text-slate-900">
                                    San Isidro Labrador Parish Church
                                </h2>
                                <p className="text-xs text-slate-500 font-serif">
                                    San Isidro, Philippines
                                </p>
                            </div>

                            <div className="w-24 h-px bg-amber-900/40 mx-auto"></div>

                            <div className="text-base font-serif font-bold text-amber-900 tracking-wide uppercase pt-1">
                                Certificate of Baptism
                            </div>

                            <div className="text-xs font-serif text-slate-700 leading-relaxed text-justify px-4">
                                This is to certify that <span className="font-bold text-slate-900 text-sm underline decoration-amber-900/50">{viewingCertificate.recipientName}</span>, child of Roberto Santos and Maria Santos, was solemnly baptized according to the Rites of the Holy Roman Catholic Church on <span className="font-semibold">{viewingCertificate.dateOfSacrament}</span> at San Isidro Labrador Parish Church by <span className="font-semibold">{viewingCertificate.ministerName}</span>.
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs font-serif text-left px-4 pt-2">
                                <div>
                                    <span className="text-slate-500 block text-[10px]">Sponsors:</span>
                                    <span className="font-medium text-slate-800">{viewingCertificate.sponsorNames}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block text-[10px]">Parish Registry Record:</span>
                                    <span className="font-medium text-slate-800">
                                        Book {viewingCertificate.bookNo}, Page {viewingCertificate.pageNo}, Line {viewingCertificate.lineNo}
                                    </span>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="pt-8 flex justify-between items-end px-4 text-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-900/30 flex items-center justify-center text-[10px] text-amber-900/40 uppercase font-semibold">
                                        Parish Seal
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="w-48 border-b border-slate-900 pb-1">
                                        <span className="font-serif font-bold text-xs text-slate-900 block">
                                            Rev. Fr. Emmanuel D. Garcia
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 block mt-1">Parish Priest</span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center print:hidden pt-2">
                            <span className="text-xs text-slate-500">
                                Issued for: <strong>{viewingCertificate.purpose}</strong>
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                                >
                                    <Printer className="w-4 h-4" /> Print Certificate
                                </button>
                                <button
                                    onClick={() => setViewingCertificate(null)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL: PARISHIONER REQUEST CERTIFICATE                                     */}
            {/* ========================================================================= */}
            {requestModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-bold text-slate-900 text-sm">Request Sacramental Certificate</h3>
                            <button
                                onClick={() => setRequestModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleMemberRequestCertificate} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Select Household Member *
                                </label>
                                <select
                                    value={requestMemberName}
                                    onChange={e => setRequestMemberName(e.target.value)}
                                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                                >
                                    <option value="Juan Santos">Juan Santos (Son, 12)</option>
                                    <option value="Sofia Santos">Sofia Santos (Daughter, 8)</option>
                                    <option value="Roberto Santos">Roberto Santos (Head)</option>
                                    <option value="Maria Santos">Maria Santos (Spouse)</option>
                                    <option value="Rosa Santos">Rosa Santos (Grandmother)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Certificate Type
                                </label>
                                <select className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg">
                                    <option value="Baptismal">Baptismal Certificate</option>
                                    <option value="Confirmation">Confirmation Certificate</option>
                                    <option value="First Communion">First Communion Certificate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Purpose of Request *
                                </label>
                                <input
                                    type="text"
                                    value={requestPurpose}
                                    onChange={e => setRequestPurpose(e.target.value)}
                                    placeholder="e.g. School Requirement, First Holy Communion, Marriage"
                                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>

                            <p className="text-[11px] text-slate-500">
                                This request will be sent to the Parish Office and Father for verification against the Parish Baptismal Registry Book.
                            </p>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRequestModalOpen(false)}
                                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* ALERT: FAMILY ACCESS RESTRICTION DEMO (FC_MEMBER.jpg)                     */}
            {/* ========================================================================= */}
            {accessDeniedAlert && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
                        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Access Denied</h3>
                            <p className="text-xs text-slate-600 mt-1">
                                You may only view or request certificates for members within your verified household relationship.
                            </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 text-left">
                            <strong>System Rule (from Member Flowchart):</strong><br />
                            Is the selected person within the same family relationship? ➔ <strong>No</strong> ➔ <em>Access denied, show message.</em>
                        </div>
                        <button
                            onClick={() => setAccessDeniedAlert(false)}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
