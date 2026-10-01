import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import PastorReportsDashboard, { Household, FamilyMember } from '@/components/pastor/PastorReportsDashboard';
import { Church, ExternalLink } from 'lucide-react';

interface DashboardProps {
    initialHouseholds?: any[];
    initialCertificates?: any[];
    parishOptions?: Record<string, any[]>;
}

export default function Dashboard({
    initialHouseholds = [],
}: DashboardProps) {
    const mapBackendHousehold = (h: any): Household => ({
        id: h.family_code || `FAM-${h.id}`,
        dbId: h.id,
        familyName: h.family_name,
        headName: h.head_name || h.family_name,
        address: h.address,
        barangay: h.barangay,
        sitioPurok: h.sitio_purok,
        becCluster: h.bec_cluster,
        contactNumber: h.contact_number || '',
        dateEncoded: h.date_encoded ? String(h.date_encoded).split('T')[0] : '',
        status: h.status === 'approved' ? 'Approved' : h.status === 'returned_for_correction' ? 'Returned for Correction' : 'Pending Review',
        correctionNote: h.correction_notes,
        encodedBy: h.encoded_by?.name || 'Volunteer',
        massFrequency: h.mass_frequency || 'Every week',
        becParticipation: h.bec_participation || 'Regular',
        pastoralNeeds: Array.isArray(h.pastoral_needs) ? h.pastoral_needs : [],
        volunteerSkills: Array.isArray(h.volunteer_skills) ? h.volunteer_skills : [],
        familyJoy: h.family_joy || '',
        familyConcern: h.family_concern || '',
        howParishCanHelp: h.how_parish_can_help || '',
        consentGiven: Boolean(h.consent_given),
        members: (h.members || []).map((m: any): FamilyMember => ({
            id: `m-${m.id}`,
            dbId: m.id,
            fullName: m.full_name,
            relationship: m.relationship || 'Member',
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

    const households: Household[] = useMemo(() => {
        if (initialHouseholds && initialHouseholds.length > 0) {
            return initialHouseholds.map(mapBackendHousehold);
        }
        return [];
    }, [initialHouseholds]);

    return (
        <>
            <Head title="Pastor Reports & Intelligence Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6 bg-slate-50/60">
                {/* Header banner */}
                <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Pastor Portal</span>
                        <h2 className="text-xl font-bold mt-0.5">Rev. Fr. Emmanuel D. Garcia</h2>
                        <p className="text-xs text-emerald-200 mt-1">
                            Parish Priest • Pastoral Reports, Sacramental Backlog & Grassroots Community Census
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/prototype?role=pastor"
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-600 shadow-2xs transition-colors"
                        >
                            <span>Open Full Parish Portal</span>
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                        </Link>
                    </div>
                </div>

                {/* Pastor Reports Dashboard */}
                <PastorReportsDashboard
                    households={households}
                />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Pastor Reports Dashboard',
            href: dashboard(),
        },
    ],
};
