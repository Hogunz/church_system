import React, { useState, useMemo } from 'react';
import {
    Users,
    Printer,
    Phone,
    MapPin,
    X,
    Search,
    Home,
    Book,
    Music2,
    Wrench,
    ClipboardList,
    List,
    UserCheck,
    Building2,
} from 'lucide-react';

export interface FamilyMember {
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
    dateEncoded: string;
    status: 'Pending Review' | 'Approved' | 'Returned for Correction';
    correctionNote?: string;
    encodedBy: string;
    members: FamilyMember[];
    massFrequency: 'Every week' | 'Almost every week' | 'Occasionally' | 'Rarely / Never';
    becParticipation: 'Regular' | 'Sometimes' | 'Rarely' | 'Not active';
    pastoralNeeds: string[];
    volunteerSkills: string[];
    familyJoy: string;
    familyConcern: string;
    howParishCanHelp: string;
    consentGiven: boolean;
}

interface PastorReportsDashboardProps {
    households: Household[];
    onSelectHousehold?: (household: Household) => void;
    onSwitchTab?: (tab: 'review' | 'certificates' | 'records' | 'settings') => void;
}

type RosterType =
    | 'unbaptized'
    | 'first_communion'
    | 'confirmation'
    | 'kasalang_bayan'
    | 'sick_homebound'
    | 'volunteers';

