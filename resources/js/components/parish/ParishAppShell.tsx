import React from 'react';
import {
    Church,
    Users,
    FileText,
    CheckCircle2,
    Clock,
    Plus,
    Award,
    Settings,
    BarChart3,
    HeartPulse,
    ShieldAlert,
    ChevronRight,
    ExternalLink,
    HelpCircle,
    Home,
    Sparkles,
} from 'lucide-react';
import type { RoleType } from '@/types/parish';

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number | string | null;
    badgeColor?: string;
}

interface ParishAppShellProps {
    currentRole: RoleType;
    onRoleChange: (role: RoleType) => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
    pendingHouseholdCount: number;
    pendingCertCount: number;
    totalHouseholdsCount: number;
    children: React.ReactNode;
}

export default function ParishAppShell({
    currentRole,
    onRoleChange,
    activeTab,
    onTabChange,
    pendingHouseholdCount,
    pendingCertCount,
    totalHouseholdsCount,
    children,
}: ParishAppShellProps) {
    // Generate role-specific navigation items
    const getSidebarItems = (): SidebarItem[] => {
        switch (currentRole) {
            case 'volunteer':
                return [
                    { id: 'survey', label: 'New Family Survey', icon: Plus },
                    {
                        id: 'submissions',
                        label: 'Encoded Submissions',
                        icon: FileText,
                        badge: totalHouseholdsCount,
                    },
                ];
            case 'pastor':
                return [
                    { id: 'reports', label: 'Pastoral Intelligence', icon: BarChart3 },
                    {
                        id: 'review',
                        label: 'Pending Family Surveys',
                        icon: Clock,
                        badge: pendingHouseholdCount > 0 ? pendingHouseholdCount : null,
                        badgeColor: 'bg-amber-600 text-white',
                    },
                    {
                        id: 'certificates',
                        label: 'Certificate Requests',
                        icon: Award,
                        badge: pendingCertCount > 0 ? pendingCertCount : null,
                        badgeColor: 'bg-emerald-700 text-white',
                    },
                    { id: 'records', label: 'Parish Master Registry', icon: Users },
                    { id: 'settings', label: 'Parish Options & Form Settings', icon: Settings },
                ];
            case 'member':
                return [
                    { id: 'household', label: 'My Household Profile', icon: Home },
                    { id: 'request', label: 'Request Certificate', icon: Plus },
                    { id: 'certificates', label: 'Official Certificates', icon: Award },
                ];
            case 'ppc':
                return [
                    { id: 'overview', label: 'Pastoral Overview', icon: BarChart3 },
                    { id: 'sacraments', label: 'Sacramental Readiness', icon: Church },
                    { id: 'vulnerable', label: 'Sick & Vulnerable Care', icon: HeartPulse },
                    { id: 'stewardship', label: 'Stewardship Charisms', icon: Sparkles },
                    { id: 'bec', label: 'BEC Grassroots Clusters', icon: Users },
                ];
            default:
                return [];
        }
    };

    const sidebarItems = getSidebarItems();

    const getRoleMeta = () => {
        switch (currentRole) {
            case 'volunteer':
                return {
                    name: 'Volunteer Field Encoder',
                    user: 'Ana Ramos (Assigned: Purok 3 / BEC St. Jude)',
                    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    dotClass: 'bg-emerald-500',
                };
            case 'pastor':
                return {
                    name: 'Parish Priest',
                    user: 'Rev. Fr. Emmanuel D. Garcia (Sole Authority)',
                    badgeClass: 'bg-stone-800 text-white border-stone-700',
                    dotClass: 'bg-amber-400',
                };
            case 'member':
                return {
                    name: 'Parishioner Household',
                    user: 'Roberto Santos Family (Verified Household)',
                    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
                    dotClass: 'bg-amber-600',
                };
            case 'ppc':
                return {
                    name: 'Parish Pastoral Council',
                    user: 'Executive Pastoral Planning Board',
                    badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
                    dotClass: 'bg-teal-600',
                };
        }
    };

    const roleMeta = getRoleMeta();

    return (
        <div className="min-h-screen bg-[#faf9f5] text-stone-800 flex flex-col font-sans selection:bg-emerald-200">
            {/* Top Minimalist Header Bar */}
            <header className="h-16 bg-white border-b border-stone-200/80 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
                {/* Brand & Title */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-xs">
                        <Church className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
                                San Isidro Labrador Parish
                            </h1>
                            <span className="hidden md:inline-flex text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                                Pastoral System
                            </span>
                        </div>
                        <p className="text-[11px] text-stone-500 hidden sm:block">
                            Grassroots BEC &bull; Sacraments &bull; Synodality
                        </p>
                    </div>
                </div>

                {/* Right Side: Role Switcher & Actions */}
                <div className="flex items-center gap-3">
                    {/* Role Pill Switcher */}
                    <div className="bg-stone-100/90 p-1 rounded-xl border border-stone-200/90 flex items-center gap-1 text-xs font-medium">
                        <span className="px-2 text-[11px] text-stone-400 font-semibold uppercase tracking-wider hidden lg:inline">
                            Role:
                        </span>
                        {(
                            [
                                { key: 'volunteer' as const, label: 'Volunteer' },
                                { key: 'pastor' as const, label: 'Pastor', badge: pendingHouseholdCount + pendingCertCount },
                                { key: 'member' as const, label: 'Parishioner' },
                                { key: 'ppc' as const, label: 'Council' },
                            ] as Array<{ key: RoleType; label: string; badge?: number }>
                        ).map(item => {
                            const isActive = currentRole === item.key;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => onRoleChange(item.key)}
                                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                                        isActive
                                            ? 'bg-white text-stone-900 font-bold shadow-xs border border-stone-200/60'
                                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-600 text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Link to Public Portal */}
                    <a
                        href="/welcome"
                        className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors"
                        title="View Public Welcome Portal"
                    >
                        <span>Public Portal</span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    </a>
                </div>
            </header>

            {/* Sub-Header Persona Indicator */}
            <div className="bg-stone-50/80 border-b border-stone-200/60 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-stone-500">Active Persona:</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-xs border ${roleMeta.badgeClass}`}>
                        {roleMeta.name}
                    </span>
                    <span className="text-stone-400 hidden sm:inline">&bull;</span>
                    <span className="text-stone-600 font-medium hidden sm:inline">{roleMeta.user}</span>
                </div>
                <div className="text-[11px] text-stone-500">
                    Diocese of San Pablo &bull; Canonical Master Registry
                </div>
            </div>

            {/* Main Application Body with Persistent Left Sidebar */}
            <div className="flex-1 flex overflow-hidden">
                {/* Persistent Sidebar */}
                <aside className="w-64 bg-white border-r border-stone-200/80 shrink-0 hidden md:flex flex-col justify-between p-4">
                    <div className="space-y-6">
                        {/* Section Header */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-3 mb-2">
                                Navigation &bull; {roleMeta.name}
                            </span>
                            <nav className="space-y-1">
                                {sidebarItems.map(item => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => onTabChange(item.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-emerald-900 text-white shadow-xs'
                                                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon
                                                    className={`w-4 h-4 ${
                                                        isActive ? 'text-emerald-300' : 'text-stone-400'
                                                    }`}
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge !== undefined && item.badge !== null && (
                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                        item.badgeColor
                                                            ? item.badgeColor
                                                            : isActive
                                                            ? 'bg-emerald-700 text-white'
                                                            : 'bg-stone-100 text-stone-600'
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Sidebar Box: Church Pastoral Help */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-stone-800 font-semibold">
                            <Church className="w-4 h-4 text-emerald-800" />
                            <span>Pastoral Guidance</span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                            {currentRole === 'volunteer' &&
                                'Ensure Informed Consent is confirmed before saving family records.'}
                            {currentRole === 'pastor' &&
                                'Only the Pastor has canonical authority to issue sacramental certificates.'}
                            {currentRole === 'member' &&
                                'Parishioners can only request certificates for verified household members.'}
                            {currentRole === 'ppc' &&
                                'Aggregated parish statistics guide the 3 Pastoral Commissions.'}
                        </p>
                    </div>
                </aside>

                {/* Main Content Scroll Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
