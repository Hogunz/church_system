import React from 'react';
import {
    X,
    Users,
    Church,
    HeartPulse,
    Home,
    Phone,
    MapPin,
    Calendar,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    FileText,
    BookOpen,
} from 'lucide-react';
import type { Household, FamilyMember } from '@/types/parish';

interface HouseholdDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    household: Household | null;
    isPastor?: boolean;
    onApprove?: (h: Household) => void;
    onReturn?: (h: Household, note: string) => void;
}

export default function HouseholdDetailModal({
    isOpen,
    onClose,
    household,
    isPastor = false,
    onApprove,
    onReturn,
}: HouseholdDetailModalProps) {
    const [returnNote, setReturnNote] = React.useState('');
    const [showReturnInput, setShowReturnInput] = React.useState(false);

    if (!isOpen || !household) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold">
                            <Home className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold">{household.familyName} Household</h2>
                                <span className="text-xs text-stone-300">({household.id})</span>
                                <span
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                        household.status === 'Approved'
                                            ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                                            : household.status === 'Returned for Correction'
                                            ? 'bg-rose-900 text-rose-200 border border-rose-700'
                                            : 'bg-amber-900 text-amber-200 border border-amber-700'
                                    }`}
                                >
                                    {household.status}
                                </span>
                            </div>
                            <p className="text-xs text-stone-400 mt-0.5">
                                Encoded by {household.encodedBy} on {household.dateEncoded}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 bg-stone-50/50">
                    {/* Correction Note if returned */}
                    {household.correctionNote && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                            <div className="flex items-center gap-2 font-bold mb-1">
                                <AlertCircle className="w-4 h-4 text-rose-700" />
                                <span>Correction Note from Pastor</span>
                            </div>
                            <p className="text-xs">{household.correctionNote}</p>
                        </div>
                    )}

                    {/* Section 1: Household Identification */}
                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                            <Home className="w-4 h-4 text-emerald-800" />
                            Household Details & Location
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <span className="text-stone-400 block text-[11px]">Head of Family</span>
                                <span className="font-semibold text-stone-900">{household.headName}</span>
                            </div>
                            <div>
                                <span className="text-stone-400 block text-[11px]">Contact Number</span>
                                <span className="font-semibold text-stone-900">{household.contactNumber || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-stone-400 block text-[11px]">Barangay & Sitio</span>
                                <span className="font-semibold text-stone-900">
                                    {household.barangay}, {household.sitioPurok}
                                </span>
                            </div>
                            <div>
                                <span className="text-stone-400 block text-[11px]">BEC Cluster</span>
                                <span className="font-semibold text-emerald-800">{household.becCluster}</span>
                            </div>
                            <div>
                                <span className="text-stone-400 block text-[11px]">Housing Situation</span>
                                <span className="font-medium text-stone-800">{household.housingSituation || 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="text-stone-400 block text-[11px]">Monthly Income</span>
                                <span className="font-medium text-stone-800">{household.monthlyIncome || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Family Members */}
                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-800" />
                                Family Members ({household.members.length})
                            </h3>
                        </div>
                        <div className="divide-y divide-stone-100">
                            {household.members.map((m, idx) => (
                                <div key={m.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-stone-900 text-xs">{m.fullName}</span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-600 font-semibold">
                                                {m.relationship} &bull; {m.age} yrs old &bull; {m.sex}
                                            </span>
                                            {m.civilStatus && (
                                                <span className="text-[10px] text-stone-500 font-medium">({m.civilStatus})</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                                            <span className={`px-1.5 py-0.5 rounded ${m.isBaptized ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-400'}`}>
                                                {m.isBaptized ? '✓ Baptized' : '✕ No Baptism'}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded ${m.isFirstCommunion ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-400'}`}>
                                                {m.isFirstCommunion ? '✓ Communion' : '✕ No Communion'}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded ${m.isConfirmed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-400'}`}>
                                                {m.isConfirmed ? '✓ Confirmed' : '✕ No Confirmation'}
                                            </span>
                                            {m.isSenior && (
                                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                                    Senior (60+)
                                                </span>
                                            )}
                                            {m.isHomebound && (
                                                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                                                    Homebound
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {m.occupation && (
                                        <div className="text-right text-[11px] text-stone-500">
                                            <span>{m.occupation}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Pastoral & Synodal Listening */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Synodal Voices */}
                        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                                <Sparkles className="w-4 h-4 text-amber-700" />
                                Synodal Listening Notes
                            </h3>
                            <div className="space-y-2.5">
                                <div>
                                    <span className="text-[11px] font-bold text-emerald-800 block">Family Joy & Thanksgiving:</span>
                                    <p className="text-stone-700 italic">&ldquo;{household.familyJoy || 'None recorded'}&rdquo;</p>
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-rose-800 block">Family Difficulties & Concerns:</span>
                                    <p className="text-stone-700 italic">&ldquo;{household.familyConcern || 'None recorded'}&rdquo;</p>
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-stone-800 block">How Parish Can Help:</span>
                                    <p className="text-stone-700 italic">&ldquo;{household.howParishCanHelp || 'None recorded'}&rdquo;</p>
                                </div>
                            </div>
                        </div>

                        {/* Pastoral Needs & Charisms */}
                        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
                                <HeartPulse className="w-4 h-4 text-emerald-800" />
                                Needs & Volunteer Gifts
                            </h3>
                            <div>
                                <span className="text-[11px] font-semibold text-stone-500 block mb-1">Requested Pastoral Needs:</span>
                                {household.pastoralNeeds && household.pastoralNeeds.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {household.pastoralNeeds.map(n => (
                                            <span key={n} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-[11px]">
                                                {n}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-stone-400 italic">No specific needs logged</span>
                                )}
                            </div>
                            <div className="pt-2">
                                <span className="text-[11px] font-semibold text-stone-500 block mb-1">Offered Volunteer Charisms / Talents:</span>
                                {household.volunteerSkills && household.volunteerSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {household.volunteerSkills.map(s => (
                                            <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-stone-400 italic">No volunteer talents logged</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Pastor Action Bar */}
                {isPastor && household.status === 'Pending Review' && (
                    <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                        {showReturnInput ? (
                            <div className="w-full flex items-center gap-2">
                                <input
                                    type="text"
                                    value={returnNote}
                                    onChange={e => setReturnNote(e.target.value)}
                                    placeholder="Enter correction instructions for volunteer..."
                                    className="flex-1 px-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                                />
                                <button
                                    onClick={() => {
                                        if (onReturn && returnNote.trim()) {
                                            onReturn(household, returnNote.trim());
                                            setShowReturnInput(false);
                                        }
                                    }}
                                    className="px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                                >
                                    Confirm Return
                                </button>
                                <button
                                    onClick={() => setShowReturnInput(false)}
                                    className="px-2 py-2 text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowReturnInput(true)}
                                    className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Return for Correction
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-stone-600 hover:text-stone-900 rounded-xl text-xs font-semibold cursor-pointer"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => onApprove && onApprove(household)}
                                        className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                        Approve & Register into Parish Master Records
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