export default function PastorReportsDashboard({
    households,
    onSelectHousehold,
}: PastorReportsDashboardProps) {
    const [selectedBec, setSelectedBec] = useState<string>('All');
    const [selectedPurok, setSelectedPurok] = useState<string>('All');
    const [activeRoster, setActiveRoster] = useState<RosterType | null>(null);
    const [selectedVolunteerSkill, setSelectedVolunteerSkill] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const becList = useMemo(() => {
        const unique = Array.from(new Set(households.map(h => h.becCluster).filter(Boolean)));
        return ['All', ...unique.sort()];
    }, [households]);

    const purokList = useMemo(() => {
        const unique = Array.from(new Set(households.map(h => h.sitioPurok).filter(Boolean)));
        return ['All', ...unique.sort()];
    }, [households]);

    const filteredHouseholds = useMemo(() => {
        return households.filter(h => {
            if (selectedBec !== 'All' && h.becCluster !== selectedBec) return false;
            if (selectedPurok !== 'All' && h.sitioPurok !== selectedPurok) return false;
            return true;
        });
    }, [households, selectedBec, selectedPurok]);

    const allMembers = useMemo(() => {
        return filteredHouseholds.flatMap(h =>
            h.members.map(m => ({
                ...m,
                familyCode: h.id,
                familyName: h.familyName,
                headName: h.headName,
                address: h.address,
                sitioPurok: h.sitioPurok,
                becCluster: h.becCluster,
                contactNumber: h.contactNumber,
            }))
        );
    }, [filteredHouseholds]);

    const totalFamilies = filteredHouseholds.length;
    const totalPersons = allMembers.length;

    const unbaptizedList = useMemo(() => allMembers.filter(m => !m.isBaptized), [allMembers]);
    const firstCommunionList = useMemo(() => allMembers.filter(m => m.age >= 7 && !m.isFirstCommunion), [allMembers]);
    const confirmationList = useMemo(() => allMembers.filter(m => m.age >= 12 && !m.isConfirmed), [allMembers]);

    const kasalangBayanList = useMemo(() => {
        return filteredHouseholds.filter(h => {
            const hasCivilOrCohabiting = h.members.some(m => m.civilStatus === 'Civilly Married' || m.civilStatus === 'Cohabiting');
            const hasUnmarriedSpouse = h.members.some(m => (m.relationship === 'Head' || m.relationship === 'Spouse') && !m.isChurchMarried && m.civilStatus !== 'Single' && m.civilStatus !== 'Widowed');
            const requestedWedding = h.pastoralNeeds.some(n => n.toLowerCase().includes('wedding') || n.toLowerCase().includes('kasal'));
            return hasCivilOrCohabiting || hasUnmarriedSpouse || requestedWedding;
        });
    }, [filteredHouseholds]);

    const sickAndHomeboundList = useMemo(() => {
        return filteredHouseholds.filter(h => {
            const hasHomebound = h.members.some(m => m.isHomebound || (m.specialNeeds && m.specialNeeds.trim().length > 0));
            const requestedVisit = h.pastoralNeeds.some(n => n.toLowerCase().includes('communion') || n.toLowerCase().includes('elderly') || n.toLowerCase().includes('sick'));
            return hasHomebound || requestedVisit;
        });
    }, [filteredHouseholds]);

    const massAttendance = useMemo(() => ({
        weekly: filteredHouseholds.filter(h => h.massFrequency === 'Every week' || h.massFrequency === 'Almost every week').length,
        occasional: filteredHouseholds.filter(h => h.massFrequency === 'Occasionally').length,
        rarely: filteredHouseholds.filter(h => h.massFrequency === 'Rarely / Never').length,
    }), [filteredHouseholds]);

    const volunteerCategories = useMemo(() => ([
        { key: 'Choir & Music',            title: 'Choir & Music Ministry',  icon: Music2    },
        { key: 'Teaching / Catechesis',    title: 'Catechists & Teachers',   icon: Book      },
        { key: 'Medical / First Aid',      title: 'Medical / First Aid',     icon: UserCheck },
        { key: 'Carpentry & Maintenance',  title: 'Repairs & Maintenance',   icon: Wrench    },
        { key: 'BEC Leader / Coordinator', title: 'BEC Leaders',             icon: Users     },
    ].map(item => {
        const matches = filteredHouseholds.filter(h =>
            h.volunteerSkills.some(s => s.toLowerCase().includes(item.key.toLowerCase().split(' ')[0]))
        );
        return { ...item, count: matches.length, families: matches };
    })), [filteredHouseholds]);

    const modalResults = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!activeRoster) return [];
        if (activeRoster === 'unbaptized')      return unbaptizedList.filter(m => !q || m.fullName.toLowerCase().includes(q) || m.familyName.toLowerCase().includes(q));
        if (activeRoster === 'first_communion') return firstCommunionList.filter(m => !q || m.fullName.toLowerCase().includes(q) || m.familyName.toLowerCase().includes(q));
        if (activeRoster === 'confirmation')    return confirmationList.filter(m => !q || m.fullName.toLowerCase().includes(q) || m.familyName.toLowerCase().includes(q));
        if (activeRoster === 'kasalang_bayan')  return kasalangBayanList.filter(h => !q || h.familyName.toLowerCase().includes(q) || h.headName.toLowerCase().includes(q));
        if (activeRoster === 'sick_homebound')  return sickAndHomeboundList.filter(h => !q || h.familyName.toLowerCase().includes(q) || h.headName.toLowerCase().includes(q));
        if (activeRoster === 'volunteers' && selectedVolunteerSkill) {
            const cat = volunteerCategories.find(c => c.key === selectedVolunteerSkill);
            return cat ? cat.families.filter(h => !q || h.familyName.toLowerCase().includes(q) || h.headName.toLowerCase().includes(q)) : [];
        }
        return [];
    }, [activeRoster, searchTerm, unbaptizedList, firstCommunionList, confirmationList, kasalangBayanList, sickAndHomeboundList, volunteerCategories, selectedVolunteerSkill]);

    const rosterTitle = () => {
        if (activeRoster === 'unbaptized')      return 'Children for Baptism';
        if (activeRoster === 'first_communion') return 'First Holy Communion';
        if (activeRoster === 'confirmation')    return 'Confirmation Candidates';
        if (activeRoster === 'kasalang_bayan')  return 'Kasalang Bayan — Couples';
        if (activeRoster === 'sick_homebound')  return 'Sick Calls & Home Communion';
        if (activeRoster === 'volunteers')      return `Volunteers — ${selectedVolunteerSkill}`;
        return '';
    };

    const isFilterActive = selectedBec !== 'All' || selectedPurok !== 'All';

    // ─── VIEW ──────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5">

            {/* ── HEADER: 30% deep green ─────────────────────────────────── */}
            <div className="bg-green-900 text-white rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold text-green-400 uppercase tracking-widest mb-0.5">Parish Summary</p>
                    <h2 className="text-lg font-bold leading-tight">Reports &amp; Lists</h2>
                    <p className="text-xs text-green-300 mt-0.5">Based on encoded household survey forms.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <select
                        value={selectedBec}
                        onChange={e => setSelectedBec(e.target.value)}
                        className="bg-green-800 border border-green-700 text-green-100 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                    >
                        {becList.map(b => <option key={b} value={b}>{b === 'All' ? 'All BECs' : b}</option>)}
                    </select>

                    <select
                        value={selectedPurok}
                        onChange={e => setSelectedPurok(e.target.value)}
                        className="bg-green-800 border border-green-700 text-green-100 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                    >
                        {purokList.map(p => <option key={p} value={p}>{p === 'All' ? 'All Puroks' : p}</option>)}
                    </select>

                    {isFilterActive && (
                        <button onClick={() => { setSelectedBec('All'); setSelectedPurok('All'); }} className="text-green-400 hover:text-white underline text-xs">
                            Clear
                        </button>
                    )}

                    {/* 10% amber accent — print CTA */}
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors ml-1"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print Page
                    </button>
                </div>
            </div>

            {/* ── FOUR SUMMARY NUMBERS: 60% white, green left border ─────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: 'Total Families',      value: totalFamilies,                                                                      sub: `${totalPersons} persons recorded`,            urgent: false },
                    { label: 'Sick / Home Visits',  value: sickAndHomeboundList.length,                                                        sub: 'Need home communion or visit',                urgent: true  },
                    { label: 'Need Sacraments',     value: unbaptizedList.length + firstCommunionList.length + confirmationList.length,         sub: 'Baptism, Communion, or Confirmation',          urgent: false },
                    { label: 'Kasalang Bayan',      value: kasalangBayanList.length,                                                           sub: 'Couples for Church wedding',                  urgent: false },
                ].map((item, i) => (
                    <div key={i} className={`bg-white rounded-xl border border-stone-200 p-4 border-l-4 ${item.urgent ? 'border-l-amber-700' : 'border-l-green-900'}`}>
                        <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">{item.label}</p>
                        <p className={`text-3xl font-bold mt-1 ${item.urgent ? 'text-amber-700' : 'text-green-900'}`}>{item.value}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── SICK CALLS & HOME VISITS ───────────────────────────────── */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-green-900 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-green-900 text-sm">Sick Calls &amp; Home Communion</h3>
                            <p className="text-[11px] text-stone-400">Parishioners who need a home visit or cannot go to church.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setActiveRoster('sick_homebound'); setSearchTerm(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print List
                    </button>
                </div>

                <div className="divide-y divide-stone-100">
                    {sickAndHomeboundList.length === 0 ? (
                        <p className="py-8 text-center text-xs text-stone-400">No sick or homebound entries in the selected area.</p>
                    ) : sickAndHomeboundList.map(h => {
                        const sickPersons = h.members.filter(m => m.isHomebound || (m.specialNeeds && m.specialNeeds.trim()));
                        return (
                            <div key={h.id} className="px-5 py-4 flex flex-col md:flex-row md:items-start justify-between gap-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                                        <span className="font-semibold text-green-900 text-sm">{h.familyName} Family</span>
                                        <span className="text-stone-400 text-xs">({h.headName})</span>
                                        <span className="text-[11px] bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded font-medium">{h.becCluster}</span>
                                    </div>
                                    <p className="text-xs text-stone-500 flex flex-wrap gap-x-3 gap-y-1">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{h.address}, {h.sitioPurok}</span>
                                        {h.contactNumber && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{h.contactNumber}</span>}
                                    </p>
                                    {sickPersons.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {sickPersons.map(m => (
                                                <span key={m.id} className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                                                    {m.fullName}, {m.age} yrs{m.specialNeeds ? ` — ${m.specialNeeds}` : ''}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {h.pastoralNeeds.filter(n => n.toLowerCase().includes('communion') || n.toLowerCase().includes('sick') || n.toLowerCase().includes('visit')).length > 0 && (
                                        <p className="text-[11px] text-stone-400 italic">
                                            Request: {h.pastoralNeeds.filter(n => n.toLowerCase().includes('communion') || n.toLowerCase().includes('sick') || n.toLowerCase().includes('visit')).join(', ')}
                                        </p>
                                    )}
                                </div>
                                {onSelectHousehold && (
                                    <button
                                        onClick={() => onSelectHousehold(h)}
                                        className="shrink-0 text-xs text-green-800 border border-green-300 hover:bg-green-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
                                    >
                                        View Full Record
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── SACRAMENTS NEEDED ─────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-green-900 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-green-900 text-sm">Sacraments Needed</h3>
                        <p className="text-[11px] text-stone-400">People who have not yet received these sacraments, based on the survey.</p>
                    </div>
                </div>
                <div className="divide-y divide-stone-100">
                    {[
                        { type: 'unbaptized'      as RosterType, label: 'Baptism',                        note: 'Children or adults not yet baptized',             count: unbaptizedList.length      },
                        { type: 'first_communion' as RosterType, label: 'First Holy Communion',            note: 'Age 7 and above, not yet received',               count: firstCommunionList.length  },
                        { type: 'confirmation'    as RosterType, label: 'Confirmation',                    note: 'Age 12 and above, not yet confirmed',             count: confirmationList.length    },
                        { type: 'kasalang_bayan'  as RosterType, label: 'Kasalang Bayan (Church Wedding)', note: 'Couples living together or civilly married',       count: kasalangBayanList.length   },
                    ].map(row => (
                        <div key={row.type} className="px-5 py-3.5 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-green-900">{row.label}</p>
                                <p className="text-[11px] text-stone-400">{row.note}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-2xl font-bold text-green-900 min-w-[2rem] text-right">{row.count}</span>
                                <button
                                    onClick={() => { setActiveRoster(row.type); setSearchTerm(''); }}
                                    disabled={row.count === 0}
                                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${row.count > 0
                                        ? 'border-green-800 text-green-800 hover:bg-green-50'
                                        : 'border-stone-200 text-stone-300 cursor-not-allowed'}`}
                                >
                                    <List className="w-3.5 h-3.5" /> View List
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MASS ATTENDANCE ───────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-900 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-green-900 text-sm">Sunday Mass Attendance</h3>
                        <p className="text-[11px] text-stone-400">Self-reported by families during the household survey.</p>
                    </div>
                </div>
                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { label: 'Every week / Almost every week', value: massAttendance.weekly,    note: 'Regular churchgoers'          },
                        { label: 'Occasionally',                   value: massAttendance.occasional, note: 'Once or twice a month'        },
                        { label: 'Rarely or never',                value: massAttendance.rarely,    note: 'May need pastoral outreach'   },
                    ].map(row => (
                        <div key={row.label} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                            <span className="text-2xl font-bold text-green-900 min-w-[2.5rem]">{row.value}</span>
                            <div>
                                <p className="text-xs font-semibold text-stone-800">{row.label}</p>
                                <p className="text-[11px] text-stone-400">{row.note}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── PARISH VOLUNTEERS ─────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-900 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-green-900 text-sm">Parish Volunteers</h3>
                        <p className="text-[11px] text-stone-400">Parishioners who offered to help when asked in the survey.</p>
                    </div>
                </div>
                <div className="divide-y divide-stone-100">
                    {volunteerCategories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <div key={cat.key} className="px-5 py-3.5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-stone-400 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-green-900">{cat.title}</p>
                                        <p className="text-[11px] text-stone-400">{cat.count} {cat.count === 1 ? 'family' : 'families'} willing to help</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setActiveRoster('volunteers'); setSelectedVolunteerSkill(cat.key); setSearchTerm(''); }}
                                    disabled={cat.count === 0}
                                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${cat.count > 0
                                        ? 'border-green-800 text-green-800 hover:bg-green-50'
                                        : 'border-stone-200 text-stone-300 cursor-not-allowed'}`}
                                >
                                    <List className="w-3.5 h-3.5" /> See Names
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ══ ROSTER MODAL ═══════════════════════════════════════════════ */}
            {activeRoster && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">

                        {/* Modal header — 30% green band */}
                        <div className="px-5 py-4 bg-green-900 text-white flex items-center justify-between gap-3 shrink-0">
                            <div>
                                <h3 className="font-bold text-base">{rosterTitle()}</h3>
                                <p className="text-xs text-green-300 mt-0.5">{modalResults.length} record{modalResults.length !== 1 ? 's' : ''} found</p>
                            </div>
                            <button onClick={() => setActiveRoster(null)} className="p-1.5 rounded-lg hover:bg-green-800 text-green-200 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search & Print */}
                        <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-3 bg-stone-50 shrink-0">
                            <div className="relative flex-1">
                                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search by name..."
                                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-green-700"
                                />
                            </div>
                            {/* 10% amber accent */}
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                            >
                                <Printer className="w-3.5 h-3.5" /> Print This List
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto flex-1 p-4">
                            {modalResults.length === 0 ? (
                                <p className="py-10 text-center text-xs text-stone-400">No records found.</p>
                            ) : (
                                <>
                                    {/* Individual list: Baptism, Communion, Confirmation */}
                                    {(activeRoster === 'unbaptized' || activeRoster === 'first_communion' || activeRoster === 'confirmation') && (
                                        <table className="w-full text-xs text-left border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-green-900 text-green-900">
                                                    <th className="pb-2 font-semibold">#</th>
                                                    <th className="pb-2 font-semibold">Name</th>
                                                    <th className="pb-2 font-semibold">Age</th>
                                                    <th className="pb-2 font-semibold">Family</th>
                                                    <th className="pb-2 font-semibold">Address</th>
                                                    <th className="pb-2 font-semibold">Contact</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-100">
                                                {(modalResults as any[]).map((m, idx) => (
                                                    <tr key={idx} className="hover:bg-stone-50">
                                                        <td className="py-2.5 text-stone-400">{idx + 1}</td>
                                                        <td className="py-2.5 font-semibold text-green-900">{m.fullName}</td>
                                                        <td className="py-2.5 text-stone-600">{m.age}</td>
                                                        <td className="py-2.5 text-stone-600">{m.familyName}</td>
                                                        <td className="py-2.5 text-stone-500">{m.address}, {m.sitioPurok}</td>
                                                        <td className="py-2.5 text-stone-500">{m.contactNumber || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* Household list: sick, kasalang bayan, volunteers */}
                                    {(activeRoster === 'kasalang_bayan' || activeRoster === 'sick_homebound' || activeRoster === 'volunteers') && (
                                        <div className="space-y-2">
                                            {(modalResults as Household[]).map((h, idx) => (
                                                <div key={h.id} className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <span className="font-bold text-green-900">{idx + 1}. {h.familyName} Family ({h.headName})</span>
                                                        <span className="text-green-800 font-medium">{h.becCluster}</span>
                                                    </div>
                                                    <p className="text-stone-500 mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{h.address}, {h.sitioPurok}</span>
                                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{h.contactNumber || 'No phone listed'}</span>
                                                    </p>
                                                    {activeRoster === 'sick_homebound' && (
                                                        <div className="mt-2 pt-2 border-t border-stone-200">
                                                            {h.members.filter(m => m.isHomebound || m.specialNeeds).map(m => (
                                                                <p key={m.id} className="text-stone-700 ml-1">• <strong>{m.fullName}</strong>, {m.age} yrs {m.specialNeeds ? `— ${m.specialNeeds}` : ''}</p>
                                                            ))}
                                                            {h.pastoralNeeds.filter(n => n.toLowerCase().includes('communion') || n.toLowerCase().includes('sick') || n.toLowerCase().includes('visit')).map(n => (
                                                                <p key={n} className="text-stone-400 ml-1 italic">Request: {n}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {activeRoster === 'kasalang_bayan' && (
                                                        <div className="mt-2 pt-2 border-t border-stone-200">
                                                            {h.members.filter(m => m.civilStatus === 'Civilly Married' || m.civilStatus === 'Cohabiting' || (!m.isChurchMarried && (m.relationship === 'Head' || m.relationship === 'Spouse'))).map(m => (
                                                                <p key={m.id} className="text-stone-700 ml-1">• {m.fullName} ({m.relationship}, {m.civilStatus})</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-stone-100 bg-stone-50 flex justify-end shrink-0">
                            <button
                                onClick={() => setActiveRoster(null)}
                                className="px-4 py-1.5 text-xs font-semibold border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
