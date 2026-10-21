import React, { useState } from 'react';
import {
    Plus,
    Users,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Trash2,
    Pencil,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    HeartPulse,
    Church,
    Home,
    Phone,
    MapPin,
    Search,
    BookOpen,
} from 'lucide-react';
import type { Household, FamilyMember, ParishOptionItem } from '@/types/parish';
import MemberSurveyModal from '@/components/volunteer/MemberSurveyModal';
import {
    BARANGAYS_DEFAULT,
    SITIOS_DEFAULT,
    BEC_CLUSTERS_DEFAULT,
    PASTORAL_NEEDS_DEFAULT,
    VOLUNTEER_SKILLS_DEFAULT,
    UNIVERSITY_TRAINING_TOPICS,
} from './parishConstants';

interface VolunteerPortalProps {
    households: Household[];
    activeSubTab: string;
    onSubTabChange: (tab: string) => void;
    onSubmitHousehold: (householdData: Partial<Household>) => void;
    onViewHouseholdDetail: (household: Household) => void;
    parishOptions?: Record<string, ParishOptionItem[]>;
}

export default function VolunteerPortal({
    households,
    activeSubTab,
    onSubTabChange,
    onSubmitHousehold,
    onViewHouseholdDetail,
    parishOptions = {},
}: VolunteerPortalProps) {
    // Dropdown helpers
    const barangayList = parishOptions['barangays']?.map(o => o.label) || BARANGAYS_DEFAULT;
    const sitioList = parishOptions['sitios']?.map(o => o.label) || SITIOS_DEFAULT;
    const becList = parishOptions['bec_clusters']?.map(o => o.label) || BEC_CLUSTERS_DEFAULT;
    const pastoralNeedsList = parishOptions['pastoral_needs']?.map(o => o.label) || PASTORAL_NEEDS_DEFAULT;
    const volunteerSkillsList = parishOptions['volunteer_skills']?.map(o => o.label) || VOLUNTEER_SKILLS_DEFAULT;

    // Survey Form State
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // Form Fields
    const [familyName, setFamilyName] = useState('');
    const [headName, setHeadName] = useState('');
    const [address, setAddress] = useState('');
    const [barangay, setBarangay] = useState(barangayList[0] || 'San Isidro');
    const [sitioPurok, setSitioPurok] = useState(sitioList[0] || 'Purok 1');
    const [becCluster, setBecCluster] = useState(becList[0] || 'BEC St. Jude');
    const [contactNumber, setContactNumber] = useState('');
    const [housingSituation, setHousingSituation] = useState('Owned (Sariling Bahay at Lupa)');
    const [monthlyIncome, setMonthlyIncome] = useState('₱10,001 – ₱15,000');
    const [isVulnerable, setIsVulnerable] = useState(false);
    const [livelihoodAssistanceNeeded, setLivelihoodAssistanceNeeded] = useState('');

    // Members list
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
    const [isNewMember, setIsNewMember] = useState(true);

    // Pastoral & Listening
    const [massFrequency, setMassFrequency] = useState<'Every week' | 'Almost every week' | 'Occasionally' | 'Rarely / Never'>('Every week');
    const [becParticipation, setBecParticipation] = useState<'Regular' | 'Sometimes' | 'Rarely' | 'Not active'>('Regular');
    const [selectedPastoralNeeds, setSelectedPastoralNeeds] = useState<string[]>([]);
    const [selectedVolunteerSkills, setSelectedVolunteerSkills] = useState<string[]>([]);
    const [selectedTrainingTopics, setSelectedTrainingTopics] = useState<string[]>([]);
    const [familyJoy, setFamilyJoy] = useState('');
    const [familyConcern, setFamilyConcern] = useState('');
    const [howParishCanHelp, setHowParishCanHelp] = useState('');
    const [homeVisitsNeeded, setHomeVisitsNeeded] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // Submissions filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Approved' | 'Pending Review' | 'Returned for Correction'>('all');

    // Handle Member Modal
    const handleOpenAddMember = () => {
        setEditingMember({
            id: `temp-${Date.now()}`,
            fullName: '',
            relationship: 'Head',
            sex: 'Male',
            age: 30,
            civilStatus: 'Single',
            isBaptized: true,
            isFirstCommunion: true,
            isConfirmed: false,
            isChurchMarried: false,
        });
        setIsNewMember(true);
        setIsMemberModalOpen(true);
    };

    const handleEditMember = (member: FamilyMember) => {
        setEditingMember({ ...member });
        setIsNewMember(false);
        setIsMemberModalOpen(true);
    };

    const handleSaveMember = (savedMember: FamilyMember) => {
        if (isNewMember) {
            setMembers(prev => [...prev, savedMember]);
            // If this is head, auto-set headName if empty
            if (savedMember.relationship === 'Head' && !headName) {
                setHeadName(savedMember.fullName);
            }
        } else {
            setMembers(prev => prev.map(m => (m.id === savedMember.id ? savedMember : m)));
        }
        setIsMemberModalOpen(false);
        setEditingMember(null);
    };

    const handleDeleteMember = (id: string) => {
        setMembers(prev => prev.filter(m => m.id !== id));
    };

    const handleToggleNeed = (need: string) => {
        setSelectedPastoralNeeds(prev =>
            prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
        );
    };

    const handleToggleSkill = (skill: string) => {
        setSelectedVolunteerSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleToggleTraining = (topic: string) => {
        setSelectedTrainingTopics(prev =>
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    const handleSubmitSurvey = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!familyName.trim()) {
            setFormError('Please provide the Family Name.');
            setStep(1);
            return;
        }
        if (!headName.trim()) {
            setFormError('Please provide the Head of the Family.');
            setStep(1);
            return;
        }
        if (members.length === 0) {
            setFormError('Please add at least one family member.');
            setStep(2);
            return;
        }
        if (!consentGiven) {
            setFormError('Informed consent must be confirmed before submitting family information.');
            setStep(4);
            return;
        }

        const newHousehold: Partial<Household> = {
            id: `FAM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            familyName: familyName.trim(),
            headName: headName.trim(),
            address: address.trim() || 'Barangay Proper',
            barangay,
            sitioPurok,
            becCluster,
            contactNumber: contactNumber.trim(),
            housingSituation,
            monthlyIncome,
            isVulnerable,
            livelihoodAssistanceNeeded: livelihoodAssistanceNeeded.trim(),
            dateEncoded: new Date().toISOString().split('T')[0],
            status: 'Pending Review',
            encodedBy: 'Ana Ramos (Volunteer)',
            members,
            massFrequency,
            becParticipation,
            pastoralNeeds: selectedPastoralNeeds,
            volunteerSkills: selectedVolunteerSkills,
            trainingNeeds: selectedTrainingTopics,
            familyJoy: familyJoy.trim(),
            familyConcern: familyConcern.trim(),
            howParishCanHelp: howParishCanHelp.trim(),
            pastoralFollowup: {
                homeVisits: homeVisitsNeeded,
                sacramentalFollowup: members.some(m => !m.isBaptized || !m.isConfirmed),
            },
            consentGiven,
        };

        onSubmitHousehold(newHousehold);
        setFormSuccess(`Family Survey for ${familyName} was encoded successfully and sent to Pastor for review.`);

        // Reset Form
        setFamilyName('');
        setHeadName('');
        setAddress('');
        setContactNumber('');
        setMembers([]);
        setSelectedPastoralNeeds([]);
        setSelectedVolunteerSkills([]);
        setSelectedTrainingTopics([]);
        setFamilyJoy('');
        setFamilyConcern('');
        setHowParishCanHelp('');
        setConsentGiven(false);
        setStep(1);

        // Switch to submissions after a short moment
        setTimeout(() => {
            onSubTabChange('submissions');
        }, 1200);
    };

    // Filtered submissions
    const filteredHouseholds = households.filter(h => {
        const matchesQuery =
            h.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Top Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-stone-400">Assigned Area</span>
                    <p className="text-sm sm:text-base font-bold text-stone-900 mt-1">Barangay San Isidro</p>
                    <span className="text-[11px] text-emerald-800 font-semibold">BEC St. Jude & San Pedro</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-stone-400">Approved Families</span>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">
                        {households.filter(h => h.status === 'Approved').length}
                    </p>
                    <span className="text-[11px] text-stone-400">In Canonical Registry</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-stone-400">Pending Review</span>
                    <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                        {households.filter(h => h.status === 'Pending Review').length}
                    </p>
                    <span className="text-[11px] text-stone-400">Awaiting Pastor review</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-stone-400">For Correction</span>
                    <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">
                        {households.filter(h => h.status === 'Returned for Correction').length}
                    </p>
                    <span className="text-[11px] text-rose-600 font-medium">Requires follow-up</span>
                </div>
            </div>

            {/* Sub-tab Navigation (Survey vs Submissions) */}
            <div className="flex border-b border-stone-200 gap-6 text-xs sm:text-sm font-semibold">
                <button
                    onClick={() => onSubTabChange('survey')}
                    className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                        activeSubTab === 'survey'
                            ? 'border-emerald-800 text-emerald-900 font-bold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    New Family Survey
                </button>
                <button
                    onClick={() => onSubTabChange('submissions')}
                    className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                        activeSubTab === 'submissions'
                            ? 'border-emerald-800 text-emerald-900 font-bold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    Submissions & Status ({households.length})
                </button>
            </div>

            {/* TAB 1: 4-STEP NEW FAMILY SURVEY */}
            {activeSubTab === 'survey' && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                    {/* Header */}
                    <div className="p-5 sm:p-6 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                                Field Household Intake
                            </span>
                            <h2 className="text-base sm:text-lg font-bold">Parish Family Pastoral Survey</h2>
                            <p className="text-xs text-stone-300 mt-0.5">
                                Step-by-step interview guide for assigned Purok & BEC clusters.
                            </p>
                        </div>
                        {/* Step indicator */}
                        <div className="flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700 text-xs">
                            <span className="text-stone-400">Step {step} of 4:</span>
                            <span className="font-bold text-emerald-300">
                                {step === 1 && 'Household Identification'}
                                {step === 2 && 'Family Members & Sacraments'}
                                {step === 3 && 'Pastoral Needs & Charisms'}
                                {step === 4 && 'Synodal Listening & Consent'}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-stone-100 h-1.5">
                        <div
                            className="bg-emerald-700 h-1.5 transition-all duration-300"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>

                    {/* Notification Messages */}
                    {formError && (
                        <div className="m-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>{formError}</span>
                        </div>
                    )}
                    {formSuccess && (
                        <div className="m-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{formSuccess}</span>
                        </div>
                    )}

                    {/* Step Form Body */}
                    <form onSubmit={handleSubmitSurvey} className="p-6 sm:p-8 space-y-6">
                        {/* STEP 1: HOUSEHOLD IDENTIFICATION */}
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div className="border-b border-stone-100 pb-3">
                                    <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                                        <Home className="w-4 h-4 text-emerald-800" />
                                        1. Household & Community Location
                                    </h3>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                        Record the primary household address, contact details, and socioeconomic profile.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            Family Name / Surname *
                                        </label>
                                        <input
                                            type="text"
                                            value={familyName}
                                            onChange={e => setFamilyName(e.target.value)}
                                            placeholder="e.g. Santos"
                                            required
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            Head of Family (Full Name) *
                                        </label>
                                        <input
                                            type="text"
                                            value={headName}
                                            onChange={e => setHeadName(e.target.value)}
                                            placeholder="e.g. Roberto Santos"
                                            required
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            House No. / Street Address
                                        </label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            placeholder="e.g. 142 Rizal Street"
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            Contact / Mobile Number
                                        </label>
                                        <input
                                            type="text"
                                            value={contactNumber}
                                            onChange={e => setContactNumber(e.target.value)}
                                            placeholder="e.g. 0917-555-1234"
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">Barangay</label>
                                        <select
                                            value={barangay}
                                            onChange={e => setBarangay(e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        >
                                            {barangayList.map(b => (
                                                <option key={b} value={b}>
                                                    {b}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            Sitio / Purok
                                        </label>
                                        <select
                                            value={sitioPurok}
                                            onChange={e => setSitioPurok(e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        >
                                            {sitioList.map(s => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            BEC (Basic Ecclesial Community) Cluster
                                        </label>
                                        <select
                                            value={becCluster}
                                            onChange={e => setBecCluster(e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium text-emerald-900"
                                        >
                                            {becList.map(bec => (
                                                <option key={bec} value={bec}>
                                                    {bec}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            Housing Situation
                                        </label>
                                        <select
                                            value={housingSituation}
                                            onChange={e => setHousingSituation(e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        >
                                            <option value="Owned (Sariling Bahay at Lupa)">Owned (Sariling Bahay at Lupa)</option>
                                            <option value="House Owned, Land Rented">House Owned, Land Rented</option>
                                            <option value="Renting / Nangungupahan">Renting / Nangungupahan</option>
                                            <option value="Living with Parents / Relatives">Living with Parents / Relatives</option>
                                            <option value="Informal Settler / Nakatira sa Iba">Informal Settler / Nakatira sa Iba</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            Estimated Monthly Household Income
                                        </label>
                                        <select
                                            value={monthlyIncome}
                                            onChange={e => setMonthlyIncome(e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        >
                                            <option value="Below ₱5,000">Below ₱5,000 (Extreme Poverty)</option>
                                            <option value="₱5,001 – ₱10,000">₱5,001 – ₱10,000 (Low Income)</option>
                                            <option value="₱10,001 – ₱15,000">₱10,001 – ₱15,000 (Lower Middle)</option>
                                            <option value="₱15,001 – ₱25,000">₱15,001 – ₱25,000 (Middle)</option>
                                            <option value="Above ₱25,000">Above ₱25,000 (Upper Middle)</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="vulnerableCheck"
                                            checked={isVulnerable}
                                            onChange={e => setIsVulnerable(e.target.checked)}
                                            className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700 cursor-pointer"
                                        />
                                        <label htmlFor="vulnerableCheck" className="font-semibold text-stone-800 cursor-pointer">
                                            Household is in Vulnerable / High-Risk Situation (e.g. bedridden, no stable income)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: FAMILY MEMBERS */}
                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                                    <div>
                                        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-emerald-800" />
                                            2. Family Members & Sacramental Milestones
                                        </h3>
                                        <p className="text-xs text-stone-500 mt-0.5">
                                            Add every person living in the household, their sacraments, and specific care needs.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleOpenAddMember}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Member Profile
                                    </button>
                                </div>

                                {members.length === 0 ? (
                                    <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
                                        <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                                        <h4 className="font-bold text-stone-800 text-xs">No family members added yet</h4>
                                        <p className="text-[11px] text-stone-500 mt-1 max-w-sm mx-auto">
                                            Click the &ldquo;Add Member Profile&rdquo; button above to encode the head, spouse, children, and any relatives.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleOpenAddMember}
                                            className="mt-3 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg cursor-pointer"
                                        >
                                            Add First Member
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                                        {members.map((m, idx) => (
                                            <div
                                                key={m.id || idx}
                                                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-stone-900 text-xs">{m.fullName}</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-700 font-semibold">
                                                            {m.relationship} &bull; {m.age} yrs &bull; {m.sex}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mt-1 text-[11px]">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${m.isBaptized ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-400'}`}>
                                                            {m.isBaptized ? '✓ Baptized' : '✕ No Baptism'}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${m.isFirstCommunion ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-400'}`}>
                                                            {m.isFirstCommunion ? '✓ Communion' : '✕ No Communion'}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${m.isConfirmed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-400'}`}>
                                                            {m.isConfirmed ? '✓ Confirmed' : '✕ No Confirmation'}
                                                        </span>
                                                        {m.isSenior && (
                                                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px]">
                                                                Senior (60+)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditMember(m)}
                                                        className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit Member"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteMember(m.id)}
                                                        className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete Member"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: PASTORAL NEEDS & CHARISMS */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-200 text-xs">
                                <div className="border-b border-stone-100 pb-3">
                                    <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                                        <HeartPulse className="w-4 h-4 text-emerald-800" />
                                        3. Parish Life, Pastoral Needs & Volunteer Talents
                                    </h3>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                        Assess Sunday Mass attendance, BEC gathering participation, and talents the family can share.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            Sunday Mass Attendance Frequency
                                        </label>
                                        <select
                                            value={massFrequency}
                                            onChange={e => setMassFrequency(e.target.value as any)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        >
                                            <option value="Every week">Every week (Regular attendee)</option>
                                            <option value="Almost every week">Almost every week (2-3 times a month)</option>
                                            <option value="Occasionally">Occasionally (Holidays / Special occasions)</option>
                                            <option value="Rarely / Never">Rarely / Never (Need evangelization outreach)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-stone-700 mb-1">
                                            BEC Cluster Participation
                                        </label>
                                        <select
                                            value={becParticipation}
                                            onChange={e => setBecParticipation(e.target.value as any)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        >
                                            <option value="Regular">Regular (Attends BEC bible sharing / meetings)</option>
                                            <option value="Sometimes">Sometimes</option>
                                            <option value="Rarely">Rarely</option>
                                            <option value="Not active">Not active (Needs invitation)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Pastoral Needs Checklist */}
                                <div>
                                    <span className="font-bold text-stone-800 block mb-2">
                                        Pastoral Needs Requested by the Family:
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {pastoralNeedsList.map(need => (
                                            <label
                                                key={need}
                                                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                                                    selectedPastoralNeeds.includes(need)
                                                        ? 'bg-amber-50/70 border-amber-300 text-stone-900 font-semibold'
                                                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPastoralNeeds.includes(need)}
                                                    onChange={() => handleToggleNeed(need)}
                                                    className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700"
                                                />
                                                <span>{need}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Volunteer Skills Checklist */}
                                <div>
                                    <span className="font-bold text-stone-800 block mb-2">
                                        Volunteer Talents / Charisms Offered by Household Members:
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {volunteerSkillsList.map(skill => (
                                            <label
                                                key={skill}
                                                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                                                    selectedVolunteerSkills.includes(skill)
                                                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                                                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVolunteerSkills.includes(skill)}
                                                    onChange={() => handleToggleSkill(skill)}
                                                    className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700"
                                                />
                                                <span>{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* University Training Needs */}
                                <div>
                                    <span className="font-bold text-stone-800 block mb-2">
                                        University & Parish Skills Training Interests:
                                    </span>
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto border border-stone-200 rounded-xl p-3 bg-stone-50">
                                        {UNIVERSITY_TRAINING_TOPICS.map(topic => (
                                            <label
                                                key={topic}
                                                className="flex items-center gap-2 text-stone-700 cursor-pointer hover:text-stone-900"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTrainingTopics.includes(topic)}
                                                    onChange={() => handleToggleTraining(topic)}
                                                    className="w-3.5 h-3.5 text-emerald-800 rounded border-stone-300"
                                                />
                                                <span className="text-[11px]">{topic}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: SYNODAL LISTENING & CONSENT */}
                        {step === 4 && (
                            <div className="space-y-5 animate-in fade-in duration-200 text-xs">
                                <div className="border-b border-stone-100 pb-3">
                                    <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-700" />
                                        4. Synodal Listening & Informed Consent
                                    </h3>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                        Record the heart of the family interview — their blessings, difficulties, and mutual church assistance.
                                    </p>
                                </div>

                                <div>
                                    <label className="block font-semibold text-stone-800 mb-1">
                                        Family Joy & Blessings (Biyaya at Pasasalamat)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={familyJoy}
                                        onChange={e => setFamilyJoy(e.target.value)}
                                        placeholder="e.g. Grateful for stable health, children doing well in school..."
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-stone-800 mb-1">
                                        Family Difficulties & Concerns (Suliranin at Pagsubok)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={familyConcern}
                                        onChange={e => setFamilyConcern(e.target.value)}
                                        placeholder="e.g. High medical costs for elderly grandmother, unstable livelihood..."
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-stone-800 mb-1">
                                        How Can the Parish Best Support this Family? (Paano Makatutulong ang Simbahan?)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={howParishCanHelp}
                                        onChange={e => setHowParishCanHelp(e.target.value)}
                                        placeholder="e.g. Monthly sick call for Holy Communion, livelihood training seminar..."
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                    />
                                </div>

                                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3">
                                    <div className="flex items-start gap-2.5">
                                        <input
                                            type="checkbox"
                                            id="consentCheck"
                                            checked={consentGiven}
                                            onChange={e => setConsentGiven(e.target.checked)}
                                            className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700 mt-0.5 cursor-pointer"
                                        />
                                        <label htmlFor="consentCheck" className="text-xs text-stone-800 font-medium cursor-pointer">
                                            <strong>Informed Consent Acknowledgment:</strong> The family was clearly informed
                                            of the purpose of this parish census and freely gave their consent to record their information
                                            for pastoral care and sacramental registry purposes only.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep((step - 1) as any)}
                                    className="px-4 py-2 border border-stone-300 hover:bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous Step
                                </button>
                            ) : (
                                <div />
                            )}

                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep((step + 1) as any)}
                                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                                >
                                    <span>Next Step</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!consentGiven}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer ${
                                        consentGiven
                                            ? 'bg-emerald-800 hover:bg-emerald-900 text-white'
                                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                    Submit Survey to Pastor
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* TAB 2: ENCODED SUBMISSIONS & STATUS */}
            {activeSubTab === 'submissions' && (
                <div className="space-y-4">
                    {/* Filters & Search */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search family surname, head, or ID..."
                                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                            {(['all', 'Approved', 'Pending Review', 'Returned for Correction'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                                        statusFilter === status
                                            ? 'bg-stone-900 text-white font-bold'
                                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                                >
                                    {status === 'all' ? 'All Submissions' : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submissions List */}
                    <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden divide-y divide-stone-100">
                        {filteredHouseholds.length === 0 ? (
                            <div className="p-12 text-center text-stone-400 text-xs">
                                No household records found matching your search.
                            </div>
                        ) : (
                            filteredHouseholds.map(h => (
                                <div
                                    key={h.id}
                                    onClick={() => onViewHouseholdDetail(h)}
                                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors cursor-pointer"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-stone-900 text-sm">{h.familyName} Family</span>
                                            <span className="text-xs text-stone-400">({h.id})</span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    h.status === 'Approved'
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                        : h.status === 'Returned for Correction'
                                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                }`}
                                            >
                                                {h.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
                                            <span><strong>Head:</strong> {h.headName}</span>
                                            <span><strong>Location:</strong> {h.sitioPurok}, {h.barangay}</span>
                                            <span><strong>BEC:</strong> {h.becCluster}</span>
                                            <span><strong>Members:</strong> {h.members.length}</span>
                                        </div>
                                        {h.correctionNote && (
                                            <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                                                <strong>Pastor&rsquo;s Correction Note:</strong> {h.correctionNote}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] text-stone-400">Encoded {h.dateEncoded}</span>
                                        <ChevronRight className="w-4 h-4 text-stone-400" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Member Survey Modal */}
            {isMemberModalOpen && editingMember && (
                <MemberSurveyModal
                    isOpen={isMemberModalOpen}
                    onClose={() => {
                        setIsMemberModalOpen(false);
                        setEditingMember(null);
                    }}
                    member={editingMember}
                    onSave={handleSaveMember}
                    isNew={isNewMember}
                />
            )}
        </div>
    );
}
