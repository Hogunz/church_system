import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import type { Household, FamilyMember, CertificateRecord, RoleType, ParishOptionItem } from '@/types/parish';
import ParishAppShell from '@/components/parish/ParishAppShell';
import VolunteerPortal from '@/components/parish/VolunteerPortal';
import PastorPortal from '@/components/parish/PastorPortal';
import ParishionerPortal from '@/components/parish/ParishionerPortal';
import CouncilPortal from '@/components/parish/CouncilPortal';
import HouseholdDetailModal from '@/components/parish/HouseholdDetailModal';
import CertificatePrintModal from '@/components/parish/CertificatePrintModal';

interface PrototypeProps {
    initialHouseholds?: any[];
    initialCertificates?: any[];
    parishOptions?: Record<string, ParishOptionItem[]>;
}

// Fallback Initial Sample Data
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
                occupation: 'Market Vendor (Sari-Sari)',
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
                age: 16,
                civilStatus: 'Single',
                occupation: 'High School Student',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: false,
            },
            {
                id: 'm-4',
                fullName: 'Sofia Santos',
                relationship: 'Daughter',
                sex: 'Female',
                age: 9,
                civilStatus: 'Single',
                occupation: 'Elementary Student',
                isBaptized: true,
                isFirstCommunion: false,
                isConfirmed: false,
                isChurchMarried: false,
            },
        ],
    },
    {
        id: 'FAM-2026-0043',
        familyName: 'Dela Cruz',
        headName: 'Antonio Dela Cruz',
        address: '58 Ilaya Street',
        barangay: 'San Isidro',
        sitioPurok: 'Sitio Ilaya',
        becCluster: 'BEC San Pedro',
        contactNumber: '0918-987-6543',
        dateEncoded: '2026-10-02',
        status: 'Pending Review',
        encodedBy: 'Ana Ramos (Volunteer)',
        housingSituation: 'Renting / Nangungupahan',
        monthlyIncome: '₱5,001 – ₱10,000',
        isVulnerable: true,
        massFrequency: 'Almost every week',
        becParticipation: 'Sometimes',
        pastoralNeeds: ['Anointing of the sick', 'Livelihood & emergency aid assistance'],
        volunteerSkills: ['Medical & Health Services (Nurse/Doctor)'],
        familyJoy: 'Family unity during sickness.',
        familyConcern: 'Need regular dialysis assistance.',
        howParishCanHelp: 'Pastoral visit for communion & medical volunteer network support.',
        consentGiven: true,
        members: [
            {
                id: 'm-5',
                fullName: 'Antonio Dela Cruz',
                relationship: 'Head',
                sex: 'Male',
                age: 62,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
                isSenior: true,
                isHomebound: true,
            },
            {
                id: 'm-6',
                fullName: 'Elena Dela Cruz',
                relationship: 'Spouse',
                sex: 'Female',
                age: 58,
                civilStatus: 'Married (Church)',
                isBaptized: true,
                isFirstCommunion: true,
                isConfirmed: true,
                isChurchMarried: true,
            },
        ],
    },
];

const INITIAL_CERTIFICATES: CertificateRecord[] = [
    {
        id: 'CERT-2026-001',
        requestId: 'REQ-001',
        recipientName: 'Juan Santos',
        familyId: 'FAM-2026-0042',
        certificateType: 'Baptismal',
        dateOfSacrament: 'June 15, 2014',
        placeOfSacrament: 'San Isidro Labrador Parish Church',
        ministerName: 'Rev. Fr. Emmanuel D. Garcia',
        bookNo: 'Book 42',
        pageNo: 'Page 88',
        lineNo: 'Line 12',
        sponsorNames: 'Pedro Reyes & Clara Gonzales',
        purpose: 'School Enrollment Requirement',
        dateIssued: '2026-09-25',
        status: 'Approved & Issued',
        issuedBy: 'Rev. Fr. Emmanuel D. Garcia (Parish Priest)',
    },
    {
        id: 'CERT-2026-002',
        requestId: 'REQ-002',
        recipientName: 'Sofia Santos',
        familyId: 'FAM-2026-0042',
        certificateType: 'First Communion',
        dateOfSacrament: 'May 19, 2024',
        placeOfSacrament: 'San Isidro Labrador Parish Church',
        ministerName: 'Rev. Fr. Emmanuel D. Garcia',
        bookNo: 'Book 18',
        pageNo: 'Page 34',
        lineNo: 'Line 05',
        sponsorNames: 'Maria Clara Santos',
        purpose: 'Personal & Family Ecclesial Record',
        dateIssued: undefined,
        status: 'Pending Review',
    },
];

