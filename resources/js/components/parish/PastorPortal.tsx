import React, { useState } from 'react';
import {
    CheckCircle2,
    Clock,
    Award,
    Users,
    Settings,
    BarChart3,
    Search,
    Filter,
    AlertCircle,
    ChevronRight,
    Eye,
    Plus,
    Trash2,
    BookOpen,
    ShieldAlert,
    Church,
    Check,
} from 'lucide-react';
import type { Household, CertificateRecord, ParishOptionItem } from '@/types/parish';
import PastorReportsDashboard from '@/components/pastor/PastorReportsDashboard';

interface PastorPortalProps {
    households: Household[];
    certificates: CertificateRecord[];
    activeSubTab: string;
    onSubTabChange: (tab: string) => void;
    onApproveHousehold: (household: Household) => void;
    onReturnHousehold: (household: Household, note: string) => void;
    onIssueCertificate: (certificate: CertificateRecord, details: { bookNo: string; pageNo: string; lineNo: string; ministerName: string; sponsorNames: string }) => void;
    onViewHouseholdDetail: (household: Household) => void;
    onViewCertificatePrint: (cert: CertificateRecord) => void;
    parishOptions?: Record<string, ParishOptionItem[]>;
    onAddOption?: (type: string, label: string) => void;
    onDeleteOption?: (id: number) => void;
}

