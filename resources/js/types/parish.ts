export interface FamilyMember {
    id: string;
    dbId?: number;
    fullName: string;
    relationship: 'Head' | 'Spouse' | 'Son' | 'Daughter' | 'Parent' | 'Relative' | 'Other';
    sex: 'Male' | 'Female';
    age: number;
    birthdate?: string;
    civilStatus: 'Single' | 'Married (Church)' | 'Civilly Married' | 'Cohabiting' | 'Widowed' | 'Separated';
    occupation?: string;
    employmentType?: string;
    yearsInService?: string;
    education?: string;
    maritalSituation?: string;
    marriageDateParish?: string;
    isBaptized: boolean;
    isFirstCommunion: boolean;
    isConfirmed: boolean;
    isChurchMarried: boolean;
    needsSacramentPrep?: boolean;
    isHomebound?: boolean;
    specialNeeds?: string;
    isSenior?: boolean;
    isPwd?: boolean;
    pwdDetails?: string;
    needsCommunionAnointing?: boolean;
    needsPastoralVisit?: boolean;
    isOutOfSchoolYouth?: boolean;
    youthMinistryInvolvement?: boolean;
    parishMinistries?: string[];
    skillsTalents?: string[];
}

export interface Household {
    id: string;
    dbId?: number;
    familyName: string;
    headName: string;
    address: string;
    barangay: string;
    sitioPurok: string;
    becCluster: string;
    contactNumber: string;
    housingSituation?: string;
    monthlyIncome?: string;
    isVulnerable?: boolean;
    livelihoodAssistanceNeeded?: string;
    pastoralFollowup?: {
        homeVisits?: boolean;
        referral?: string;
        assistanceProvided?: string;
        sacramentalFollowup?: boolean;
        ministryResponsible?: string;
        nextPastoralAction?: string;
    };
    trainingNeeds?: string[];
    dateEncoded: string;
    status: 'Pending Review' | 'Approved' | 'Returned for Correction';
    correctionNote?: string;
    encodedBy: string;
    members: FamilyMember[];
    massFrequency: 'Every week' | 'Almost every week' | 'Occasionally' | 'Rarely / Never';
    becParticipation: 'Regular' | 'Sometimes' | 'Rarely' | 'Not active';
    pastoralNeeds: string[];
    volunteerSkills: string[];
    familyJoy: string;
    familyConcern: string;
    howParishCanHelp: string;
    consentGiven: boolean;
}

export interface CertificateRecord {
    id: string;
    dbId?: number;
    requestId: string;
    recipientName: string;
    familyId: string;
    householdDbId?: number;
    certificateType: 'Baptismal' | 'Confirmation' | 'First Communion';
    dateOfSacrament: string;
    placeOfSacrament: string;
    ministerName: string;
    bookNo: string;
    pageNo: string;
    lineNo: string;
    sponsorNames: string;
    purpose: string;
    dateIssued?: string;
    status: 'Pending Review' | 'Approved & Issued' | 'Declined';
    issuedBy?: string;
    declineReason?: string;
}

export type RoleType = 'volunteer' | 'pastor' | 'member' | 'ppc';

export interface ParishOptionItem {
    id: number;
    type: string;
    label: string;
    sort_order?: number;
}