export default function Prototype({
    initialHouseholds,
    initialCertificates,
    parishOptions = {},
}: PrototypeProps) {
    // Backend mapper helpers
    const mapBackendHousehold = (h: any): Household => ({
        id: h.family_code || `FAM-${h.id}`,
        dbId: h.id,
        familyName: h.family_name,
        headName: h.head_name,
        address: h.address || '',
        barangay: h.barangay || 'San Isidro',
        sitioPurok: h.sitio_purok || 'Purok 1',
        becCluster: h.bec_cluster || 'BEC St. Jude',
        contactNumber: h.contact_number || '',
        housingSituation: h.housing_situation || '',
        monthlyIncome: h.monthly_income || '',
        isVulnerable: Boolean(h.is_vulnerable),
        livelihoodAssistanceNeeded: h.livelihood_assistance_needed || '',
        dateEncoded: h.created_at ? String(h.created_at).split('T')[0] : new Date().toISOString().split('T')[0],
        status: h.status === 'approved' ? 'Approved' : h.status === 'returned_for_correction' ? 'Returned for Correction' : 'Pending Review',
        correctionNote: h.correction_notes || '',
        encodedBy: h.encoded_by?.name ? `${h.encoded_by.name} (Volunteer)` : 'Ana Ramos (Volunteer)',
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
            isBaptized: Boolean(m.is_baptized),
            isFirstCommunion: Boolean(m.is_first_communion),
            isConfirmed: Boolean(m.is_confirmed),
            isChurchMarried: Boolean(m.is_church_married),
            isHomebound: Boolean(m.is_homebound),
            specialNeeds: m.special_needs,
            isSenior: Boolean(m.is_senior || (m.age >= 60)),
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
        dateOfSacrament: c.date_of_sacrament ? String(c.date_of_sacrament).split('T')[0] : 'June 15, 2014',
        placeOfSacrament: c.place_of_sacrament || 'San Isidro Labrador Parish Church',
        ministerName: c.minister_name || 'Rev. Fr. Emmanuel D. Garcia',
        bookNo: c.book_no || '',
        pageNo: c.page_no || '',
        lineNo: c.line_no || '',
        sponsorNames: c.sponsor_names || '',
        purpose: c.purpose,
        dateIssued: c.issued_at ? String(c.issued_at).split('T')[0] : undefined,
        status: c.status === 'approved_and_issued' ? 'Approved & Issued' : 'Pending Review',
        issuedBy: c.issued_by?.name || 'Rev. Fr. Emmanuel D. Garcia (Parish Priest)',
    });

    // Top-level State
    const [currentRole, setCurrentRole] = useState<RoleType>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const role = params.get('role');
            if (role === 'volunteer' || role === 'pastor' || role === 'member' || role === 'ppc') {
                return role;
            }
        }
        return 'volunteer';
    });

    const [activeTab, setActiveTab] = useState<string>('survey');

    // Households & Certificates State
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

    // Handle Role Switching with URL preservation
    const handleRoleChange = (role: RoleType) => {
        setCurrentRole(role);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('role', role);
            window.history.pushState({}, '', url.toString());
        }
        // Set default active tab for that role
        switch (role) {
            case 'volunteer':
                setActiveTab('survey');
                break;
            case 'pastor':
                setActiveTab('reports');
                break;
            case 'member':
                setActiveTab('household');
                break;
            case 'ppc':
                setActiveTab('overview');
                break;
        }
    };

    // Modals state
    const [detailHousehold, setDetailHousehold] = useState<Household | null>(null);
    const [printCertificate, setPrintCertificate] = useState<CertificateRecord | null>(null);

    // --- BACKEND ACTION HANDLERS ---
    const handleSubmitHousehold = (householdData: Partial<Household>) => {
        router.post('/households', {
            family_name: householdData.familyName,
            head_name: householdData.headName,
            address: householdData.address,
            barangay: householdData.barangay,
            sitio_purok: householdData.sitioPurok,
            bec_cluster: householdData.becCluster,
            contact_number: householdData.contactNumber,
            housing_situation: householdData.housingSituation,
            monthly_income: householdData.monthlyIncome,
            is_vulnerable: householdData.isVulnerable,
            livelihood_assistance_needed: householdData.livelihoodAssistanceNeeded,
            mass_frequency: householdData.massFrequency,
            bec_participation: householdData.becParticipation,
            pastoral_needs: householdData.pastoralNeeds,
            volunteer_skills: householdData.volunteerSkills,
            training_needs: householdData.trainingNeeds,
            family_joy: householdData.familyJoy,
            family_concern: householdData.familyConcern,
            how_parish_can_help: householdData.howParishCanHelp,
            consent_given: householdData.consentGiven,
            members: (householdData.members || []).map(m => ({
                full_name: m.fullName,
                relationship: m.relationship,
                sex: m.sex,
                age: m.age,
                birthdate: m.birthdate || null,
                civil_status: m.civilStatus,
                occupation: m.occupation || null,
                is_baptized: m.isBaptized,
                is_first_communion: m.isFirstCommunion,
                is_confirmed: m.isConfirmed,
                is_church_married: m.isChurchMarried,
                is_homebound: m.isHomebound ?? false,
                is_senior: m.isSenior ?? (m.age >= 60),
                special_needs: m.specialNeeds || '',
            })),
        }, {
            preserveScroll: true,
            onError: () => {
                // Fallback optimistic local addition
                const optimistic: Household = {
                    id: householdData.id || `FAM-${Date.now().toString().slice(-4)}`,
                    familyName: householdData.familyName || '',
                    headName: householdData.headName || '',
                    address: householdData.address || '',
                    barangay: householdData.barangay || 'San Isidro',
                    sitioPurok: householdData.sitioPurok || 'Purok 1',
                    becCluster: householdData.becCluster || 'BEC St. Jude',
                    contactNumber: householdData.contactNumber || '',
                    dateEncoded: new Date().toISOString().split('T')[0],
                    status: 'Pending Review',
                    encodedBy: 'Ana Ramos (Volunteer)',
                    members: householdData.members || [],
                    massFrequency: householdData.massFrequency || 'Every week',
                    becParticipation: householdData.becParticipation || 'Regular',
                    pastoralNeeds: householdData.pastoralNeeds || [],
                    volunteerSkills: householdData.volunteerSkills || [],
                    familyJoy: householdData.familyJoy || '',
                    familyConcern: householdData.familyConcern || '',
                    howParishCanHelp: householdData.howParishCanHelp || '',
                    consentGiven: true,
                };
                setHouseholds(prev => [optimistic, ...prev]);
            }
        });
    };

    const handleApproveHousehold = (h: Household) => {
        if (h.dbId) {
            router.post(`/households/${h.dbId}/review`, { action: 'approve' }, {
                preserveScroll: true,
                onSuccess: () => {
                    setDetailHousehold(null);
                }
            });
        } else {
            setHouseholds(prev => prev.map(item => item.id === h.id ? { ...item, status: 'Approved', correctionNote: '' } : item));
            setDetailHousehold(null);
        }
    };

    const handleReturnHousehold = (h: Household, note: string) => {
        if (h.dbId) {
            router.post(`/households/${h.dbId}/review`, { action: 'return_for_correction', correction_notes: note }, {
                preserveScroll: true,
                onSuccess: () => {
                    setDetailHousehold(null);
                }
            });
        } else {
            setHouseholds(prev => prev.map(item => item.id === h.id ? { ...item, status: 'Returned for Correction', correctionNote: note } : item));
            setDetailHousehold(null);
        }
    };

    const handleIssueCertificate = (
        cert: CertificateRecord,
        details: { bookNo: string; pageNo: string; lineNo: string; ministerName: string; sponsorNames: string }
    ) => {
        if (cert.dbId) {
            router.post(`/certificates/${cert.dbId}/issue`, {
                book_no: details.bookNo,
                page_no: details.pageNo,
                line_no: details.lineNo,
                minister_name: details.ministerName,
                sponsor_names: details.sponsorNames,
            }, {
                preserveScroll: true,
            });
        } else {
            setCertificates(prev => prev.map(c => c.id === cert.id ? {
                ...c,
                status: 'Approved & Issued',
                bookNo: details.bookNo,
                pageNo: details.pageNo,
                lineNo: details.lineNo,
                ministerName: details.ministerName,
                sponsorNames: details.sponsorNames,
                dateIssued: new Date().toISOString().split('T')[0],
            } : c));
        }
    };

    const handleRequestCertificate = (
        member: FamilyMember,
        type: 'Baptismal' | 'Confirmation' | 'First Communion',
        purpose: string
    ) => {
        const primaryHousehold = households.find(h => h.id === 'FAM-2026-0042') || households[0];
        if (primaryHousehold?.dbId && member.dbId) {
            router.post('/certificates/request', {
                household_id: primaryHousehold.dbId,
                family_member_id: member.dbId,
                certificate_type: type,
                purpose,
            }, {
                preserveScroll: true,
            });
        } else {
            const newCert: CertificateRecord = {
                id: `CERT-2026-00${certificates.length + 1}`,
                requestId: `REQ-${Date.now().toString().slice(-4)}`,
                recipientName: member.fullName,
                familyId: primaryHousehold?.id || 'FAM-2026-0042',
                certificateType: type,
                dateOfSacrament: 'June 15, 2014',
                placeOfSacrament: 'San Isidro Labrador Parish Church',
                ministerName: 'Rev. Fr. Emmanuel D. Garcia',
                bookNo: '',
                pageNo: '',
                lineNo: '',
                sponsorNames: '',
                purpose,
                status: 'Pending Review',
            };
            setCertificates(prev => [newCert, ...prev]);
        }
    };

    const handleAddOption = (type: string, label: string) => {
        router.post('/parish-options', { type, label }, { preserveScroll: true });
    };

    const handleDeleteOption = (id: number) => {
        router.delete(`/parish-options/${id}`, { preserveScroll: true });
    };

    // Counts
    const pendingHouseholdCount = households.filter(h => h.status === 'Pending Review').length;
    const pendingCertCount = certificates.filter(c => c.status === 'Pending Review').length;

    // Santos family for Parishioner portal
    const parishionerHousehold = households.find(h => h.id === 'FAM-2026-0042') || households[0];

    return (
        <ParishAppShell
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingHouseholdCount={pendingHouseholdCount}
            pendingCertCount={pendingCertCount}
            totalHouseholdsCount={households.length}
        >
            <Head title={`Parish System &bull; ${currentRole.toUpperCase()}`} />

            {/* PORTAL VIEWS */}
            {currentRole === 'volunteer' && (
                <VolunteerPortal
                    households={households}
                    activeSubTab={activeTab}
                    onSubTabChange={setActiveTab}
                    onSubmitHousehold={handleSubmitHousehold}
                    onViewHouseholdDetail={h => setDetailHousehold(h)}
                    parishOptions={parishOptions}
                />
            )}

            {currentRole === 'pastor' && (
                <PastorPortal
                    households={households}
                    certificates={certificates}
                    activeSubTab={activeTab}
                    onSubTabChange={setActiveTab}
                    onApproveHousehold={handleApproveHousehold}
                    onReturnHousehold={handleReturnHousehold}
                    onIssueCertificate={handleIssueCertificate}
                    onViewHouseholdDetail={h => setDetailHousehold(h)}
                    onViewCertificatePrint={c => setPrintCertificate(c)}
                    parishOptions={parishOptions}
                    onAddOption={handleAddOption}
                    onDeleteOption={handleDeleteOption}
                />
            )}

            {currentRole === 'member' && (
                <ParishionerPortal
                    household={parishionerHousehold}
                    certificates={certificates}
                    activeSubTab={activeTab}
                    onSubTabChange={setActiveTab}
                    onRequestCertificate={handleRequestCertificate}
                    onViewCertificatePrint={c => setPrintCertificate(c)}
                />
            )}

            {currentRole === 'ppc' && (
                <CouncilPortal
                    households={households}
                    activeSubTab={activeTab}
                    onSubTabChange={setActiveTab}
                />
            )}

            {/* MODALS */}
            {detailHousehold && (
                <HouseholdDetailModal
                    isOpen={Boolean(detailHousehold)}
                    onClose={() => setDetailHousehold(null)}
                    household={detailHousehold}
                    isPastor={currentRole === 'pastor'}
                    onApprove={handleApproveHousehold}
                    onReturn={handleReturnHousehold}
                />
            )}

            {printCertificate && (
                <CertificatePrintModal
                    isOpen={Boolean(printCertificate)}
                    onClose={() => setPrintCertificate(null)}
                    certificate={printCertificate}
                />
            )}
        </ParishAppShell>
    );
}