export default function PastorPortal({
    households,
    certificates,
    activeSubTab,
    onSubTabChange,
    onApproveHousehold,
    onReturnHousehold,
    onIssueCertificate,
    onViewHouseholdDetail,
    onViewCertificatePrint,
    parishOptions = {},
    onAddOption,
    onDeleteOption,
}: PastorPortalProps) {
    // Review Tab return modal state
    const [returningHousehold, setReturningHousehold] = useState<Household | null>(null);
    const [correctionNote, setCorrectionNote] = useState('');

    // Certificate issuance modal state
    const [issuingCert, setIssuingCert] = useState<CertificateRecord | null>(null);
    const [bookNo, setBookNo] = useState('Book 42');
    const [pageNo, setPageNo] = useState('Page 88');
    const [lineNo, setLineNo] = useState('Line 12');
    const [ministerName, setMinisterName] = useState('Rev. Fr. Emmanuel D. Garcia');
    const [sponsorNames, setSponsorNames] = useState('');

    // Parish Master Registry filters
    const [registrySearch, setRegistrySearch] = useState('');
    const [becFilter, setBecFilter] = useState('all');

    // Settings tab state
    const [selectedSettingsCategory, setSelectedSettingsCategory] = useState('barangays');
    const [newOptionLabel, setNewOptionLabel] = useState('');

    // Handlers
    const handleConfirmReturn = () => {
        if (returningHousehold && correctionNote.trim()) {
            onReturnHousehold(returningHousehold, correctionNote.trim());
            setReturningHousehold(null);
            setCorrectionNote('');
        }
    };

    const handleOpenIssueModal = (cert: CertificateRecord) => {
        setIssuingCert(cert);
        setBookNo(cert.bookNo || 'Book 42');
        setPageNo(cert.pageNo || 'Page 88');
        setLineNo(cert.lineNo || 'Line 12');
        setMinisterName(cert.ministerName || 'Rev. Fr. Emmanuel D. Garcia');
        setSponsorNames(cert.sponsorNames || '');
    };

    const handleConfirmIssue = () => {
        if (issuingCert) {
            onIssueCertificate(issuingCert, {
                bookNo,
                pageNo,
                lineNo,
                ministerName,
                sponsorNames,
            });
            setIssuingCert(null);
        }
    };

    // Filtered data
    const pendingHouseholds = households.filter(h => h.status === 'Pending Review');
    const pendingCertificates = certificates.filter(c => c.status === 'Pending Review');
    const approvedHouseholds = households.filter(h => h.status === 'Approved');

    const filteredRegistry = approvedHouseholds.filter(h => {
        const matchesSearch =
            h.familyName.toLowerCase().includes(registrySearch.toLowerCase()) ||
            h.headName.toLowerCase().includes(registrySearch.toLowerCase()) ||
            h.id.toLowerCase().includes(registrySearch.toLowerCase()) ||
            h.members.some(m => m.fullName.toLowerCase().includes(registrySearch.toLowerCase()));
        const matchesBec = becFilter === 'all' || h.becCluster === becFilter;
        return matchesSearch && matchesBec;
    });

    const becList = Array.from(new Set(households.map(h => h.becCluster))).filter(Boolean);

    return (
        <div className="space-y-6">
            {/* Top Pastor Authority Card */}
            <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        Chancery & Pastoral Office
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold mt-0.5">Rev. Fr. Emmanuel D. Garcia</h2>
                    <p className="text-xs text-stone-300 mt-1 max-w-xl">
                        Canonical authority for verifying household registrations, approving census entries into the Master Registry,
                        and signing official sacramental certificates.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-stone-800 rounded-xl border border-stone-700">
                        <span className="text-[10px] text-stone-400 block">Total Parishioners</span>
                        <span className="text-base font-bold text-emerald-300">
                            {households.reduce((acc, h) => acc + h.members.length, 0)}
                        </span>
                    </div>
                    <div className="p-2.5 bg-stone-800 rounded-xl border border-stone-700">
                        <span className="text-[10px] text-stone-400 block">Pending Surveys</span>
                        <span className="text-base font-bold text-amber-400">{pendingHouseholds.length}</span>
                    </div>
                    <div className="p-2.5 bg-stone-800 rounded-xl border border-stone-700">
                        <span className="text-[10px] text-stone-400 block">Pending Certs</span>
                        <span className="text-base font-bold text-amber-400">{pendingCertificates.length}</span>
                    </div>
                    <div className="p-2.5 bg-stone-800 rounded-xl border border-stone-700">
                        <span className="text-[10px] text-stone-400 block">Approved Families</span>
                        <span className="text-base font-bold text-emerald-300">{approvedHouseholds.length}</span>
                    </div>
                </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex border-b border-stone-200 gap-4 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-px">
                {[
                    { id: 'reports', label: 'Pastoral Intelligence', count: null },
                    { id: 'review', label: 'Pending Family Surveys', count: pendingHouseholds.length },
                    { id: 'certificates', label: 'Certificate Requests', count: pendingCertificates.length },
                    { id: 'records', label: 'Parish Master Registry', count: approvedHouseholds.length },
                    { id: 'settings', label: 'Form Settings', count: null },
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
                        {item.count !== null && item.count > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-600 text-white">
                                {item.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* TAB 1: PASTORAL REPORTS DASHBOARD */}
            {activeSubTab === 'reports' && (
                <PastorReportsDashboard
                    households={households}
                    onSelectHousehold={onViewHouseholdDetail}
                    onSwitchTab={tab => onSubTabChange(tab)}
                />
            )}

            {/* TAB 2: PENDING HOUSEHOLD SURVEYS REVIEW */}
            {activeSubTab === 'review' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-stone-900">Pending Field Surveys for Verification</h3>
                            <p className="text-xs text-stone-500">
                                Review interview submissions, verify informed consent, and approve into canonical registry.
                            </p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                            {pendingHouseholds.length} pending
                        </span>
                    </div>

                    {pendingHouseholds.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-xs">
                            <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
                            <h4 className="font-bold text-stone-800 text-sm">All family surveys have been reviewed!</h4>
                            <p className="text-stone-500 mt-1">There are no pending submissions in the queue.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingHouseholds.map(h => (
                                <div
                                    key={h.id}
                                    className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-start justify-between gap-4"
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-base text-stone-900">{h.familyName} Family</span>
                                            <span className="text-xs text-stone-400">({h.id})</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                                Awaiting Pastor Approval
                                            </span>
                                            {h.isVulnerable && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                                                    Vulnerable Household
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-stone-600">
                                            <strong>Head:</strong> {h.headName} &bull; <strong>Address:</strong> {h.address}, {h.sitioPurok} &bull; <strong>BEC:</strong> {h.becCluster}
                                        </p>

                                        {/* Family members summary preview */}
                                        <div className="text-xs text-stone-500">
                                            <span><strong>Members ({h.members.length}):</strong> </span>
                                            {h.members.map(m => m.fullName).join(', ')}
                                        </div>

                                        {/* Pastoral needs or synodal voice */}
                                        {h.familyJoy && (
                                            <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                                                &ldquo;{h.familyJoy}&rdquo;
                                            </p>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
                                        <button
                                            onClick={() => onViewHouseholdDetail(h)}
                                            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Review Details
                                        </button>
                                        <button
                                            onClick={() => onApproveHousehold(h)}
                                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                                        >
                                            <Check className="w-4 h-4 text-emerald-300" />
                                            Approve & Register
                                        </button>
                                        <button
                                            onClick={() => {
                                                setReturningHousehold(h);
                                                setCorrectionNote('');
                                            }}
                                            className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            Return for Correction
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: CERTIFICATE REQUESTS & ISSUANCE */}
            {activeSubTab === 'certificates' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-stone-900">Canonical Sacramental Certificates</h3>
                            <p className="text-xs text-stone-500">
                                Enter Book, Page, and Line numbers from physical church registry, sign, and issue certificates.
                            </p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                            {certificates.length} total certificates
                        </span>
                    </div>

                    <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden divide-y divide-stone-100">
                        {certificates.map(cert => (
                            <div
                                key={cert.id}
                                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-stone-900 text-sm">{cert.recipientName}</span>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                                            {cert.certificateType}
                                        </span>
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

                                    <div className="text-xs text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
                                        <span><strong>Purpose:</strong> {cert.purpose}</span>
                                        {cert.bookNo && (
                                            <span>
                                                <strong>Citation:</strong> {cert.bookNo}, {cert.pageNo}, {cert.lineNo}
                                            </span>
                                        )}
                                        {cert.dateIssued && <span><strong>Issued:</strong> {cert.dateIssued}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {cert.status === 'Pending Review' ? (
                                        <button
                                            onClick={() => handleOpenIssueModal(cert)}
                                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Award className="w-4 h-4 text-emerald-300" />
                                            Verify & Issue Certificate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onViewCertificatePrint(cert)}
                                            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4 text-stone-500" />
                                            View Official Certificate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: PARISH MASTER REGISTRY */}
            {activeSubTab === 'records' && (
                <div className="space-y-4">
                    {/* Search & BEC Filters */}
                    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={registrySearch}
                                onChange={e => setRegistrySearch(e.target.value)}
                                placeholder="Search family surname, member name, or ID..."
                                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-stone-500 font-semibold">Filter BEC:</span>
                            <select
                                value={becFilter}
                                onChange={e => setBecFilter(e.target.value)}
                                className="px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            >
                                <option value="all">All BEC Clusters</option>
                                {becList.map(bec => (
                                    <option key={bec} value={bec}>
                                        {bec}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Master Registry Table */}
                    <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
                        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                            <h3 className="font-bold text-sm text-stone-900">
                                Canonical Household Census ({filteredRegistry.length} Families)
                            </h3>
                            <span className="text-xs text-stone-400">Diocese of San Pablo Registry</span>
                        </div>
                        <div className="divide-y divide-stone-100">
                            {filteredRegistry.map(h => (
                                <div
                                    key={h.id}
                                    onClick={() => onViewHouseholdDetail(h)}
                                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors cursor-pointer"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-stone-900 text-sm">{h.familyName} Family</span>
                                            <span className="text-xs text-stone-400">({h.id})</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                                                {h.becCluster}
                                            </span>
                                        </div>
                                        <div className="text-xs text-stone-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                            <span><strong>Head:</strong> {h.headName}</span>
                                            <span><strong>Address:</strong> {h.address}, {h.sitioPurok}</span>
                                            <span><strong>Members:</strong> {h.members.length}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-emerald-800">View Full Census</span>
                                        <ChevronRight className="w-4 h-4 text-stone-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: PARISH FORM SETTINGS */}
            {activeSubTab === 'settings' && (
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6 text-xs">
                    <div>
                        <h3 className="font-bold text-base text-stone-900">Parish Pastoral Form Settings</h3>
                        <p className="text-stone-500 mt-0.5">
                            Manage the standard dropdown options used across the volunteer field questionnaire.
                        </p>
                    </div>

                    <div className="flex gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
                        {[
                            { key: 'barangays', label: 'Barangays' },
                            { key: 'sitios', label: 'Sitios / Puroks' },
                            { key: 'bec_clusters', label: 'BEC Clusters' },
                            { key: 'pastoral_needs', label: 'Pastoral Needs' },
                            { key: 'volunteer_skills', label: 'Volunteer Skills' },
                        ].map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedSettingsCategory(cat.key)}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                                    selectedSettingsCategory === cat.key
                                        ? 'bg-emerald-900 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Add new option input */}
                    <div className="flex items-center gap-2 max-w-md">
                        <input
                            type="text"
                            value={newOptionLabel}
                            onChange={e => setNewOptionLabel(e.target.value)}
                            placeholder={`Add new option...`}
                            className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                        <button
                            onClick={() => {
                                if (onAddOption && newOptionLabel.trim()) {
                                    onAddOption(selectedSettingsCategory, newOptionLabel.trim());
                                    setNewOptionLabel('');
                                }
                            }}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add Option
                        </button>
                    </div>

                    {/* Current options list */}
                    <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 max-w-lg">
                        {(parishOptions[selectedSettingsCategory] || []).map(opt => (
                            <div key={opt.id} className="p-3 flex items-center justify-between text-xs">
                                <span className="font-medium text-stone-800">{opt.label}</span>
                                {onDeleteOption && (
                                    <button
                                        onClick={() => onDeleteOption(opt.id)}
                                        className="p-1 text-stone-400 hover:text-rose-700 rounded transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal: Return For Correction */}
            {returningHousehold && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200 text-xs">
                        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                            <span>Return Family Survey for Correction</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">
                            Specify what needs verification or correction by the volunteer for the{' '}
                            <strong>{returningHousehold.familyName} family</strong>:
                        </p>
                        <textarea
                            rows={3}
                            value={correctionNote}
                            onChange={e => setCorrectionNote(e.target.value)}
                            placeholder="e.g. Please verify birthdate of 2nd child and specify if civil marriage ceremony was held..."
                            className="w-full p-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setReturningHousehold(null)}
                                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReturn}
                                disabled={!correctionNote.trim()}
                                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl disabled:opacity-50 cursor-pointer"
                            >
                                Confirm Return to Volunteer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Verify & Issue Certificate */}
            {issuingCert && (
                <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-stone-200 text-xs">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                            <Award className="w-5 h-5 text-emerald-800" />
                            <span>Issue Sacramental Certificate</span>
                        </div>
                        <p className="text-stone-600">
                            Enter the physical canonical register citations for <strong>{issuingCert.recipientName}</strong> (
                            {issuingCert.certificateType}):
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Book No.</label>
                                <input
                                    type="text"
                                    value={bookNo}
                                    onChange={e => setBookNo(e.target.value)}
                                    placeholder="Book 42"
                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Page No.</label>
                                <input
                                    type="text"
                                    value={pageNo}
                                    onChange={e => setPageNo(e.target.value)}
                                    placeholder="Page 88"
                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-stone-700 mb-1">Line No.</label>
                                <input
                                    type="text"
                                    value={lineNo}
                                    onChange={e => setLineNo(e.target.value)}
                                    placeholder="Line 12"
                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Officiating Minister</label>
                            <input
                                type="text"
                                value={ministerName}
                                onChange={e => setMinisterName(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-stone-700 mb-1">Sponsors / Godparents</label>
                            <input
                                type="text"
                                value={sponsorNames}
                                onChange={e => setSponsorNames(e.target.value)}
                                placeholder="e.g. Juan Dela Cruz, Maria Clara Reyes"
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                            <button
                                onClick={() => setIssuingCert(null)}
                                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmIssue}
                                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                            >
                                Sign & Issue Official Certificate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
