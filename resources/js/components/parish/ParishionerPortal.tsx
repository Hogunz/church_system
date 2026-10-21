import React, { useState } from 'react';
import {
    Home,
    Users,
    Award,
    Plus,
    FileText,
    Printer,
    Eye,
    ShieldCheck,
    CheckCircle2,
    Clock,
    AlertCircle,
    Church,
} from 'lucide-react';
import type { Household, FamilyMember, CertificateRecord } from '@/types/parish';

interface ParishionerPortalProps {
    household: Household | null;
    certificates: CertificateRecord[];
    activeSubTab: string;
    onSubTabChange: (tab: string) => void;
    onRequestCertificate: (member: FamilyMember, type: 'Baptismal' | 'Confirmation' | 'First Communion', purpose: string) => void;
    onViewCertificatePrint: (cert: CertificateRecord) => void;
}

export default function ParishionerPortal({
    household,
    certificates,
    activeSubTab,
    onSubTabChange,
    onRequestCertificate,
    onViewCertificatePrint,
}: ParishionerPortalProps) {
    // Request Certificate form state
    const [selectedMemberId, setSelectedMemberId] = useState<string>(
        household?.members[0]?.id || ''
    );
    const [certType, setCertType] = useState<'Baptismal' | 'Confirmation' | 'First Communion'>('Baptismal');
    const [purpose, setPurpose] = useState('School Enrollment Requirement');
    const [requestSuccess, setRequestSuccess] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const member = household?.members.find(m => m.id === selectedMemberId);
        if (!member) return;

        onRequestCertificate(member, certType, purpose);
        setRequestSuccess(`Certificate request for ${member.fullName} (${certType}) submitted to Pastor.`);
        setTimeout(() => {
            setRequestSuccess('');
            onSubTabChange('certificates');
        }, 1500);
    };

    // Filter certificates belonging to this household/members
    const myCertificates = certificates.filter(
        c => c.familyId === household?.id || household?.members.some(m => m.fullName.toLowerCase() === c.recipientName.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Top Verified Household Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-bold text-lg shadow-2xs">
                        <Home className="w-6 h-6 text-amber-800" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-stone-900">
                                {household ? `${household.familyName} Household` : 'Santos Family'}
                            </h2>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Verified Household
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                            {household?.address}, {household?.sitioPurok} &bull; {household?.becCluster}
                        </p>
                    </div>
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-[11px]">Canonical Privacy: Restricted to verified household members only.</span>
                </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex border-b border-stone-200 gap-6 text-xs sm:text-sm font-semibold">
                <button
                    onClick={() => onSubTabChange('household')}
                    className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                        activeSubTab === 'household'
                            ? 'border-emerald-800 text-emerald-900 font-bold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    My Family Profile ({household?.members.length || 0})
                </button>
                <button
                    onClick={() => onSubTabChange('request')}
                    className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                        activeSubTab === 'request'
                            ? 'border-emerald-800 text-emerald-900 font-bold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Request Sacramental Certificate
                </button>
                <button
                    onClick={() => onSubTabChange('certificates')}
                    className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                        activeSubTab === 'certificates'
                            ? 'border-emerald-800 text-emerald-900 font-bold'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <Award className="w-4 h-4" />
                    Issued Certificates ({myCertificates.length})
                </button>
            </div>

            {/* TAB 1: HOUSEHOLD PROFILE */}
            {activeSubTab === 'household' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {household?.members.map(member => (
                            <div
                                key={member.id}
                                className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2">
                                    <div>
                                        <h3 className="font-bold text-stone-900 text-sm">{member.fullName}</h3>
                                        <p className="text-xs text-stone-500">
                                            {member.relationship} &bull; {member.age} yrs old &bull; {member.civilStatus}
                                        </p>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 font-bold text-stone-600">
                                        {member.sex}
                                    </span>
                                </div>

                                {/* Sacramental Badges */}
                                <div className="space-y-1.5 text-xs">
                                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide block">
                                        Sacraments Received:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                                member.isBaptized
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : 'bg-stone-50 text-stone-400 border-stone-200'
                                            }`}
                                        >
                                            {member.isBaptized ? '✓ Baptized' : '✕ Baptism Pending'}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                                member.isFirstCommunion
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : 'bg-stone-50 text-stone-400 border-stone-200'
                                            }`}
                                        >
                                            {member.isFirstCommunion ? '✓ First Communion' : '✕ Communion Pending'}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                                member.isConfirmed
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : 'bg-stone-50 text-stone-400 border-stone-200'
                                            }`}
                                        >
                                            {member.isConfirmed ? '✓ Confirmed' : '✕ Confirmation Pending'}
                                        </span>
                                    </div>
                                </div>

                                {member.occupation && (
                                    <p className="text-xs text-stone-600">
                                        <strong>Occupation:</strong> {member.occupation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: REQUEST CERTIFICATE FORM */}
            {activeSubTab === 'request' && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 max-w-xl mx-auto shadow-2xs space-y-6 text-xs">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            Parish Chancery Registry Service
                        </span>
                        <h3 className="text-base font-bold text-stone-900 mt-0.5">
                            Request Sacramental Certificate
                        </h3>
                        <p className="text-stone-500 mt-1">
                            Select a verified member of your household. Requests are submitted to the Parish Priest for verification against canonical book entries.
                        </p>
                    </div>

                    {requestSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{requestSuccess}</span>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">
                                Family Member
                            </label>
                            <select
                                value={selectedMemberId}
                                onChange={e => setSelectedMemberId(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            >
                                {household?.members.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.fullName} ({m.relationship}, age {m.age})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">
                                Certificate Type
                            </label>
                            <select
                                value={certType}
                                onChange={e => setCertType(e.target.value as any)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            >
                                <option value="Baptismal">Certificate of Baptism</option>
                                <option value="Confirmation">Certificate of Confirmation</option>
                                <option value="First Communion">Certificate of First Holy Communion</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">
                                Purpose of Certificate
                            </label>
                            <select
                                value={purpose}
                                onChange={e => setPurpose(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            >
                                <option value="School Enrollment Requirement">School Enrollment Requirement</option>
                                <option value="Canonical Marriage Requirement (Kasal)">Canonical Marriage Requirement (Kasal)</option>
                                <option value="Sponsorship for Baptism / Confirmation">Sponsorship for Baptism / Confirmation</option>
                                <option value="Personal / Family Ecclesial Record">Personal / Family Ecclesial Record</option>
                                <option value="Travel / Visa Verification">Travel / Visa Verification</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Award className="w-4 h-4 text-emerald-300" />
                                Submit Request to Pastor
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* TAB 3: ISSUED CERTIFICATES */}
            {activeSubTab === 'certificates' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-stone-900">Official Sacramental Certificates</h3>
                            <p className="text-xs text-stone-500">
                                View and print official certificates signed and issued by the Parish Priest.
                            </p>
                        </div>
                    </div>

                    {myCertificates.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-xs">
                            <Award className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                            <h4 className="font-bold text-stone-800">No certificates issued yet</h4>
                            <p className="text-stone-500 mt-1">
                                Use the &ldquo;Request Sacramental Certificate&rdquo; tab above to submit a new request.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myCertificates.map(cert => (
                                <div
                                    key={cert.id}
                                    className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between"
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-stone-900 text-sm">{cert.recipientName}</span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    cert.status === 'Approved & Issued'
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                }`}
                                            >
                                                {cert.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-semibold text-emerald-900">
                                            Sacrament of {cert.certificateType}
                                        </p>
                                        <div className="text-[11px] text-stone-500 space-y-0.5">
                                            <div><strong>Registry Code:</strong> {cert.requestId || cert.id}</div>
                                            {cert.bookNo && (
                                                <div><strong>Citation:</strong> {cert.bookNo}, {cert.pageNo}, {cert.lineNo}</div>
                                            )}
                                            {cert.dateIssued && <div><strong>Issued:</strong> {cert.dateIssued}</div>}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-stone-100">
                                        {cert.status === 'Approved & Issued' ? (
                                            <button
                                                onClick={() => onViewCertificatePrint(cert)}
                                                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                                            >
                                                <Printer className="w-4 h-4 text-emerald-300" />
                                                View & Print Official Certificate
                                            </button>
                                        ) : (
                                            <div className="text-center text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                Awaiting Pastor signature & book citation
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
