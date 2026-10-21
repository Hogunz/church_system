import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    Church,
    Clock,
    Calendar,
    Users,
    Award,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    HeartHandshake,
    Sparkles,
    Baby,
    HeartPulse,
    Eye,
    Printer,
    ExternalLink,
} from 'lucide-react';
import CertificatePrintModal from '@/components/parish/CertificatePrintModal';
import type { CertificateRecord } from '@/types/parish';

interface CertificateItem {
    code: string;
    name: string;
    type: string;
    status: string;
    bookNo?: string;
    pageNo?: string;
    lineNo?: string;
    minister?: string;
    place?: string;
    dateOfSacrament?: string | null;
    createdAt?: string | null;
}

interface BecClusterItem {
    name: string;
    families: number;
}

interface WelcomeProps {
    stats?: {
        totalHouseholds: number;
        totalMembers: number;
        totalCertificates: number;
        approvedHouseholds: number;
        pendingSurveys: number;
        becClustersCount: number;
    };
    sampleCertificates?: CertificateItem[];
    becClusters?: BecClusterItem[];
}

export default function Welcome({
    stats = {
        totalHouseholds: 142,
        totalMembers: 548,
        totalCertificates: 89,
        approvedHouseholds: 138,
        pendingSurveys: 4,
        becClustersCount: 4,
    },
    sampleCertificates = [],
    becClusters = [
        { name: 'BEC St. Jude', families: 48 },
        { name: 'BEC San Pedro', families: 39 },
        { name: 'BEC Sta. Maria', families: 32 },
        { name: 'BEC Sacred Heart', families: 23 },
    ],
}: WelcomeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedCertForPrint, setSelectedCertForPrint] = useState<CertificateRecord | null>(null);

    // Certificate sample records
    const certificateRecords: CertificateItem[] = useMemo(() => {
        if (sampleCertificates && sampleCertificates.length > 0) {
            return sampleCertificates;
        }
        return [
            {
                code: 'CERT-2026-001',
                name: 'Juan Santos',
                type: 'Baptismal',
                status: 'approved_and_issued',
                bookNo: 'Book 42',
                pageNo: 'Page 88',
                lineNo: 'Line 12',
                minister: 'Rev. Fr. Emmanuel D. Garcia',
                place: 'San Isidro Labrador Parish Church',
                dateOfSacrament: 'June 15, 2014',
                createdAt: 'Sep 25, 2026',
            },
            {
                code: 'CERT-2026-002',
                name: 'Sofia Santos',
                type: 'First Communion',
                status: 'pending_review',
                minister: 'Rev. Fr. Emmanuel D. Garcia',
                place: 'San Isidro Labrador Parish Church',
                dateOfSacrament: 'May 19, 2024',
                createdAt: 'Oct 02, 2026',
            },
        ];
    }, [sampleCertificates]);

    const searchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        return certificateRecords.filter(
            c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
        );
    }, [searchQuery, certificateRecords]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
    };

    const handleOpenPrintModal = (item: CertificateItem) => {
        const certRecord: CertificateRecord = {
            id: item.code,
            requestId: item.code,
            recipientName: item.name,
            familyId: 'FAM-2026-0042',
            certificateType: (item.type as any) || 'Baptismal',
            dateOfSacrament: item.dateOfSacrament || 'Recorded in Registry',
            placeOfSacrament: item.place || 'San Isidro Labrador Parish Church',
            ministerName: item.minister || 'Rev. Fr. Emmanuel D. Garcia',
            bookNo: item.bookNo || 'Book 42',
            pageNo: item.pageNo || 'Page 88',
            lineNo: item.lineNo || 'Line 12',
            sponsorNames: 'Pedro Reyes & Clara Gonzales',
            purpose: 'Official Ecclesial & School Verification',
            dateIssued: item.createdAt || '2026-09-25',
            status: item.status === 'approved_and_issued' ? 'Approved & Issued' : 'Pending Review',
            issuedBy: 'Rev. Fr. Emmanuel D. Garcia (Parish Priest)',
        };
        setSelectedCertForPrint(certRecord);
    };

    return (
        <div className="min-h-screen bg-[#faf9f5] text-stone-800 font-sans selection:bg-emerald-200">
            <Head title="San Isidro Labrador Parish Church • Diocese of San Pablo" />

            {/* TOP SYSTEM PROTOTYPE BANNER */}
            <div className="bg-stone-900 border-b border-stone-800 px-4 py-2 text-xs text-stone-300">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white">Parish Pastoral System Prototype</span>
                        <span className="hidden sm:inline text-stone-400">&bull; Switch personas:</span>
                    </div>
                    <div className="flex items-center gap-2.5 font-medium text-xs">
                        <Link
                            href="/prototype?role=volunteer"
                            className="px-2 py-0.5 rounded-md bg-stone-800 hover:bg-emerald-950 text-emerald-300 border border-stone-700 transition-colors"
                        >
                            Volunteer
                        </Link>
                        <Link
                            href="/prototype?role=pastor"
                            className="px-2 py-0.5 rounded-md bg-stone-800 hover:bg-amber-950 text-amber-300 border border-stone-700 transition-colors"
                        >
                            Pastor
                        </Link>
                        <Link
                            href="/prototype?role=member"
                            className="px-2 py-0.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
                        >
                            Parishioner
                        </Link>
                        <Link
                            href="/prototype?role=ppc"
                            className="px-2 py-0.5 rounded-md bg-stone-800 hover:bg-teal-950 text-teal-300 border border-stone-700 transition-colors"
                        >
                            Council
                        </Link>
                        <span className="text-stone-600 hidden sm:inline">|</span>
                        <Link
                            href="/prototype"
                            className="hidden sm:inline-flex items-center gap-1 font-bold text-white hover:text-emerald-300"
                        >
                            <span>Open Prototype</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* MAIN HEADER */}
            <header className="border-b border-stone-200 bg-white/95 backdrop-blur-xs sticky top-0 z-30 shadow-2xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-xs">
                            <Church className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                            <Link href="/" className="text-base sm:text-lg font-bold text-stone-900 tracking-tight block">
                                San Isidro Labrador Parish
                            </Link>
                            <p className="text-[11px] text-stone-500 font-medium">
                                Diocese of San Pablo &bull; Barangay San Isidro
                            </p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600">
                        <a href="#schedules" className="hover:text-emerald-900 transition-colors">
                            Mass Schedules
                        </a>
                        <a href="#services" className="hover:text-emerald-900 transition-colors">
                            Sacraments & Services
                        </a>
                        <a href="#bec" className="hover:text-emerald-900 transition-colors">
                            BEC Communities
                        </a>
                        <a href="#status-check" className="hover:text-emerald-900 transition-colors">
                            Certificate Tracker
                        </a>
                        <a href="#office" className="hover:text-emerald-900 transition-colors">
                            Parish Chancery
                        </a>
                    </nav>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl text-stone-700 hover:text-emerald-900 hover:bg-stone-100 text-xs font-semibold transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/prototype"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                            <span>Launch Prototype</span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* SPLIT HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-emerald-950 text-white py-16 lg:py-24 border-b border-stone-800">
                {/* Liturgical background ornamentation */}
                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <Church className="w-[600px] h-[600px] text-white" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        {/* Left Column: Parish Identity & Welcome */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Parish Pastoral & Family Information System</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif">
                                San Isidro Labrador Parish Church
                            </h1>

                            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                                Welcome to our Catholic parish community. Grounded in the Holy Eucharist, synodality, and
                                grassroots Basic Ecclesial Communities (BECs), we accompany every family in their sacramental journey and pastoral care.
                            </p>

                            {/* Census Ticker Pill */}
                            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                                <div className="px-3.5 py-1.5 rounded-xl bg-stone-800/90 border border-stone-700/80 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-emerald-400" />
                                    <span className="text-stone-300">
                                        <strong className="text-white">{stats.totalMembers}</strong> Registered Parishioners
                                    </span>
                                </div>
                                <div className="px-3.5 py-1.5 rounded-xl bg-stone-800/90 border border-stone-700/80 flex items-center gap-2">
                                    <Church className="w-4 h-4 text-amber-400" />
                                    <span className="text-stone-300">
                                        <strong className="text-white">{stats.totalHouseholds}</strong> Households &bull;{' '}
                                        <strong className="text-white">{stats.becClustersCount}</strong> BECs
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                <Link
                                    href="/prototype"
                                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                                >
                                    <span>Access Parish System</span>
                                    <ArrowRight className="w-4 h-4 text-emerald-300" />
                                </Link>
                                <a
                                    href="#schedules"
                                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
                                >
                                    Mass Schedules
                                </a>
                                <a
                                    href="#status-check"
                                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
                                >
                                    Track Certificate
                                </a>
                            </div>
                        </div>

                        {/* Right Column: Interactive Quick Certificate & Portal Card */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-stone-800 space-y-5">
                                <div className="border-b border-stone-100 pb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                                        Chancery Self-Service
                                    </span>
                                    <h2 className="text-base font-bold text-stone-900 mt-0.5">
                                        Sacramental Certificate Tracker
                                    </h2>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                        Verify baptismal, confirmation, or first communion registry records.
                                    </p>
                                </div>

                                {/* Quick Search Box */}
                                <form onSubmit={handleSearch} className="space-y-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={e => {
                                                setSearchQuery(e.target.value);
                                                setHasSearched(true);
                                            }}
                                            placeholder="Enter Code (e.g. CERT-2026-001) or Name..."
                                            className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                                    >
                                        Check Certificate Status
                                    </button>
                                </form>

                                {/* Sample chips */}
                                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                                    <span>Try test codes:</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('CERT-2026-001');
                                            setHasSearched(true);
                                        }}
                                        className="font-semibold text-emerald-800 hover:underline cursor-pointer"
                                    >
                                        CERT-2026-001
                                    </button>
                                    <span>&bull;</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('CERT-2026-002');
                                            setHasSearched(true);
                                        }}
                                        className="font-semibold text-emerald-800 hover:underline cursor-pointer"
                                    >
                                        CERT-2026-002
                                    </button>
                                </div>

                                {/* Search Results within Card */}
                                {hasSearched && (
                                    <div className="pt-3 border-t border-stone-100 animate-in fade-in duration-200">
                                        {searchResults.length > 0 ? (
                                            <div className="space-y-2">
                                                {searchResults.map(cert => (
                                                    <div
                                                        key={cert.code}
                                                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-stone-900">{cert.name}</span>
                                                            <span
                                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                    cert.status === 'approved_and_issued'
                                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                                }`}
                                                            >
                                                                {cert.status === 'approved_and_issued'
                                                                    ? 'Approved & Issued'
                                                                    : 'Pending Review'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-stone-500">
                                                            {cert.type} &bull; Ref: {cert.code}
                                                            {cert.bookNo && ` &bull; ${cert.bookNo}, ${cert.pageNo}`}
                                                        </p>
                                                        {cert.status === 'approved_and_issued' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenPrintModal(cert)}
                                                                className="w-full mt-1 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                                            >
                                                                <Printer className="w-3.5 h-3.5 text-emerald-300" />
                                                                View & Print Official Extract
                                                            </button>
                                                        ) : (
                                                            <div className="text-[11px] text-amber-700 font-medium">
                                                                In review by the Parish Priest.
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center py-2 text-xs text-stone-400">
                                                No sacramental record found for &ldquo;{searchQuery}&rdquo;.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* One-click Persona Links */}
                                <div className="pt-2 border-t border-stone-100">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                                        Direct Role Entry:
                                    </span>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <Link
                                            href="/prototype?role=volunteer"
                                            className="p-2 bg-stone-50 hover:bg-emerald-50 rounded-lg border border-stone-200 text-stone-700 hover:text-emerald-900 font-medium flex items-center justify-between transition-colors"
                                        >
                                            <span>Volunteer Survey</span>
                                            <ArrowRight className="w-3 h-3 text-stone-400" />
                                        </Link>
                                        <Link
                                            href="/prototype?role=pastor"
                                            className="p-2 bg-stone-50 hover:bg-amber-50 rounded-lg border border-stone-200 text-stone-700 hover:text-amber-900 font-medium flex items-center justify-between transition-colors"
                                        >
                                            <span>Pastor Portal</span>
                                            <ArrowRight className="w-3 h-3 text-stone-400" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE PARISH CENSUS & PASTORAL INDICATORS */}
            <section className="py-10 bg-white border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                Total Parishioners
                            </span>
                            <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                                {stats.totalMembers}
                            </p>
                            <span className="text-xs text-stone-500 mt-1 block">In canonical household census</span>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                Registered Families
                            </span>
                            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">
                                {stats.totalHouseholds}
                            </p>
                            <span className="text-xs text-stone-500 mt-1 block">Verified by parish council</span>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                BEC Neighborhoods
                            </span>
                            <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 mt-1">
                                {stats.becClustersCount}
                            </p>
                            <span className="text-xs text-stone-500 mt-1 block">Active grassroots clusters</span>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                Sacraments Recorded
                            </span>
                            <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">
                                {stats.totalCertificates}
                            </p>
                            <span className="text-xs text-stone-500 mt-1 block">Baptismal, Communion & Confirmation</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MASS & LITURGY SCHEDULES */}
            <section id="schedules" className="py-16 bg-[#faf9f5] border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            Liturgical Life & Sacraments
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif">
                            Holy Mass & Devotion Schedule
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
                            Celebrate the Holy Eucharist with our parish community at the Main Parish Church.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Sunday Masses */}
                        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                                <Church className="w-5 h-5 text-emerald-800" />
                                <div>
                                    <h3 className="font-bold text-stone-900 text-sm">Sunday Holy Masses</h3>
                                    <span className="text-[11px] text-stone-400">Day of the Lord &bull; Weekly Obligation</span>
                                </div>
                            </div>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                                    <span className="font-bold text-stone-900">6:00 AM</span>
                                    <span className="text-stone-600">Tagalog (Morning Mass)</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                                    <span className="font-bold text-stone-900">8:00 AM</span>
                                    <span className="font-semibold text-emerald-900">English / Tagalog (Misa Mayor)</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                                    <span className="font-bold text-stone-900">10:00 AM</span>
                                    <span className="text-stone-600">English (Children & Family Mass)</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                                    <span className="font-bold text-stone-900">5:00 PM</span>
                                    <span className="text-stone-600">Tagalog Community Mass</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-bold text-stone-900">6:30 PM</span>
                                    <span className="text-stone-600">Tagalog (Youth & Ministry Mass)</span>
                                </div>
                            </div>
                        </div>

                        {/* Weekday Masses & Novenas */}
                        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                                <Calendar className="w-5 h-5 text-emerald-800" />
                                <div>
                                    <h3 className="font-bold text-stone-900 text-sm">Weekday Masses & Novenas</h3>
                                    <span className="text-[11px] text-stone-400">Daily Bread & Special Devotions</span>
                                </div>
                            </div>
                            <div className="space-y-3 text-xs">
                                <div className="py-1 border-b border-stone-100">
                                    <div className="font-bold text-stone-900">Monday to Saturday: 6:30 AM</div>
                                    <div className="text-stone-500">Daily Morning Holy Mass</div>
                                </div>
                                <div className="py-1 border-b border-stone-100">
                                    <div className="font-bold text-stone-900">Wednesday: 5:30 PM</div>
                                    <div className="text-stone-500">Novena to Our Lady of Perpetual Help</div>
                                </div>
                                <div className="py-1 border-b border-stone-100">
                                    <div className="font-bold text-stone-900">First Friday: 6:00 PM</div>
                                    <div className="text-stone-500">Sacred Heart of Jesus Holy Mass & Anointing</div>
                                </div>
                                <div className="py-1">
                                    <div className="font-bold text-stone-900">Saturday: 6:00 PM</div>
                                    <div className="text-emerald-900 font-semibold">Anticipated Sunday Holy Mass</div>
                                </div>
                            </div>
                        </div>

                        {/* Confession & Adoration */}
                        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                                <HeartHandshake className="w-5 h-5 text-emerald-800" />
                                <div>
                                    <h3 className="font-bold text-stone-900 text-sm">Reconciliation & Adoration</h3>
                                    <span className="text-[11px] text-stone-400">Sacrament of Penance & Eucharistic Peace</span>
                                </div>
                            </div>
                            <div className="space-y-3 text-xs">
                                <div className="py-1 border-b border-stone-100">
                                    <div className="font-bold text-stone-900">Confessions (Kumpisal)</div>
                                    <div className="text-stone-500">Wednesdays & Fridays: 4:30 PM &ndash; 5:30 PM</div>
                                    <div className="text-stone-500">Saturdays: 4:00 PM &ndash; 5:30 PM</div>
                                </div>
                                <div className="py-1 border-b border-stone-100">
                                    <div className="font-bold text-stone-900">Holy Hour & Adoration</div>
                                    <div className="text-stone-500">Every Thursday: 7:00 PM &ndash; 8:00 PM</div>
                                </div>
                                <div className="py-1">
                                    <div className="font-bold text-stone-900">Emergency Sick Calls (Viaticum)</div>
                                    <div className="text-emerald-900 font-semibold">Available 24/7 for the sick & dying.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GRASSROOTS BEC COMMUNITIES */}
            <section id="bec" className="py-16 bg-white border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                            Grassroots Church Structure
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif">
                            Basic Ecclesial Communities (BECs)
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
                            Our parish is structured around neighborhood clusters (Puroks & Sitios) so no family is left unreached.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {becClusters.map(bec => (
                            <div
                                key={bec.name}
                                className="p-5 bg-stone-50 rounded-2xl border border-stone-200 shadow-2xs space-y-2 hover:bg-emerald-50/50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-xs">
                                    <Users className="w-4 h-4 text-teal-800" />
                                </div>
                                <h3 className="font-bold text-stone-900 text-sm">{bec.name}</h3>
                                <p className="text-xs text-stone-500">
                                    <strong className="text-emerald-900">{bec.families}</strong> families registered
                                </p>
                                <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-200/60">
                                    Weekly bible sharing & family visitation roster
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SACRAMENTS & PARISH SERVICES */}
            <section id="services" className="py-16 bg-[#faf9f5] border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            Ecclesial Ministries
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif">
                            Parish Sacramental Services
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
                            Official guidelines, scheduling, and canonical certificates for your family milestones.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        {/* Baptism */}
                        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                                <Baby className="w-5 h-5 text-blue-700" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-sm">Holy Baptism</h3>
                            <p className="text-stone-600 leading-relaxed">
                                Community baptisms celebrated every Sunday at 11:30 AM. Pre-baptismal catechetical seminar for parents and sponsors on Saturdays at 2:00 PM.
                            </p>
                        </div>

                        {/* Matrimony */}
                        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
                                <HeartHandshake className="w-5 h-5 text-rose-700" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-sm">Marriage & Kasalang Bayan</h3>
                            <p className="text-stone-600 leading-relaxed">
                                Canonical marriage applications accepted 2 months in advance. Free annual Kasalang Bayan mass marriage program held every May for civilly married couples.
                            </p>
                        </div>

                        {/* Certificates */}
                        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                                <Award className="w-5 h-5 text-emerald-700" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-sm">Sacramental Certificates</h3>
                            <p className="text-stone-600 leading-relaxed">
                                Official canonical certificates of Baptism, Confirmation, and First Communion extracted directly from the Parish Registry Books with Pastor seal.
                            </p>
                        </div>

                        {/* Sick Calls */}
                        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                                <HeartPulse className="w-5 h-5 text-amber-700" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-sm">Anointing & Sick Calls</h3>
                            <p className="text-stone-600 leading-relaxed">
                                First Friday Communion rounds for homebound and bedridden elders. Emergency Viaticum and Last Rites priest calls available around the clock.
                            </p>
                        </div>

                        {/* First Communion */}
                        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
                                <Church className="w-5 h-5 text-purple-700" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-sm">First Communion & Confirmation</h3>
                            <p className="text-stone-600 leading-relaxed">
                                Parochial catechetical classes for children (ages 7+) and youth (ages 12+). Annual parish confirmations officiated by the Diocesan Bishop.
                            </p>
                        </div>

                        {/* Mass Intentions */}
                        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2.5">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
                                <Clock className="w-5 h-5 text-stone-700" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-sm">Mass Intentions & Blessings</h3>
                            <p className="text-stone-600 leading-relaxed">
                                Thanksgiving, Healing, and Souls intentions encoded at the parish chancery office before Saturday noon for inclusion in the weekend liturgy roster.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PARISH CHANCERY OFFICE & CONTACT */}
            <section id="office" className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-800" />
                                <h3 className="font-bold text-stone-900 text-sm">Parish Chancery Office</h3>
                            </div>
                            <p className="text-stone-600 leading-relaxed">
                                142 Church Road, Barangay San Isidro
                                <br />
                                Diocese of San Pablo, Philippines
                            </p>
                            <p className="text-stone-600 space-y-1">
                                <span className="block"><strong>Telephone:</strong> (044) 791-2345</span>
                                <span className="block"><strong>Mobile Hotline:</strong> 0917-555-PARISH</span>
                                <span className="block"><strong>Email:</strong> chancery@sanisidroparish.org</span>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-800" />
                                <h3 className="font-bold text-stone-900 text-sm">Chancery Office Hours</h3>
                            </div>
                            <p className="text-stone-600 leading-relaxed">
                                <strong>Tuesday to Saturday:</strong>
                                <br />
                                8:00 AM &ndash; 12:00 NN &bull; 1:30 PM &ndash; 5:00 PM
                            </p>
                            <p className="text-stone-600">
                                <strong>Sunday:</strong> 7:30 AM &ndash; 12:00 NN
                                <br />
                                <span className="text-stone-400">Monday: Closed (Pastoral Rest Day)</span>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                                <h3 className="font-bold text-stone-900 text-sm">Pastoral System Administration</h3>
                            </div>
                            <p className="text-stone-600 leading-relaxed">
                                Designed for family census encoding, Basic Ecclesial Community coordination, and canonical certificate issuance.
                            </p>
                            <div>
                                <Link
                                    href="/prototype"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                                >
                                    <span>Launch Full Prototype Interface</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-stone-200 py-8 bg-[#faf9f5] text-stone-500 text-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Church className="w-4 h-4 text-emerald-800" />
                        <span>&copy; 2026 San Isidro Labrador Parish &bull; Diocese of San Pablo. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <Link href="/prototype" className="text-stone-700 hover:text-emerald-900">
                            Prototype System
                        </Link>
                        <span>&bull;</span>
                        <a href="#schedules" className="text-stone-700 hover:text-emerald-900">
                            Mass Schedules
                        </a>
                        <span>&bull;</span>
                        <a href="#status-check" className="text-stone-700 hover:text-emerald-900">
                            Certificate Tracker
                        </a>
                    </div>
                </div>
            </footer>

            {/* PRINT CERTIFICATE MODAL */}
            {selectedCertForPrint && (
                <CertificatePrintModal
                    isOpen={Boolean(selectedCertForPrint)}
                    onClose={() => setSelectedCertForPrint(null)}
                    certificate={selectedCertForPrint}
                />
            )}
        </div>
    );
}
