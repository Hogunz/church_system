import React from 'react';
import {
    BarChart3,
    Church,
    HeartPulse,
    Sparkles,
    Users,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Baby,
    Award,
    Home,
} from 'lucide-react';
import type { Household } from '@/types/parish';

interface CouncilPortalProps {
    households: Household[];
    activeSubTab: string;
    onSubTabChange: (tab: string) => void;
}

export default function CouncilPortal({
    households,
    activeSubTab,
    onSubTabChange,
}: CouncilPortalProps) {
    const totalParishioners = households.reduce((sum, h) => sum + h.members.length, 0);
    const approvedHouseholds = households.filter(h => h.status === 'Approved');

    // Sacramental Backlog
    const allMembers = households.flatMap(h => h.members);
    const unbaptized = allMembers.filter(m => !m.isBaptized);
    const communionBacklog = allMembers.filter(m => m.age >= 7 && !m.isFirstCommunion);
    const confirmationBacklog = allMembers.filter(m => m.age >= 12 && !m.isConfirmed);
    const civillyMarriedOrCohabiting = allMembers.filter(
        m => m.civilStatus === 'Civilly Married' || m.civilStatus === 'Cohabiting'
    );

    // Vulnerable & Care
    const seniors = allMembers.filter(m => m.age >= 60 || m.isSenior);
    const homebound = allMembers.filter(m => m.isHomebound);
    const vulnerableHouseholds = households.filter(h => h.isVulnerable);

    // BEC Clusters breakdown
    const becCounts = households.reduce<Record<string, { families: number; persons: number }>>((acc, h) => {
        const cluster = h.becCluster || 'Unassigned';
        if (!acc[cluster]) acc[cluster] = { families: 0, persons: 0 };
        acc[cluster].families += 1;
        acc[cluster].persons += h.members.length;
        return acc;
    }, {});

    // Charisms breakdown
    const charismCounts = households.reduce<Record<string, number>>((acc, h) => {
        (h.volunteerSkills || []).forEach(s => {
            acc[s] = (acc[s] || 0) + 1;
        });
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Top Pastoral Council Planning Card */}
            <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                        Parish Pastoral Council (PPC)
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold mt-0.5">Pastoral Intelligence & Stewardship Planning</h2>
                    <p className="text-xs text-stone-300 mt-1 max-w-xl">
                        Aggregated community indicators synthesize field survey data to guide the Three Parish Commissions
                        (Worship, Evangelization, Social Services) without exposing confidential family notes.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-stone-800 rounded-xl border border-stone-700">
                        <span className="text-[10px] text-stone-400 block">Total Census</span>
                        <span className="text-base font-bold text-teal-300">{totalParishioners} persons</span>
                    </div>
                    <div className="p-2.5 bg-stone-800 rounded-xl border border-stone-700">
                        <span className="text-[10px] text-stone-400 block">Total Households</span>
                        <span className="text-base font-bold text-teal-300">{households.length} families</span>
                    </div>
                    <div className="p-2.5 bg-stone-800 rounded-xl border border-stone-700 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-stone-400 block">Active BECs</span>
                        <span className="text-base font-bold text-emerald-300">{Object.keys(becCounts).length} clusters</span>
                    </div>
                </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex border-b border-stone-200 gap-4 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-px">
                {[
                    { id: 'overview', label: 'Pastoral Overview', icon: BarChart3 },
                    { id: 'sacraments', label: 'Commission on Worship (Sacraments)', icon: Church },
                    { id: 'vulnerable', label: 'Commission on Social Services (Care)', icon: HeartPulse },
                    { id: 'stewardship', label: 'Commission on Evangelization (Charisms)', icon: Sparkles },
                    { id: 'bec', label: 'Grassroots BEC Distribution', icon: Users },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => onSubTabChange(item.id)}
                        className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                            activeSubTab === item.id
                                ? 'border-emerald-800 text-emerald-900 font-bold'
                                : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeSubTab === 'overview' && (
                <div className="space-y-6">
                    {/* The 3 Commissions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Worship */}
                        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm border-b border-stone-100 pb-2">
                                <Church className="w-4 h-4 text-emerald-800" />
                                <span>1. Worship Commission</span>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Baptism Backlog:</span>
                                    <span className="font-bold text-amber-700">{unbaptized.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">First Communion Candidates:</span>
                                    <span className="font-bold text-amber-700">{communionBacklog.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Confirmation Backlog:</span>
                                    <span className="font-bold text-amber-700">{confirmationBacklog.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Marriage Validation (Kasalang Bayan):</span>
                                    <span className="font-bold text-emerald-800">{civillyMarriedOrCohabiting.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Services */}
                        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-rose-950 font-bold text-sm border-b border-stone-100 pb-2">
                                <HeartPulse className="w-4 h-4 text-rose-700" />
                                <span>2. Social Services Commission</span>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Vulnerable Families:</span>
                                    <span className="font-bold text-rose-700">{vulnerableHouseholds.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Homebound Parishioners:</span>
                                    <span className="font-bold text-rose-700">{homebound.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Seniors (60+ yrs):</span>
                                    <span className="font-bold text-blue-800">{seniors.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Evangelization & Stewardship */}
                        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-teal-950 font-bold text-sm border-b border-stone-100 pb-2">
                                <Sparkles className="w-4 h-4 text-teal-700" />
                                <span>3. Evangelization Commission</span>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Active BEC Clusters:</span>
                                    <span className="font-bold text-teal-800">{Object.keys(becCounts).length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Volunteer Talents Offered:</span>
                                    <span className="font-bold text-teal-800">
                                        {Object.values(charismCounts).reduce((a, b) => a + b, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SACRAMENTS */}
            {activeSubTab === 'sacraments' && (
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4 text-xs">
                    <h3 className="font-bold text-sm text-stone-900">
                        Commission on Worship &bull; Sacramental Backlog Priority Roster
                    </h3>
                    <p className="text-stone-500">
                        Parishioners needing sacramental catechesis, infant baptism scheduling, or marriage regularization.
                    </p>

                    <div className="divide-y divide-stone-100">
                        {unbaptized.map(m => (
                            <div key={m.id} className="py-2.5 flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-stone-900">{m.fullName}</span>
                                    <span className="text-stone-400 ml-2">({m.age} yrs old &bull; {m.relationship})</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px]">
                                    Unbaptized &bull; Needs Baptism Prep
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: VULNERABLE */}
            {activeSubTab === 'vulnerable' && (
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4 text-xs">
                    <h3 className="font-bold text-sm text-stone-900">
                        Commission on Social Services &bull; Sick & Homebound Visitation Sheet
                    </h3>
                    <p className="text-stone-500">
                        Roster of bedridden parishioners for monthly First Friday sick calls and emergency food parcels.
                    </p>

                    <div className="divide-y divide-stone-100">
                        {seniors.map(m => (
                            <div key={m.id} className="py-2.5 flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-stone-900">{m.fullName}</span>
                                    <span className="text-stone-400 ml-2">({m.age} yrs old)</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px]">
                                    Senior Citizen &bull; Pastoral Care
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: STEWARDSHIP */}
            {activeSubTab === 'stewardship' && (
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4 text-xs">
                    <h3 className="font-bold text-sm text-stone-900">
                        Commission on Evangelization &bull; Stewardship Charisms Directory
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(charismCounts).map(([skill, count]) => (
                            <div key={skill} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                                <span className="font-semibold text-stone-800">{skill}</span>
                                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 5: BEC */}
            {activeSubTab === 'bec' && (
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4 text-xs">
                    <h3 className="font-bold text-sm text-stone-900">
                        Grassroots BEC (Basic Ecclesial Communities) Household Census
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(becCounts).map(([cluster, stats]) => (
                            <div key={cluster} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                                <h4 className="font-bold text-stone-900 text-sm">{cluster}</h4>
                                <div className="text-stone-500">
                                    <span><strong>{stats.families}</strong> families &bull; </span>
                                    <span><strong>{stats.persons}</strong> parishioners</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
