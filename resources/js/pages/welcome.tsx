import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

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
}

export default function Welcome({
    sampleCertificates = [],
}: WelcomeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

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
                dateOfSacrament: '2014-06-15',
            },
            {
                code: 'CERT-2026-002',
                name: 'Sofia Santos',
                type: 'First Communion',
                status: 'pending_review',
                minister: 'Rev. Fr. Emmanuel D. Garcia',
                place: 'San Isidro Labrador Parish Church',
                dateOfSacrament: '2024-05-19',
            },
        ];
    }, [sampleCertificates]);

    const searchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        return certificateRecords.filter(
            (c) =>
                c.code.toLowerCase().includes(q) ||
                c.name.toLowerCase().includes(q)
        );
    }, [searchQuery, certificateRecords]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans">
            <Head title="San Isidro Labrador Parish" />

            {/* SIMPLE PROTOTYPE NOTICE BAR */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs text-slate-600">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">System Prototype Mode:</span>
                        <span>This is a preview of the parish information system.</span>
                    </div>
                    <div className="flex items-center gap-3 font-medium">
                        <span>Test as:</span>
                        <Link href="/prototype?role=volunteer" className="text-blue-700 hover:underline">
                            Volunteer
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/prototype?role=pastor" className="text-emerald-800 hover:underline">
                            Pastor
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/prototype?role=member" className="text-purple-700 hover:underline">
                            Parishioner
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/prototype?role=ppc" className="text-rose-700 hover:underline">
                            Parish Council
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/prototype" className="font-bold text-slate-900 hover:underline">
                            Open Prototype &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* MAIN NAVIGATION */}
            <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
                    <div>
                        <Link href="/" className="text-lg font-bold text-slate-900 tracking-tight">
                            San Isidro Labrador Parish
                        </Link>
                        <p className="text-xs text-slate-500">
                            Diocese of Malolos • Barangay San Isidro
                        </p>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium">
                        <a href="#schedules" className="hover:text-slate-900">
                            Mass Schedule
                        </a>
                        <a href="#services" className="hover:text-slate-900">
                            Parish Services
                        </a>
                        <a href="#status-check" className="hover:text-slate-900">
                            Certificate Status
                        </a>
                        <a href="#contact" className="hover:text-slate-900">
                            Office & Contact
                        </a>
                    </nav>

                    <div>
                        <Link
                            href="/prototype"
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors"
                        >
                            Open Prototype System
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative bg-slate-900 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url('/images/church_facade.jpg')` }}
                />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
                    <div className="max-w-2xl">
                        <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-2">
                            Roman Catholic Parish Portal
                        </p>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                            San Isidro Labrador Parish Church
                        </h1>
                        <p className="mt-4 text-base text-slate-200 leading-relaxed">
                            Serving the community through liturgy, sacramental life, and pastoral care. 
                            Find mass schedules, check sacramental records, or access the parish information system.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/prototype"
                                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
                            >
                                Enter System (Prototype)
                            </Link>
                            <a
                                href="#schedules"
                                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-colors"
                            >
                                View Mass Schedules
                            </a>
                            <a
                                href="#status-check"
                                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-colors"
                            >
                                Check Certificate Request
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* MASS SCHEDULES */}
            <section id="schedules" className="py-14 bg-slate-50 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Mass & Liturgy Schedule
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Regular celebrations at the Main Parish Church.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Sunday */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                                Sunday Masses
                            </h3>
                            <div className="mt-4 space-y-3 text-xs text-slate-600">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-800">6:00 AM</span>
                                    <span>Tagalog (Morning Mass)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-800">8:00 AM</span>
                                    <span>English / Tagalog (High Mass)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-800">10:00 AM</span>
                                    <span>English (Children & Youth)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-800">5:00 PM</span>
                                    <span>Tagalog</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-slate-800">6:30 PM</span>
                                    <span>Tagalog (Youth Mass)</span>
                                </div>
                            </div>
                        </div>

                        {/* Weekday */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                                Weekday Masses & Novenas
                            </h3>
                            <div className="mt-4 space-y-3 text-xs text-slate-600">
                                <div>
                                    <div className="font-semibold text-slate-800">Monday to Saturday: 6:30 AM</div>
                                    <div className="text-slate-500">Daily Morning Mass</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">Wednesday: 5:30 PM</div>
                                    <div className="text-slate-500">Novena of Our Lady of Perpetual Help</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">First Friday: 6:00 PM</div>
                                    <div className="text-slate-500">Sacred Heart of Jesus Holy Mass</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">Saturday: 6:00 PM</div>
                                    <div className="text-slate-500">Anticipated Sunday Mass</div>
                                </div>
                            </div>
                        </div>

                        {/* Confession & Devotions */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                                Confession & Special Liturgies
                            </h3>
                            <div className="mt-4 space-y-3 text-xs text-slate-600">
                                <div>
                                    <div className="font-semibold text-slate-800">Confessions</div>
                                    <div className="text-slate-500">Wednesdays & Fridays: 4:30 PM - 5:30 PM</div>
                                    <div className="text-slate-500">Saturdays: 4:00 PM - 5:30 PM</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">Holy Hour & Adoration</div>
                                    <div className="text-slate-500">Thursdays: 7:00 PM - 8:00 PM</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">Sick Calls (Viaticum)</div>
                                    <div className="text-slate-500">Emergency sick calls available 24/7 via the office hotline.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PARISH SERVICES */}
            <section id="services" className="py-14 bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Parish Sacraments & Services
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Guidelines and schedules for parishioner services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                            <h3 className="font-bold text-sm text-slate-900">Holy Baptism</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Community baptisms every Sunday at 11:30 AM. Pre-baptism seminar is required for parents and godparents on Saturday at 2:00 PM.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                            <h3 className="font-bold text-sm text-slate-900">Marriage & Kasalang Bayan</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Nuptial mass bookings must be submitted at least 2 months in advance. Annual free Kasalang Bayan is held every May for civilly married couples.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                            <h3 className="font-bold text-sm text-slate-900">Sacramental Certificates</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Official baptismal, confirmation, and first communion certificates can be requested through the parish office or online member portal.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                            <h3 className="font-bold text-sm text-slate-900">Mass Intentions</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Intentions for Thanksgiving, Healing, or Repose of the Soul should be submitted at the parish office before Saturday noon.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CERTIFICATE STATUS CHECK */}
            <section id="status-check" className="py-14 bg-slate-50 border-b border-slate-200">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Check Certificate Request Status
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter your reference number to check the processing status of your requested certificate.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setHasSearched(true);
                                    }}
                                    placeholder="Enter Reference (e.g. CERT-2026-001 or name)..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-slate-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Check
                            </button>
                        </form>

                        <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Sample codes to test:</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('CERT-2026-001');
                                    setHasSearched(true);
                                }}
                                className="underline hover:text-slate-800 cursor-pointer"
                            >
                                CERT-2026-001
                            </button>
                            <span>•</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('CERT-2026-002');
                                    setHasSearched(true);
                                }}
                                className="underline hover:text-slate-800 cursor-pointer"
                            >
                                CERT-2026-002
                            </button>
                        </div>

                        {hasSearched && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                {searchResults.length > 0 ? (
                                    <div className="space-y-2">
                                        {searchResults.map((cert) => (
                                            <div
                                                key={cert.code}
                                                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="font-semibold text-slate-900">
                                                        {cert.code} — {cert.name}
                                                    </div>
                                                    <div className="text-slate-500 mt-0.5">
                                                        {cert.type} Certificate • {cert.status === 'approved_and_issued' ? (
                                                            <span className="text-emerald-700 font-medium">Issued (Book {cert.bookNo}, {cert.pageNo})</span>
                                                        ) : (
                                                            <span className="text-amber-700 font-medium">Pending Pastor Review</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link
                                                    href="/prototype?role=member"
                                                    className="text-xs text-blue-700 hover:underline font-medium"
                                                >
                                                    View &rarr;
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-xs text-slate-500">
                                        No records found for "{searchQuery}".
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* PARISH OFFICE & CONTACT */}
            <section id="contact" className="py-14 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-sm text-slate-900 mb-2">Parish Chancery Office</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                142 Church Road, Barangay San Isidro
                                <br />
                                Bulacan, Philippines
                            </p>
                            <p className="text-xs text-slate-600 mt-2">
                                <strong>Telephone:</strong> (044) 791-2345
                                <br />
                                <strong>Email:</strong> office@sanisidroparish.ph
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm text-slate-900 mb-2">Office Hours</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                <strong>Tuesday to Saturday:</strong>
                                <br />
                                8:00 AM – 12:00 NN | 1:30 PM – 5:00 PM
                            </p>
                            <p className="text-xs text-slate-600 mt-2">
                                <strong>Sunday:</strong> 7:30 AM – 12:00 NN
                                <br />
                                <span className="text-slate-400">Monday: Closed (Pastoral Rest)</span>
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm text-slate-900 mb-2">Parish Information System</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Designed for household census encoding, basic ecclesial community coordination, and canonical certificate issuance.
                            </p>
                            <div className="mt-3">
                                <Link
                                    href="/prototype"
                                    className="inline-block text-xs font-semibold text-emerald-800 hover:underline"
                                >
                                    Launch Prototype System &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 py-6 bg-slate-50 text-slate-500 text-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                        © 2026 San Isidro Labrador Parish. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <Link href="/prototype" className="text-slate-600 hover:text-slate-900 font-medium">
                            Prototype Interface
                        </Link>
                        <span>•</span>
                        <a href="#schedules" className="text-slate-600 hover:text-slate-900">
                            Schedules
                        </a>
                        <span>•</span>
                        <a href="#services" className="text-slate-600 hover:text-slate-900">
                            Services
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
