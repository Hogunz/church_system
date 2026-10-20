import { Form, Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Church,
    ClipboardCheck,
    Users,
    BarChart3,
    CheckCircle2,
    Lock,
    Mail,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    ExternalLink,
    ChevronRight,
    Info,
    Check,
    Wheat,
} from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

interface MockUser {
    id: string;
    role: 'pastor' | 'volunteer' | 'member' | 'ppc';
    roleTitle: string;
    name: string;
    email: string;
    password: string;
    badge: string;
    badgeColor: string;
    description: string;
    keyDuty: string;
    icon: React.ComponentType<{ className?: string }>;
    prototypeUrl: string;
}

const MOCK_USERS: MockUser[] = [
    {
        id: 'pastor',
        role: 'pastor',
        roleTitle: 'Parish Priest',
        name: 'Rev. Fr. Emmanuel D. Garcia',
        email: 'pastor@parish.org',
        password: 'password',
        badge: 'Sole Authority & Approver',
        badgeColor: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
        description: 'Parish executive with exclusive authority to review surveys, approve master household registries, and sign/issue sacramental certificates.',
        keyDuty: 'Issues official Baptismal/Confirmation certificates & reviews BEC censuses',
        icon: Church,
        prototypeUrl: '/prototype?role=pastor',
    },
    {
        id: 'volunteer',
        role: 'volunteer',
        roleTitle: 'Volunteer Field Encoder',
        name: 'Mark Villanueva',
        email: 'volunteer@parish.org',
        password: 'password',
        badge: 'BEC Field Coordinator',
        badgeColor: 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30',
        description: 'Grassroots volunteer visiting assigned Sitios and BEC clusters to conduct 4-step family interviews, pastoral listening, and sacramental flags.',
        keyDuty: 'Encodes household surveys, listening notes & charisms',
        icon: ClipboardCheck,
        prototypeUrl: '/prototype?role=volunteer',
    },
    {
        id: 'member',
        role: 'member',
        roleTitle: 'Parishioner (Household Head)',
        name: 'Roberto Santos',
        email: 'member@parish.org',
        password: 'password',
        badge: 'Household Self-Service',
        badgeColor: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30',
        description: 'Registered head of the Santos family (Brgy. San Isidro). Can view verified records of own family and submit official certificate requests.',
        keyDuty: 'Requests sacramental certificates & views verified family records',
        icon: Users,
        prototypeUrl: '/prototype?role=member',
    },
    {
        id: 'ppc',
        role: 'ppc',
        roleTitle: 'Parish Pastoral Council',
        name: 'Dra. Elena Bautista',
        email: 'ppc@parish.org',
        password: 'password',
        badge: 'Planning & Synodality',
        badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
        description: 'Council officer coordinating pastoral programs. Views aggregated community demographics and parishioner charisms without confidential notes.',
        keyDuty: 'Monitors community statistics & sacramental readiness backlogs',
        icon: BarChart3,
        prototypeUrl: '/prototype?role=ppc',
    },
];

