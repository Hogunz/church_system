import React, { useState, useEffect } from 'react';
import {
    X,
    User,
    Sparkles,
    HeartPulse,
    Church,
    Check,
    Calendar,
    Briefcase,
    GraduationCap,
    Clock,
    ShieldAlert,
    AlertCircle,
    Info,
    ChevronRight,
    ChevronDown,
} from 'lucide-react';
import type { FamilyMember } from '@/pages/prototype';

interface MemberSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: FamilyMember;
    onSave: (savedMember: FamilyMember) => void;
    isNew: boolean;
}

export default function MemberSurveyModal({
    isOpen,
    onClose,
    member,
    onSave,
    isNew,
}: MemberSurveyModalProps) {
    const [tab, setTab] = useState<'identity' | 'sacraments' | 'care' | 'ministry'>('identity');
    const [draft, setDraft] = useState<FamilyMember>({ ...member });

    useEffect(() => {
        if (isOpen) {
            setDraft({ ...member });
            setTab('identity');
        }
    }, [isOpen, member]);

    if (!isOpen) return null;

    const handleBirthdateChange = (dateStr: string) => {
        setDraft(prev => {
            let computedAge = prev.age;
            if (dateStr) {
                const birth = new Date(dateStr);
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
                if (!isNaN(age) && age >= 0) {
                    computedAge = age;
                }
            }
            return {
                ...prev,
                birthdate: dateStr,
                age: computedAge,
                isSenior: computedAge >= 60,
            };
        });
    };

    const handleAgeChange = (newAge: number) => {
        setDraft(prev => ({
            ...prev,
            age: newAge,
            isSenior: newAge >= 60,
        }));
    };

    const toggleMinistry = (ministry: string) => {
        setDraft(prev => {
            const list = prev.parishMinistries || [];
            return {
                ...prev,
                parishMinistries: list.includes(ministry)
                    ? list.filter(m => m !== ministry)
                    : [...list, ministry],
            };
        });
    };

    const toggleSkill = (skill: string) => {
        setDraft(prev => {
            const list = prev.skillsTalents || [];
            return {
                ...prev,
                skillsTalents: list.includes(skill)
                    ? list.filter(s => s !== skill)
                    : [...list, skill],
            };
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!draft.fullName.trim()) {
            alert('Please enter member full name.');
            return;
        }
        onSave(draft);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* MODAL HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-base">
                            {isNew ? 'Add Family Member' : 'Edit Member Profile'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                            Demographics, Sacraments, Health, &amp; Talents
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* MODAL TABS */}
                <div className="flex border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 px-4 text-xs font-medium">
                    <button
                        type="button"
                        onClick={() => setTab('identity')}
                        className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                            tab === 'identity'
                                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 font-semibold bg-white dark:bg-zinc-800/50'
                                : 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                        }`}
                    >
                        <User className="w-3.5 h-3.5" />
                        1. Identity & Work
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('sacraments')}
                        className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                            tab === 'sacraments'
                                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 font-semibold bg-white dark:bg-zinc-800/50'
                                : 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                        }`}
                    >
                        <Church className="w-3.5 h-3.5" />
                        2. Sacraments & Marriage
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('care')}
                        className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                            tab === 'care'
                                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 font-semibold bg-white dark:bg-zinc-800/50'
                                : 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                        }`}
                    >
                        <HeartPulse className="w-3.5 h-3.5" />
                        3. Special Care & Youth
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('ministry')}
                        className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                            tab === 'ministry'
                                ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 font-semibold bg-white dark:bg-zinc-800/50'
                                : 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        4. Faith & Charisms
                    </button>
                </div>

                {/* MODAL BODY */}
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* TAB 1: IDENTITY & SOCIO-ECONOMIC */}
                    {tab === 'identity' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={draft.fullName}
                                        onChange={e => setDraft({ ...draft, fullName: e.target.value })}
                                        placeholder="First Name, Middle Name / Initial, Last Name"
                                        className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-emerald-600 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Relationship to Head
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={draft.relationship}
                                            onChange={e => setDraft({ ...draft, relationship: e.target.value as any })}
                                            className="w-full appearance-none text-xs px-3 pr-8 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-emerald-600"
                                        >
                                            <option value="Head">Head of Family</option>
                                            <option value="Spouse">Spouse (Asawa)</option>
                                            <option value="Son">Son (Anak na Lalaki)</option>
                                            <option value="Daughter">Daughter (Anak na Babae)</option>
                                            <option value="Parent">Parent / Grandparent (Magulang / Lolo / Lola)</option>
                                            <option value="Relative">Relative (Kamag-anak)</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Sex
                                    </label>
                                    <div className="flex gap-2">
                                        {(['Male', 'Female'] as const).map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setDraft({ ...draft, sex: s })}
                                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border ${
                                                    draft.sex === s
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500'
                                                        : 'bg-white dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-slate-600'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Birthdate
                                    </label>
                                    <input
                                        type="date"
                                        value={draft.birthdate || ''}
                                        onChange={e => handleBirthdateChange(e.target.value)}
                                        className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={120}
                                        value={draft.age}
                                        onChange={e => handleAgeChange(parseInt(e.target.value) || 0)}
                                        className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Civil Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={draft.civilStatus}
                                            onChange={e => setDraft({ ...draft, civilStatus: e.target.value as any })}
                                            className="w-full appearance-none text-xs px-3 pr-8 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-emerald-600"
                                        >
                                            <option value="Single">Single</option>
                                            <option value="Married (Church)">Married (Church)</option>
                                            <option value="Civilly Married">Civilly Married</option>
                                            <option value="Cohabiting">Cohabiting (Live-in)</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Separated">Separated</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Highest Educational Attainment
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={draft.education || ''}
                                            onChange={e => setDraft({ ...draft, education: e.target.value })}
                                            className="w-full appearance-none text-xs px-3 pr-8 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-emerald-600"
                                        >
                                            <option value="">-- Select Education --</option>
                                            <option value="No Formal Education">No Formal Education</option>
                                            <option value="Elementary Level / Graduate">Elementary Level / Graduate</option>
                                            <option value="High School Level / Graduate">High School Level / Graduate</option>
                                            <option value="Vocational / Technical">Vocational / Technical</option>
                                            <option value="College Level / Graduate">College Level / Graduate</option>
                                            <option value="Postgraduate">Postgraduate</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Occupation / Profession
                                    </label>
                                    <input
                                        type="text"
                                        value={draft.occupation || ''}
                                        onChange={e => setDraft({ ...draft, occupation: e.target.value })}
                                        placeholder="e.g. Carpenter, Teacher, Farmer, Vendor, Student"
                                        className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Employment Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={draft.employmentType || ''}
                                            onChange={e => setDraft({ ...draft, employmentType: e.target.value })}
                                            className="w-full appearance-none text-xs px-3 pr-8 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-emerald-600"
                                        >
                                            <option value="">-- Select Status --</option>
                                            <option value="Permanent (P)">Permanent Employee (P)</option>
                                            <option value="Temporary / Contractual (T)">Temporary / Contractual / Substitute (T)</option>
                                            <option value="Self-employed / Business Owner">Self-employed / Business Owner</option>
                                            <option value="Farmer / Laborer / Vendor">Farmer / Laborer / Vendor</option>
                                            <option value="Student / Out-of-School Youth">Student / Youth</option>
                                            <option value="Unemployed">Unemployed</option>
                                            <option value="Retired">Retired / Senior</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                        Years in Service / Experience
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={draft.yearsInService || ''}
                                            onChange={e => setDraft({ ...draft, yearsInService: e.target.value })}
                                            className="w-full appearance-none text-xs px-3 pr-8 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-emerald-600"
                                        >
                                            <option value="">-- Not Applicable --</option>
                                            <option value="Less than 1 year">Less than 1 year</option>
                                            <option value="1–5 years">1–5 years</option>
                                            <option value="6–10 years">6–10 years</option>
                                            <option value="More than 10 years">More than 10 years</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: SACRAMENTS & MARITAL PROFILE */}
                    {tab === 'sacraments' && (
                        <div className="space-y-4">
                            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300">
                                <strong>Sacramental Profile</strong> — Check all sacraments this member has already received.
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.isBaptized}
                                        onChange={e => setDraft({ ...draft, isBaptized: e.target.checked })}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="text-xs">
                                        <div className="font-semibold text-slate-800 dark:text-zinc-200">Baptism (Binyag)</div>
                                        <div className="text-[10px] text-slate-500">Initiation sacrament</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.isFirstCommunion}
                                        onChange={e => setDraft({ ...draft, isFirstCommunion: e.target.checked })}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="text-xs">
                                        <div className="font-semibold text-slate-800 dark:text-zinc-200">First Holy Communion</div>
                                        <div className="text-[10px] text-slate-500">Eucharist received</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.isConfirmed}
                                        onChange={e => setDraft({ ...draft, isConfirmed: e.target.checked })}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="text-xs">
                                        <div className="font-semibold text-slate-800 dark:text-zinc-200">Confirmation (Kumpil)</div>
                                        <div className="text-[10px] text-slate-500">Holy Spirit sacrament</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.isChurchMarried}
                                        onChange={e => setDraft({ ...draft, isChurchMarried: e.target.checked })}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="text-xs">
                                        <div className="font-semibold text-slate-800 dark:text-zinc-200">Church Matrimony (Kasal sa Simbahan)</div>
                                        <div className="text-[10px] text-slate-500">Sacramental marriage</div>
                                    </div>
                                </label>
                            </div>

                            {/* BACKLOG ALERT */}
                            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30 cursor-pointer text-xs">
                                <input
                                    type="checkbox"
                                    checked={draft.needsSacramentPrep ?? false}
                                    onChange={e => setDraft({ ...draft, needsSacramentPrep: e.target.checked })}
                                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                                />
                                <div>
                                    <span className="font-bold text-amber-900 dark:text-amber-200">
                                        Flag: Person / Child Needing Sacramental Preparation
                                    </span>
                                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                                        Mark if this person is unbaptized, is 7+ and needs First Communion, 12+ needing Confirmation, or is a candidate for marriage regularization (Kasalang Bayan).
                                    </p>
                                </div>
                            </label>

                            {/* AREA 4: MARRIAGE & FAMILY SITUATION */}
                            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-3">
                                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                                    Marital Situation &amp; Accompaniment
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                            Marital Situation Category
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={draft.maritalSituation || ''}
                                                onChange={e => setDraft({ ...draft, maritalSituation: e.target.value })}
                                                className="w-full appearance-none text-xs px-3 pr-8 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-emerald-600"
                                            >
                                                <option value="">-- Select Situation --</option>
                                                <option value="Sacramental (Church)">Sacramental (Church Married)</option>
                                                <option value="Civil">Civil Marriage</option>
                                                <option value="Single Parent">Single Parent</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Irregular Situation">Irregular Marital Situation (Needing Pastoral Accompaniment)</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                                            Date Married & Parish Where Received
                                        </label>
                                        <input
                                            type="text"
                                            value={draft.marriageDateParish || ''}
                                            onChange={e => setDraft({ ...draft, marriageDateParish: e.target.value })}
                                            placeholder="e.g. 2012-05-18 / San Isidro Parish"
                                            className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SPECIAL CARE & YOUTH ACCOMPANIMENT */}
                    {tab === 'care' && (
                        <div className="space-y-4">
                            <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-300">
                                <strong>Elderly, Homebound, PWD, & Youth Care</strong> — Prioritize members who cannot come to church or require special parish accompaniment.
                            </div>

                            <div className="space-y-2.5">
                                {/* Senior Citizen */}
                                <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.isSenior ?? (draft.age >= 60)}
                                        onChange={e => setDraft({ ...draft, isSenior: e.target.checked })}
                                        className="rounded text-rose-600 focus:ring-rose-500"
                                    />
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Senior Citizen (Age 60+)
                                        </div>
                                        <div className="text-[11px] text-slate-500">Eligible for senior apostolate & wellness visits</div>
                                    </div>
                                </label>

                                {/* Homebound */}
                                <label className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.isHomebound ?? false}
                                        onChange={e => setDraft({ ...draft, isHomebound: e.target.checked })}
                                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                                    />
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Homebound Person (Bedridden / Cannot go to church)
                                        </div>
                                        <div className="text-[11px] text-slate-500">Requires home visits for sacraments and fellowship</div>
                                        {draft.isHomebound && (
                                            <input
                                                type="text"
                                                value={draft.specialNeeds || ''}
                                                onChange={e => setDraft({ ...draft, specialNeeds: e.target.value })}
                                                placeholder="Brief situation: e.g. Stroke patient, blind, paralyzed"
                                                className="mt-2 w-full text-xs px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-rose-300 rounded-lg"
                                            />
                                        )}
                                    </div>
                                </label>

                                {/* PWD */}
                                <label className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.isPwd ?? false}
                                        onChange={e => setDraft({ ...draft, isPwd: e.target.checked })}
                                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                                    />
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Person with Disability (PWD)
                                        </div>
                                        {draft.isPwd && (
                                            <input
                                                type="text"
                                                value={draft.pwdDetails || ''}
                                                onChange={e => setDraft({ ...draft, pwdDetails: e.target.value })}
                                                placeholder="Specify disability: e.g. Mobility impairment, speech, mental health"
                                                className="mt-2 w-full text-xs px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-slate-300 rounded-lg"
                                            />
                                        )}
                                    </div>
                                </label>

                                {/* Sacramental Care Flags */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={draft.needsCommunionAnointing ?? false}
                                            onChange={e => setDraft({ ...draft, needsCommunionAnointing: e.target.checked })}
                                            className="rounded text-rose-600 focus:ring-rose-500"
                                        />
                                        <span>Needs Home Communion / Viaticum / Anointing of Sick</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={draft.needsPastoralVisit ?? false}
                                            onChange={e => setDraft({ ...draft, needsPastoralVisit: e.target.checked })}
                                            className="rounded text-rose-600 focus:ring-rose-500"
                                        />
                                        <span>Needs Pastoral Home Visit by Parish Priest / Team</span>
                                    </label>
                                </div>

                                {/* YOUTH ACCOMPANIMENT (Area 6) */}
                                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800">
                                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-2">
                                        Youth & Children Accompaniment (Age &lt; 25)
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={draft.isOutOfSchoolYouth ?? false}
                                                onChange={e => setDraft({ ...draft, isOutOfSchoolYouth: e.target.checked })}
                                                className="rounded text-amber-600 focus:ring-amber-500"
                                            />
                                            <span>Out-of-School Youth (OSY)</span>
                                        </label>

                                        <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={draft.youthMinistryInvolvement ?? false}
                                                onChange={e => setDraft({ ...draft, youthMinistryInvolvement: e.target.checked })}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span>Active in Youth Ministry / CYO</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: FAITH, MINISTRIES & CHARISMS */}
                    {tab === 'ministry' && (
                        <div className="space-y-4">
                            <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-300">
                                <strong>Parish Ministry Involvement & Gifts to Share</strong> — Record where this member participates or can volunteer.
                            </div>

                            {/* PARISH MINISTRIES (Area 5) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-2">
                                    Parish Organizations / Ministries Involved:
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        'Choir & Music Ministry',
                                        'Catechist / Teaching',
                                        'Lector & Commentator',
                                        'Altar Server / Sacristan',
                                        'Extraordinary Minister (EMHC)',
                                        'Usher & Hospitality',
                                        'Youth Ministry / CYO',
                                        'BEC Leader / Coordinator',
                                        'Caritas / Social Services',
                                    ].map(ministry => (
                                        <button
                                            key={ministry}
                                            type="button"
                                            onClick={() => toggleMinistry(ministry)}
                                            className={`p-2 text-left rounded-lg text-xs border transition-all ${
                                                (draft.parishMinistries || []).includes(ministry)
                                                    ? 'bg-purple-100 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-200 font-semibold'
                                                    : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                                            }`}
                                        >
                                            {ministry}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* GIFTS & TALENTS TO OFFER (Area 10) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mb-2">
                                    Talents & Skills Member Can Offer to Community:
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        'Teaching / Catechesis',
                                        'Choir & Musical Instrument',
                                        'Medical & First Aid',
                                        'Carpentry & Construction',
                                        'Electrical & Repairs',
                                        'Cooking & Food Preparation',
                                        'Accounting & Financial Admin',
                                        'Youth Mentoring & Sports',
                                        'Digital & Tech Assistance',
                                    ].map(skill => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className={`p-2 text-left rounded-lg text-xs border transition-all ${
                                                (draft.skillsTalents || []).includes(skill)
                                                    ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold'
                                                    : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                                            }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODAL FOOTER */}
                    <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500">
                            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px]">Save</kbd> to update family roster.
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                            >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                Save Member
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
