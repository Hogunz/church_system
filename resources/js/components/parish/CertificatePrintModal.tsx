import React from 'react';
import { X, Printer, Church, ShieldCheck } from 'lucide-react';
import type { CertificateRecord } from '@/types/parish';

interface CertificatePrintModalProps {
    isOpen: boolean;
    onClose: () => void;
    certificate: CertificateRecord | null;
}

export default function CertificatePrintModal({
    isOpen,
    onClose,
    certificate,
}: CertificatePrintModalProps) {
    if (!isOpen || !certificate) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
                {/* Modal Toolbar - Hidden during print */}
                <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-2 text-stone-700">
                        <Church className="w-5 h-5 text-emerald-800" />
                        <span className="font-semibold text-sm">Official Parish Sacramental Certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                            <Printer className="w-4 h-4" />
                            Print Official Extract
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Printable Certificate Content */}
                <div className="p-8 sm:p-12 overflow-y-auto bg-[#faf9f5]">
                    {/* The Certificate Frame */}
                    <div className="border-4 border-double border-stone-700 p-8 sm:p-10 bg-white shadow-xs text-stone-800 font-serif relative">
                        {/* Watermark seal behind */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                            <Church className="w-96 h-96 text-stone-900" />
                        </div>

                        {/* Certificate Header */}
                        <div className="text-center space-y-1.5 border-b-2 border-stone-800 pb-5 mb-6">
                            <div className="flex justify-center items-center gap-2 mb-2">
                                <Church className="w-7 h-7 text-emerald-900" />
                            </div>
                            <p className="text-xs tracking-widest uppercase font-sans font-semibold text-stone-600">
                                Roman Catholic Archdiocese / Diocese
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-emerald-950 font-serif">
                                SAN ISIDRO LABRADOR PARISH
                            </h1>
                            <p className="text-xs font-sans text-stone-600">
                                Parish Office of the Canonical Sacramental Registry
                            </p>
                            <div className="pt-2">
                                <span className="inline-block px-3 py-1 bg-stone-100 text-stone-900 font-sans font-bold text-xs uppercase tracking-wider border border-stone-300">
                                    Official Extract from the Register of {certificate.certificateType}
                                </span>
                            </div>
                        </div>

                        {/* Certificate Number & Registry Metadata Banner */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-3 bg-stone-50 border border-stone-300 text-xs font-sans">
                            <div>
                                <span className="text-stone-500 block text-[10px] uppercase font-bold">Registry Code</span>
                                <span className="font-semibold text-stone-900">{certificate.requestId || certificate.id}</span>
                            </div>
                            <div>
                                <span className="text-stone-500 block text-[10px] uppercase font-bold">Book No.</span>
                                <span className="font-semibold text-stone-900">{certificate.bookNo || 'Book 42'}</span>
                            </div>
                            <div>
                                <span className="text-stone-500 block text-[10px] uppercase font-bold">Page No.</span>
                                <span className="font-semibold text-stone-900">{certificate.pageNo || 'Page 88'}</span>
                            </div>
                            <div>
                                <span className="text-stone-500 block text-[10px] uppercase font-bold">Line No.</span>
                                <span className="font-semibold text-stone-900">{certificate.lineNo || 'Line 12'}</span>
                            </div>
                        </div>

                        {/* Official Register Grid */}
                        <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse border border-stone-300 mb-6">
                            <tbody>
                                <tr className="border-b border-stone-200">
                                    <td className="w-1/3 p-2.5 font-bold bg-stone-100/70 border-r border-stone-300 text-stone-700">
                                        Name of Recipient:
                                    </td>
                                    <td className="p-2.5 font-serif font-bold text-base text-stone-900">
                                        {certificate.recipientName}
                                    </td>
                                </tr>
                                <tr className="border-b border-stone-200">
                                    <td className="p-2.5 font-bold bg-stone-100/70 border-r border-stone-300 text-stone-700">
                                        Sacrament Administered:
                                    </td>
                                    <td className="p-2.5 font-medium text-stone-900">
                                        Holy Sacrament of {certificate.certificateType}
                                    </td>
                                </tr>
                                <tr className="border-b border-stone-200">
                                    <td className="p-2.5 font-bold bg-stone-100/70 border-r border-stone-300 text-stone-700">
                                        Date of Sacrament:
                                    </td>
                                    <td className="p-2.5 text-stone-900">
                                        {certificate.dateOfSacrament || 'June 15, 2014'}
                                    </td>
                                </tr>
                                <tr className="border-b border-stone-200">
                                    <td className="p-2.5 font-bold bg-stone-100/70 border-r border-stone-300 text-stone-700">
                                        Place of Sacrament:
                                    </td>
                                    <td className="p-2.5 text-stone-900">
                                        {certificate.placeOfSacrament || 'San Isidro Labrador Parish Church'}
                                    </td>
                                </tr>
                                <tr className="border-b border-stone-200">
                                    <td className="p-2.5 font-bold bg-stone-100/70 border-r border-stone-300 text-stone-700">
                                        Officiating Minister:
                                    </td>
                                    <td className="p-2.5 text-stone-900 font-medium">
                                        {certificate.ministerName || 'Rev. Fr. Emmanuel D. Garcia'}
                                    </td>
                                </tr>
                                <tr className="border-b border-stone-200">
                                    <td className="p-2.5 font-bold bg-stone-100/70 border-r border-stone-300 text-stone-700">
                                        Sponsors / Godparents:
                                    </td>
                                    <td className="p-2.5 text-stone-800 italic">
                                        {certificate.sponsorNames || 'Juan Dela Cruz & Maria Clara Reyes'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2.5 font-bold bg-stone-100/70 border-r border-stone-300 text-stone-700">
                                        Purpose of Certificate:
                                    </td>
                                    <td className="p-2.5 text-stone-800">
                                        {certificate.purpose || 'Official School & Ecclesial Verification'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Canonical True Copy Statement */}
                        <div className="my-6 p-4 border border-stone-200 bg-stone-50/50 text-xs sm:text-[13px] leading-relaxed text-stone-700 text-center italic font-serif">
                            &ldquo;This is to certify that the foregoing information is an accurate, authentic, and true transcript
                            of the original records extant in the Canonical Register of Sacraments of this Parish.&rdquo;
                        </div>

                        {/* Signatures & Seal Section */}
                        <div className="mt-10 pt-6 grid grid-cols-2 gap-8 items-end">
                            {/* Seal Placeholder */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-24 h-24 rounded-full border-2 border-dashed border-stone-400 flex flex-col items-center justify-center text-center p-2 text-stone-400">
                                    <ShieldCheck className="w-6 h-6 text-emerald-800/40 mb-1" />
                                    <span className="text-[9px] uppercase font-sans font-bold tracking-tight">
                                        Parish Seal Here
                                    </span>
                                </div>
                                <span className="text-[10px] font-sans text-stone-500 mt-2">
                                    Given this {certificate.dateIssued || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            {/* Pastor Signature */}
                            <div className="text-center font-sans">
                                <div className="font-serif italic font-bold text-stone-900 text-sm mb-1">
                                    {certificate.issuedBy || 'Rev. Fr. Emmanuel D. Garcia'}
                                </div>
                                <div className="border-t border-stone-800 pt-1">
                                    <p className="font-bold text-xs uppercase text-stone-800">Parish Priest</p>
                                    <p className="text-[10px] text-stone-500">Sole Issuing Authority</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