export default function Login({ status, canResetPassword }: Props) {
    const [selectedRole, setSelectedRole] = useState<'pastor' | 'volunteer' | 'member' | 'ppc'>('pastor');
    const [email, setEmail] = useState('pastor@parish.org');
    const [password, setPassword] = useState('password');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(
        'Ready: Fr. Emmanuel Garcia credentials pre-loaded.'
    );

    const activeUser = MOCK_USERS.find((u) => u.role === selectedRole) || MOCK_USERS[0];

    const handleSelectMock = (mock: MockUser) => {
        setSelectedRole(mock.role);
        setEmail(mock.email);
        setPassword(mock.password);
        setFeedbackMessage(`Pre-filled ${mock.roleTitle} credentials (${mock.email})`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col lg:flex-row antialiased selection:bg-emerald-500 selection:text-white">
            <Head title="Sign In — San Isidro Labrador Parish Portal" />

            <PasskeyVerify />

            {/* LEFT COLUMN: HERO & BRAND STORY (Ecclesiastical Visual Experience) */}
            <div className="relative lg:w-1/2 min-h-[460px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-slate-950 text-white">
                {/* Background Church Imagery with Deep Emerald & Slate Vignette */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url('/images/church_facade.jpg')` }}
                />
                {/* Multi-layered gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-slate-950/90 to-zinc-950/95 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

                {/* Subtle liturgical golden glow */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* TOP BAR / BRAND HEADER */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group flex items-center gap-3.5 transition-all"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-950/50 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
                            <Wheat className="w-5 h-5 text-amber-200" />
                        </div>
                        <div>
                            <div className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                                San Isidro Labrador Parish
                            </div>
                            <div className="text-xs text-emerald-200/80 font-sans tracking-wide">
                                Diocese of Malolos • Brgy. San Isidro
                            </div>
                        </div>
                    </Link>

                    {/* Prototype Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-emerald-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span className="font-semibold tracking-wide">Interactive Prototype</span>
                    </div>
                </div>

                {/* CENTER CONTENT: THEOLOGICAL & PASTORAL PURPOSE */}
                <div className="relative z-10 my-10 max-w-lg space-y-6">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Pastoral Mission & Family Census System
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                        Serving the Faithful with Synodality & Care
                    </h1>

                    <p className="text-slate-300 text-base leading-relaxed">
                        A living registry empowering our parish community—connecting grassroots Basic Ecclesial Communities (BECs), sacramental milestones, pastoral visitations, and official certificates.
                    </p>

                    {/* 3 Core System Pillars */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 transition-colors">
                            <div className="text-amber-300 font-semibold text-xs mb-1">
                                01. Grassroots
                            </div>
                            <div className="text-xs text-slate-200">
                                BEC Clusters, Sitio Mapping & Census
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 transition-colors">
                            <div className="text-emerald-300 font-semibold text-xs mb-1">
                                02. Sacraments
                            </div>
                            <div className="text-xs text-slate-200">
                                Verified Records, Page & Book Registry
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 transition-colors">
                            <div className="text-purple-300 font-semibold text-xs mb-1">
                                03. Stewardship
                            </div>
                            <div className="text-xs text-slate-200">
                                Parishioner Talents, Gifts & Home Visits
                            </div>
                        </div>
                    </div>
                </div>

                {/* SCRIPTURE QUOTE FOOTER */}
                <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="italic font-serif text-slate-300">
                        &ldquo;For where two or three are gathered in my name, there am I among them.&rdquo;
                        <span className="not-italic text-emerald-400 font-sans ml-2 font-medium">— Matthew 18:20</span>
                    </div>
                    <div className="text-slate-400 text-xs">
                        Official Parish Portal
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE LOGIN & MOCK USER SELECTOR */}
            <div className="relative lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto">
                <div className="max-w-md w-full mx-auto space-y-7">
                    
                    {/* TOP ACTION: BACK TO PUBLIC WEBSITE */}
                    <div className="flex items-center justify-between text-xs">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400 font-medium transition-colors"
                        >
                            &larr; Back to Public Parish Website
                        </Link>
                        <Link
                            href="/prototype"
                            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                        >
                            Open Sandbox Directly &rarr;
                        </Link>
                    </div>

                    {/* FORM TITLE & SUBTITLE */}
                    <div className="space-y-1.5">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Parish Portal Sign In
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-zinc-400">
                            Select a mock user below to test a role or enter custom parish credentials.
                        </p>
                    </div>

                    {/* PROTOTYPE PERSONA QUICK-PICKER SECTION */}
                    <div className="space-y-3 rounded-2xl bg-slate-100 dark:bg-zinc-900/80 p-4 border border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                Prototype Mock Personas (1-Click Fill)
                            </span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                4 Roles Ready
                            </span>
                        </div>

                        {/* MOCK USER CARDS (GRID OF 4 PERSONAS) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {MOCK_USERS.map((user) => {
                                const IconComponent = user.icon;
                                const isSelected = selectedRole === user.role;

                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => handleSelectMock(user)}
                                        className={`group relative text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                                            isSelected
                                                ? 'bg-white dark:bg-zinc-800 border-emerald-600 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                                                : 'bg-white/60 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-700/60 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                                        isSelected
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors'
                                                    }`}
                                                >
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-zinc-100 line-clamp-1">
                                                        {user.roleTitle}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-100 dark:border-zinc-700/50">
                                            <span className="font-mono">{user.email}</span>
                                            <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                                Auto-fill &rarr;
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* ACTIVE PERSONA SUMMARY & QUICK PROTOTYPE BYPASS */}
                        <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${activeUser.badgeColor}`}>
                                    {activeUser.badge}
                                </span>
                                <span className="text-[11px] text-slate-600 dark:text-zinc-400 truncate max-w-[220px]">
                                    {activeUser.keyDuty}
                                </span>
                            </div>

                            <Link
                                href={activeUser.prototypeUrl}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline shrink-0"
                            >
                                Launch Prototype Directly
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {feedbackMessage && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{feedbackMessage}</span>
                        </div>
                    )}

                    {status && (
                        <div className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium text-center">
                            {status}
                        </div>
                    )}

                    {/* MAIN FORM */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    {/* Email Field */}
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="email"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Parish Email Address
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="email"
                                                placeholder="pastor@parish.org"
                                                className="pl-10 h-11 rounded-xl bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 focus:border-emerald-600 focus:ring-emerald-500/20 text-sm shadow-xs"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label
                                                htmlFor="password"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoComplete="current-password"
                                                placeholder="••••••••••••"
                                                className="pl-10 h-11 rounded-xl bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 focus:border-emerald-600 focus:ring-emerald-500/20 text-sm shadow-xs"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember Me Checkbox */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center space-x-2.5">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                defaultChecked
                                            />
                                            <Label
                                                htmlFor="remember"
                                                className="text-xs font-medium text-slate-600 dark:text-zinc-400 cursor-pointer"
                                            >
                                                Keep me signed in on this device
                                            </Label>
                                        </div>

                                        <span className="text-[11px] text-slate-400">
                                            SSL 256-Bit Encrypted
                                        </span>
                                    </div>

                                    {/* PRIMARY SUBMIT BUTTON */}
                                    <Button
                                        type="submit"
                                        className="mt-2 w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="w-4 h-4 mr-2" />
                                                Authenticating...
                                            </>
                                        ) : (
                                            <>
                                                <span>Sign In as {activeUser.roleTitle}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* ALTERNATIVE: QUICK PROTOTYPE ENTRY BUTTON */}
                                <div className="pt-2 text-center">
                                    <Link
                                        href={activeUser.prototypeUrl}
                                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-emerald-600/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-medium transition-colors"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Bypass Auth &bull; Enter Prototype as <strong>{activeUser.name}</strong></span>
                                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                                    </Link>
                                </div>

                                {/* SIGN UP LINK */}
                                <div className="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2">
                                    Need to register a new household volunteer or parishioner?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={6}
                                        className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                                    >
                                        Create Account
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>

                    {/* SECURITY & PRIVACY FOOTER */}
                    <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Diocese of Malolos Pastoral Data Safeguards</span>
                        </div>
                        <div>
                            <span>Canonical &bull; Confidential</span>
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="text-center text-[11px] text-slate-400 dark:text-zinc-600 mt-8">
                    &copy; {new Date().getFullYear()} San Isidro Labrador Parish. All rights reserved.
                </div>
            </div>
        </div>
    );
}
