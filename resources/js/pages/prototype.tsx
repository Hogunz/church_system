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
    Baby
} from 'lucide-react';
import PastorReportsDashboard from '@/components/pastor/PastorReportsDashboard';

// --- TYPES ---
interface FamilyMember {
    id: string;
    dbId?: number;
    fullName: string;
    relationship: 'Head' | 'Spouse' | 'Son' | 'Daughter' | 'Parent' | 'Relative' | 'Other';
    sex: 'Male' | 'Female';
    age: number;
    civilStatus: 'Single' | 'Married (Church)' | 'Civilly Married' | 'Cohabiting' | 'Widowed' | 'Separated';
    isBaptized: boolean;
    isFirstCommunion: boolean;
    isConfirmed: boolean;
    isChurchMarried: boolean;
    specialNeeds?: string;
    isHomebound?: boolean;
}

interface Household {
    id: string;
    dbId?: number;
    familyName: string;
    headName: string;
    address: string;
    barangay: string;
    sitioPurok: string;
    becCluster: string;
    contactNumber: string;
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
        massFrequency: 'Every week',
        becParticipation: 'Regular',
        pastoralNeeds: ['Home communion for elderly grandmother'],
        volunteerSkills: ['Teaching / Catechesis', 'Choir & Music'],
        familyJoy: 'Grateful for good health and eldest son graduating high school.',
        familyConcern: 'Rising prices of basic medicine and groceries.',
        howParishCanHelp: 'Monthly home visit for Lola Rosa to receive Holy Communion.',
        consentGiven: true,
        members: [
            {
                id: 'm-1',
                fullName: 'Roberto Santos',
                relationship: 'Head',
                sex: 'Male',
                age: 45,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
            },
            {
                id: 'm-2',
                fullName: 'Maria Santos',
                relationship: 'Spouse',
                sex: 'Female',
                age: 43,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
            },
            {
                id: 'm-3',
                fullName: 'Juan Santos',
                relationship: 'Son',
                sex: 'Male',
                age: 12,
                civilStatus: 'Single',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: false,
                isChurchMarried: false,
            },
            {
                id: 'm-4',
                fullName: 'Sofia Santos',
                relationship: 'Daughter',
                sex: 'Female',
                age: 8,
                civilStatus: 'Single',
                isBaptized: true,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
            },
            {
                id: 'm-5',
                fullName: 'Rosa Santos',
                relationship: 'Parent',
                sex: 'Female',
                age: 78,
                civilStatus: 'Widowed',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
                isHomebound: true,
                specialNeeds: 'Homebound elderly; difficulty walking',
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
        massFrequency: 'Occasionally',
        becParticipation: 'Sometimes',
        pastoralNeeds: ['Sacramental preparation for children', 'Church wedding guidance'],
        volunteerSkills: ['Carpentry & Repairs'],
        familyJoy: 'New baby born healthy last month.',
        familyConcern: 'Seasonal farming income uncertainty.',
        howParishCanHelp: 'Assistance for civil marriage regularization (Kasalang Bayan) and baptism for infant.',
        consentGiven: true,
        members: [
            {
                id: 'm-6',
                fullName: 'Eduardo Dela Cruz',
                relationship: 'Head',
                sex: 'Male',
                age: 34,
                civilStatus: 'Civilly Married',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: false,
                isChurchMarried: false,
            },
            {
                id: 'm-7',
                fullName: 'Teresa Dela Cruz',
                relationship: 'Spouse',
                sex: 'Female',
                age: 32,
                civilStatus: 'Civilly Married',
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
                isBaptized: false,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
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
        massFrequency: 'Rarely / Never',
        becParticipation: 'Not active',
        pastoralNeeds: ['Pastoral home visit', 'Youth catechesis'],
        volunteerSkills: [],
        familyJoy: 'Children doing well in public school.',
        familyConcern: 'Flooding in riverside area during monsoon rains.',
        howParishCanHelp: 'Visit from the parish team or BEC leaders.',
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
            civilStatus: m.civil_status || 'Single',
            isBaptized: Boolean(m.is_baptized),
            isFirstCommunion: Boolean(m.is_first_communion),
            isConfirmed: Boolean(m.is_confirmed),
            isChurchMarried: Boolean(m.is_church_married),
            isHomebound: Boolean(m.is_homebound),
            specialNeeds: m.special_needs,
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
    const [formBarangay, setFormBarangay] = useState('San Isidro');
    const [formSitio, setFormSitio] = useState('Purok 2');
    const [formBec, setFormBec] = useState('BEC St. Jude');
    const [formContact, setFormContact] = useState('');
    const [formMembers, setFormMembers] = useState<FamilyMember[]>([
        {
            id: 'new-1',
            fullName: '',
            relationship: 'Head',
            sex: 'Male',
            age: 40,
            civilStatus: 'Married (Church)',
            isBaptized: true,
            isFirstCommunion: true,
            isConfirmed: true,
            isChurchMarried: true,
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
    const addMemberRow = () => {
        setFormMembers([
            ...formMembers,
            {
                id: `new-${Date.now()}`,
                fullName: '',
                relationship: 'Son',
                sex: 'Male',
                age: 10,
                civilStatus: 'Single',
                isBaptized: false,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
            }
        ]);
    };

    const updateMember = (index: number, field: keyof FamilyMember, value: any) => {
        const updated = [...formMembers];
        updated[index] = { ...updated[index], [field]: value };
        setFormMembers(updated);
    };

    const removeMember = (index: number) => {
        if (formMembers.length === 1) return;
        setFormMembers(formMembers.filter((_, i) => i !== index));
    };

    const toggleNeed = (need: string) => {
        setFormNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);
    };

    const toggleSkill = (skill: string) => {
        setFormSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
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
            mass_frequency: formMassFreq,
            bec_participation: formBecPart,
            pastoral_needs: formOtherNeed.trim() ? [...formNeeds, `Other: ${formOtherNeed.trim()}`] : formNeeds,
            volunteer_skills: formSkills,
            family_joy: formJoy,
            family_concern: formConcern,
            how_parish_can_help: formHelp,
            consent_given: formConsent,
            members: formMembers.map(m => ({
                full_name: m.fullName.trim() || 'Household Member',
                relationship: m.relationship,
                sex: m.sex,
                age: m.age,
                civil_status: m.civilStatus,
                is_baptized: m.isBaptized,
                is_first_communion: m.isFirstCommunion,
                is_confirmed: m.isConfirmed,
                is_church_married: m.isChurchMarried,
                is_homebound: m.isHomebound ?? false,
                special_needs: m.specialNeeds ?? '',
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
                setFormJoy('');
                setFormConcern('');
                setFormHelp('');
                setFormNeeds([]);
                setFormOtherNeed('');
                setFormSkills([]);
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
                                            onClick={() => setSurveyStep(4)}
                                            className={`flex items-center gap-1.5 ${surveyStep === 4 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}
                                        >
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${surveyStep === 4 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>4</span>
                                            Consent & Submit
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
                                                        Barangay
                                                    </label>
                                                    <select
                                                        value={formBarangay}
                                                        onChange={e => setFormBarangay(e.target.value)}
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                                                    >
                                                        {barangayLabels.map(label => (
                                                            <option key={label} value={label}>{label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        Sitio / Purok
                                                    </label>
                                                    <select
                                                        value={formSitio}
                                                        onChange={e => setFormSitio(e.target.value)}
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                                                    >
                                                        {sitioPurokLabels.map(label => (
                                                            <option key={label} value={label}>{label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                                        BEC (Basic Ecclesial Community)
                                                    </label>
                                                    <select
                                                        value={formBec}
                                                        onChange={e => setFormBec(e.target.value)}
                                                        className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                                                    >
                                                        {becClusterLabels.map(label => (
                                                            <option key={label} value={label}>{label}</option>
                                                        ))}
                                                    </select>
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

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(2)}
                                                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 flex items-center gap-1.5"
                                                >
                                                    Next: Family Members <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: MEMBERS & SACRAMENTS */}
                                    {surveyStep === 2 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-base">Step 2: Household Members & Sacraments</h3>
                                                    <p className="text-xs text-slate-500">Record each person in the house and their sacramental status.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addMemberRow}
                                                    className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add Member
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {formMembers.map((member, index) => (
                                                    <div key={member.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-slate-700">Member #{index + 1}</span>
                                                            {formMembers.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMember(index)}
                                                                    className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                            <div className="sm:col-span-2">
                                                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Full Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={member.fullName}
                                                                    onChange={e => updateMember(index, 'fullName', e.target.value)}
                                                                    placeholder="First Name, M.I., Last Name"
                                                                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Relationship</label>
                                                                <select
                                                                    value={member.relationship}
                                                                    onChange={e => updateMember(index, 'relationship', e.target.value)}
                                                                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                                                                >
                                                                    <option value="Head">Head</option>
                                                                    <option value="Spouse">Spouse</option>
                                                                    <option value="Son">Son</option>
                                                                    <option value="Daughter">Daughter</option>
                                                                    <option value="Parent">Parent / Grandparent</option>
                                                                    <option value="Relative">Relative</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[11px] font-medium text-slate-600 mb-1">Age</label>
                                                                <input
                                                                    type="number"
                                                                    value={member.age}
                                                                    onChange={e => updateMember(index, 'age', parseInt(e.target.value) || 0)}
                                                                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Sacraments Checklist */}
                                                        <div>
                                                            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">Sacraments Received:</label>
                                                            <div className="flex flex-wrap gap-4 text-xs">
                                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={member.isBaptized}
                                                                        onChange={e => updateMember(index, 'isBaptized', e.target.checked)}
                                                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                                                    />
                                                                    <span>Baptized</span>
                                                                </label>
                                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={member.isFirstCommunion}
                                                                        onChange={e => updateMember(index, 'isFirstCommunion', e.target.checked)}
                                                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                                                    />
                                                                    <span>First Communion</span>
                                                                </label>
                                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={member.isConfirmed}
                                                                        onChange={e => updateMember(index, 'isConfirmed', e.target.checked)}
                                                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                                                    />
                                                                    <span>Confirmed</span>
                                                                </label>
                                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={member.isChurchMarried}
                                                                        onChange={e => updateMember(index, 'isChurchMarried', e.target.checked)}
                                                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                                                    />
                                                                    <span>Church Wedding</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Homebound / Sick flag */}
                                                        <div className="pt-1 border-t border-slate-100">
                                                            <label className="flex items-start gap-2 cursor-pointer text-xs">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={member.isHomebound ?? false}
                                                                    onChange={e => updateMember(index, 'isHomebound', e.target.checked)}
                                                                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                                                                />
                                                                <span className="text-slate-700">
                                                                    <strong>This person is sick or cannot go to church</strong>
                                                                    <span className="text-slate-400 ml-1">(bedridden, elderly, needs home communion / sick call)</span>
                                                                </span>
                                                            </label>
                                                            {member.isHomebound && (
                                                                <input
                                                                    type="text"
                                                                    value={member.specialNeeds ?? ''}
                                                                    onChange={e => updateMember(index, 'specialNeeds', e.target.value)}
                                                                    placeholder="Briefly describe situation (e.g. bedridden stroke patient, blind elderly)"
                                                                    className="mt-2 w-full text-xs px-2.5 py-1.5 bg-white border border-rose-300 rounded-lg focus:outline-rose-500"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(1)}
                                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1"
                                                >
                                                    <ChevronLeft className="w-4 h-4" /> Back
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(3)}
                                                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 flex items-center gap-1"
                                                >
                                                    Next: Needs & Gifts <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: PASTORAL NEEDS & STEWARDSHIP GIFTS */}
                                    {surveyStep === 3 && (
                                        <div className="space-y-5 max-w-2xl mx-auto">
                                            <div className="border-b border-slate-100 pb-2">
                                                <h3 className="font-semibold text-slate-900 text-base">Step 3: Pastoral Care & Stewardship</h3>
                                                <p className="text-xs text-slate-500">Record what support this family needs, and what talents they can share.</p>
                                            </div>

                                            {/* Mass & BEC */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">Sunday Mass Attendance</label>
                                                    <select
                                                        value={formMassFreq}
                                                        onChange={e => setFormMassFreq(e.target.value as any)}
                                                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                                                    >
                                                        <option value="Every week">Every week</option>
                                                        <option value="Almost every week">Almost every week</option>
                                                        <option value="Occasionally">Occasionally</option>
                                                        <option value="Rarely / Never">Rarely / Never</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">BEC Gathering Participation</label>
                                                    <select
                                                        value={formBecPart}
                                                        onChange={e => setFormBecPart(e.target.value as any)}
                                                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                                                    >
                                                        <option value="Regular">Regular</option>
                                                        <option value="Sometimes">Sometimes</option>
                                                        <option value="Rarely">Rarely</option>
                                                        <option value="Not active">Not active</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Pastoral Needs Checklist */}
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-2">
                                                    Pastoral Needs Requested by Household:
                                                </label>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {[
                                                        'Sacramental preparation for children',
                                                        'Home communion for elderly / sick',
                                                        'Church wedding assistance (Kasalang Bayan)',
                                                        'Youth catechesis / involvement',
                                                        'Livelihood / educational help',
                                                        'Pastoral home visit by Parish team'
                                                    ].map(need => (
                                                        <label key={need} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
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
                                                <div className="mt-2">
                                                    <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer text-xs">
                                                        <input
                                                            type="checkbox"
                                                            checked={formOtherNeed.length > 0}
                                                            onChange={e => { if (!e.target.checked) setFormOtherNeed(''); }}
                                                            className="rounded text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="text-slate-800 font-medium">Other need not listed above</span>
                                                    </label>
                                                    {formOtherNeed !== undefined && (
                                                        <input
                                                            type="text"
                                                            value={formOtherNeed}
                                                            onChange={e => setFormOtherNeed(e.target.value)}
                                                            placeholder="Please describe the specific need..."
                                                            className="mt-1.5 w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-emerald-500"
                                                        />
                                                    )}
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
                                                    <ChevronLeft className="w-4 h-4" /> Back
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(4)}
                                                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 flex items-center gap-1"
                                                >
                                                    Next: Consent & Submit <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4: CONSENT & SUBMIT */}
                                    {surveyStep === 4 && (
                                        <div className="space-y-5 max-w-xl mx-auto">
                                            <div className="border-b border-slate-100 pb-2">
                                                <h3 className="font-semibold text-slate-900 text-base">Step 4: Consent & Final Submission</h3>
                                                <p className="text-xs text-slate-500">Confirm respondent consent before submitting to the Pastor.</p>
                                            </div>

                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                                                <div className="font-semibold text-slate-900">Summary of Entry:</div>
                                                <p>• <strong>Family:</strong> {formFamilyName || 'Not entered yet'}</p>
                                                <p>• <strong>Address:</strong> {formAddress}, {formSitio}, {formBarangay}</p>
                                                <p>• <strong>Members:</strong> {formMembers.length} recorded</p>
                                                <p>• <strong>Needs:</strong> {formNeeds.length > 0 ? formNeeds.join(', ') : 'None marked'}</p>
                                                <p>• <strong>Talents Offered:</strong> {formSkills.length > 0 ? formSkills.join(', ') : 'None marked'}</p>
                                            </div>

                                            <label className="flex items-start gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formConsent}
                                                    onChange={e => setFormConsent(e.target.checked)}
                                                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                                                    required
                                                />
                                                <div className="text-xs text-slate-700">
                                                    <span className="font-semibold text-slate-900 block">Informed Consent Obtained</span>
                                                    The respondent has consented to share this household information for pastoral accompaniment, sacramental verification, and parish records.
                                                </div>
                                            </label>

                                            <div className="flex justify-between pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSurveyStep(3)}
                                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1"
                                                >
                                                    <ChevronLeft className="w-4 h-4" /> Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 flex items-center gap-2 shadow-xs"
                                                >
                                                    <Send className="w-4 h-4" /> Submit for Pastor Review
                                                </button>
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
                                                    <p className="text-xs text-stone-400">
                                                        Encoded by {h.encodedBy} on {h.dateEncoded} &nbsp;•&nbsp; {h.members.length} members
                                                    </p>
                                                    {h.pastoralNeeds.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                            {h.pastoralNeeds.map(need => (
                                                                <span key={need} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
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
                                                        {h.address}, {h.sitioPurok} &nbsp;•&nbsp; <strong>BEC:</strong> {h.becCluster}
                                                    </p>
                                                    <p className="text-xs text-stone-400 mt-0.5">
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
                {currentRole === 'member' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {/* Member Identity Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-xs font-medium text-slate-400">Parishioner Self-Service</span>
                                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">Santos Family</h2>
                                    <p className="text-xs text-slate-500">
                                        Household ID: <strong>FAM-2026-0042</strong> • Barangay San Isidro, Purok 3 • BEC St. Jude
                                    </p>
                                </div>
                                <button
                                    onClick={() => setRequestModalOpen(true)}
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                                >
                                    <Plus className="w-4 h-4" /> Request Certificate
                                </button>
                            </div>

                            {/* Registered Family Members */}
                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                                    Registered Family Members (Verified by Pastor)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {households.find(h => h.id === 'FAM-2026-0042')?.members.map(member => (
                                        <div key={member.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900">{member.fullName}</span>
                                                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                                                    {member.relationship} ({member.age} yrs)
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 text-[10px]">
                                                <span className={`px-1.5 py-0.5 rounded ${member.isBaptized ? 'bg-emerald-100 text-emerald-800 font-medium' : 'bg-slate-200 text-slate-600'}`}>
                                                    {member.isBaptized ? '✓ Baptized' : 'Not Baptized'}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded ${member.isFirstCommunion ? 'bg-emerald-100 text-emerald-800 font-medium' : 'bg-slate-200 text-slate-600'}`}>
                                                    {member.isFirstCommunion ? '✓ 1st Communion' : 'No Communion'}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded ${member.isConfirmed ? 'bg-emerald-100 text-emerald-800 font-medium' : 'bg-slate-200 text-slate-600'}`}>
                                                    {member.isConfirmed ? '✓ Confirmed' : 'No Confirmation'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Certificates Available for Household */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Issued Sacramental Certificates</h3>
                                    <p className="text-xs text-slate-500">Official certificates signed by the Parish Priest.</p>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
                                {certificates.filter(c => c.familyId === 'FAM-2026-0042').map(cert => (
                                    <div key={cert.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

                            {/* Verification Demo Button (Flowchart FC_MEMBER check) */}
                            <div className="pt-3 border-t border-slate-100">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <span className="text-xs font-bold text-slate-800 block">Family Relationship Security Check</span>
                                        <span className="text-[11px] text-slate-500">
                                            Per Church privacy rules, members can only access certificates of people within their verified household.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAccessDeniedAlert(true)}
                                        className="px-3 py-1.5 text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg whitespace-nowrap shrink-0"
                                    >
                                        Test Outside Family Access
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* ========================================================================= */}
                {/* 4. PARISH PASTORAL COUNCIL (PPC) SUMMARY DASHBOARD                        */}
                {/* ========================================================================= */}
                {currentRole === 'ppc' && (
                    <div className="space-y-6">
                        {/* Intro banner */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Parish Pastoral Council</span>
                            <h2 className="text-xl font-bold text-slate-900 mt-0.5">Parish Pastoral Summary</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Aggregated indicators for pastoral discernment. Individual confidential family details remain private.
                            </p>
                        </div>

                        {/* Top KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">Total Families Encoded</span>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{households.length}</p>
                                <span className="text-[11px] text-emerald-600 font-medium">Across 3 BEC Clusters</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">BEC Participation Rate</span>
                                <p className="text-2xl font-bold text-blue-600 mt-1">67%</p>
                                <span className="text-[11px] text-slate-500">Active grassroots presence</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">Pastoral Visits Requested</span>
                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    {households.filter(h => h.pastoralNeeds.some(n => n.includes('visit') || n.includes('communion'))).length + 2}
                                </p>
                                <span className="text-[11px] text-slate-500">Elderly & homebound priority</span>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <span className="text-xs font-medium text-slate-500">Volunteers & Charisms</span>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">
                                    {households.reduce((acc, h) => acc + h.volunteerSkills.length, 0) + 4}
                                </p>
                                <span className="text-[11px] text-slate-500">Stewardship talents offered</span>
                            </div>
                        </div>

                        {/* Three Commissions Grid (Worship, Evangelization, Social Services) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Commission on Worship */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                        W
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Commission on Worship</h3>
                                        <p className="text-[11px] text-slate-500">Sacramental & liturgical needs</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Children needing Baptism</span>
                                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                            {households.flatMap(h => h.members).filter(m => !m.isBaptized).length + 5}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Awaiting First Communion</span>
                                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                            {households.flatMap(h => h.members).filter(m => m.age >= 7 && !m.isFirstCommunion).length + 8}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Awaiting Confirmation</span>
                                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                            {households.flatMap(h => h.members).filter(m => m.age >= 12 && !m.isConfirmed).length + 12}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Couples for Church Wedding</span>
                                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                            {households.filter(h => h.members.some(m => m.civilStatus === 'Civilly Married' || m.civilStatus === 'Cohabiting')).length + 4}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Commission on Evangelization */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                        E
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Commission on Evangelization</h3>
                                        <p className="text-[11px] text-slate-500">Formation & faith outreach</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Youth ready for formation</span>
                                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            {households.flatMap(h => h.members).filter(m => m.age >= 13 && m.age <= 22).length + 14}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Inactive families open to visit</span>
                                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            {households.filter(h => h.becParticipation === 'Not active' || h.massFrequency === 'Rarely / Never').length + 3}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Bible & Catechism requests</span>
                                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            9 families
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Potential BEC Animators</span>
                                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            6 parishioners
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Commission on Social Services */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                                        S
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Commission on Social Services</h3>
                                        <p className="text-[11px] text-slate-500">Care for the sick, elderly & needy</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Homebound elderly / Sick</span>
                                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                            {households.flatMap(h => h.members).filter(m => m.isHomebound).length + 4}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Persons with Disability (PWD)</span>
                                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                            3 members
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Livelihood assistance needs</span>
                                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                            7 families
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">Flooding / Shelter concerns</span>
                                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                            5 families
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stewardship Pool: Available Talents */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Stewardship Talents Offered by Parishioners</h3>
                                <p className="text-xs text-slate-500">
                                    People willing to share time, skills, and professional services to build up the parish.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                    { label: 'Teaching / Catechesis', count: 8 },
                                    { label: 'Choir & Music', count: 6 },
                                    { label: 'Medical / First Aid', count: 4 },
                                    { label: 'Carpentry & Maintenance', count: 5 },
                                    { label: 'Youth Mentorship', count: 7 },
                                    { label: 'Legal / Administrative Advice', count: 2 },
                                    { label: 'BEC Coordination', count: 9 },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                        <span className="text-slate-800 font-medium">{item.label}</span>
                                        <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ========================================================================= */}
            {/* MODAL: PASTOR REVIEW HOUSEHOLD                                            */}
            {/* ========================================================================= */}
            {selectedHouseholdForReview && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {selectedHouseholdForReview.familyName} Family Record
                                </h3>
                                <p className="text-xs text-slate-500">
                                    ID: {selectedHouseholdForReview.id} • Status: <span className="font-semibold text-amber-700">{selectedHouseholdForReview.status}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedHouseholdForReview(null)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Location Details */}
                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div><strong>Head:</strong> {selectedHouseholdForReview.headName}</div>
                            <div><strong>Address:</strong> {selectedHouseholdForReview.address}</div>
                            <div><strong>Barangay:</strong> {selectedHouseholdForReview.barangay}, {selectedHouseholdForReview.sitioPurok}</div>
                            <div><strong>BEC:</strong> {selectedHouseholdForReview.becCluster}</div>
                            <div><strong>Mass:</strong> {selectedHouseholdForReview.massFrequency}</div>
                            <div><strong>BEC Meetings:</strong> {selectedHouseholdForReview.becParticipation}</div>
                        </div>

                        {/* Members Table */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Household Members</h4>
                            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                                <table className="w-full text-left divide-y divide-slate-200">
                                    <thead className="bg-slate-100 text-slate-600 font-medium">
                                        <tr>
                                            <th className="p-2">Name</th>
                                            <th className="p-2">Relation</th>
                                            <th className="p-2">Age</th>
                                            <th className="p-2">Baptized</th>
                                            <th className="p-2">Communion</th>
                                            <th className="p-2">Confirmed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {selectedHouseholdForReview.members.map(m => (
                                            <tr key={m.id}>
                                                <td className="p-2 font-medium text-slate-900">{m.fullName}</td>
                                                <td className="p-2 text-slate-600">{m.relationship}</td>
                                                <td className="p-2 text-slate-600">{m.age}</td>
                                                <td className="p-2">{m.isBaptized ? '✓ Yes' : '— No'}</td>
                                                <td className="p-2">{m.isFirstCommunion ? '✓ Yes' : '— No'}</td>
                                                <td className="p-2">{m.isConfirmed ? '✓ Yes' : '— No'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pastoral Listening Details */}
                        <div className="space-y-2 text-xs">
                            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Pastoral Listening Responses</h4>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                                <p><strong>Joy / Blessing:</strong> {selectedHouseholdForReview.familyJoy}</p>
                                <p><strong>Difficulty / Concern:</strong> {selectedHouseholdForReview.familyConcern}</p>
                                <p><strong>How Parish Can Accompany:</strong> {selectedHouseholdForReview.howParishCanHelp}</p>
                                {selectedHouseholdForReview.volunteerSkills.length > 0 && (
                                    <p><strong>Gifts Offered:</strong> {selectedHouseholdForReview.volunteerSkills.join(', ')}</p>
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
                                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
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
