<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\FamilyMember;
use App\Models\Household;
use App\Models\ParishOption;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ParishSystemController extends Controller
{
    /**
     * Display the real system public welcome & parish portal page.
     */
    public function welcome(): Response
    {
        $totalHouseholds = Household::count();
        $totalMembers = FamilyMember::count();
        $totalCertificates = Certificate::count();
        $approvedHouseholds = Household::where('status', 'approved')->count();
        $pendingSurveys = Household::where('status', 'pending_review')->count();
        $becClustersCount = Household::distinct('bec_cluster')->count('bec_cluster');

        $sampleCertificates = Certificate::with(['household', 'member'])
            ->select('id', 'certificate_code', 'recipient_name', 'certificate_type', 'status', 'book_no', 'page_no', 'line_no', 'date_of_sacrament', 'created_at', 'minister_name', 'place_of_sacrament')
            ->latest('id')
            ->take(15)
            ->get()
            ->map(fn ($c) => [
                'code' => $c->certificate_code,
                'name' => $c->recipient_name,
                'type' => $c->certificate_type,
                'status' => $c->status,
                'bookNo' => $c->book_no,
                'pageNo' => $c->page_no,
                'lineNo' => $c->line_no,
                'minister' => $c->minister_name ?: 'Rev. Fr. Emmanuel D. Garcia',
                'place' => $c->place_of_sacrament ?: 'San Isidro Labrador Parish Church',
                'dateOfSacrament' => $c->date_of_sacrament ? (string) $c->date_of_sacrament : null,
                'createdAt' => $c->created_at ? $c->created_at->format('M d, Y') : null,
            ]);

        $becClusters = Household::select('bec_cluster', DB::raw('count(*) as count'))
            ->groupBy('bec_cluster')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($b) => [
                'name' => $b->bec_cluster,
                'families' => (int) $b->count,
            ]);

        return Inertia::render('welcome', [
            'stats' => [
                'totalHouseholds' => $totalHouseholds > 0 ? $totalHouseholds : 142,
                'totalMembers' => $totalMembers > 0 ? $totalMembers : 548,
                'totalCertificates' => $totalCertificates > 0 ? $totalCertificates : 89,
                'approvedHouseholds' => $approvedHouseholds > 0 ? $approvedHouseholds : 138,
                'pendingSurveys' => $pendingSurveys,
                'becClustersCount' => max($becClustersCount, 4),
            ],
            'sampleCertificates' => $sampleCertificates,
            'becClusters' => $becClusters,
        ]);
    }

    /**
     * Display the main parish system interface.
     */
    public function index(): Response
    {
        $households = Household::with(['members', 'certificates', 'encodedBy', 'approvedBy'])
            ->latest('id')
            ->get();

        $certificates = Certificate::with(['household', 'member', 'issuedBy'])
            ->latest('id')
            ->get();

        $options = ParishOption::orderBy('sort_order')->orderBy('label')->get()
            ->groupBy('type')
            ->map(fn ($group) => $group->values());

        return Inertia::render('prototype', [
            'initialHouseholds' => $households,
            'initialCertificates' => $certificates,
            'parishOptions' => $options,
        ]);
    }

    /**
     * Display the authenticated Pastor reports dashboard.
     */
    public function dashboard(): Response
    {
        $households = Household::with(['members', 'certificates', 'encodedBy', 'approvedBy'])
            ->latest('id')
            ->get();

        $certificates = Certificate::with(['household', 'member', 'issuedBy'])
            ->latest('id')
            ->get();

        $options = ParishOption::orderBy('sort_order')->orderBy('label')->get()
            ->groupBy('type')
            ->map(fn ($group) => $group->values());

        return Inertia::render('dashboard', [
            'initialHouseholds' => $households,
            'initialCertificates' => $certificates,
            'parishOptions' => $options,
        ]);
    }

    /**
     * Store a newly encoded household survey from a volunteer.
     */
    public function storeHousehold(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'family_name' => ['required', 'string', 'max:255'],
            'head_name' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'barangay' => ['required', 'string', 'max:255'],
            'sitio_purok' => ['required', 'string', 'max:255'],
            'bec_cluster' => ['required', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'mass_frequency' => ['nullable', 'string'],
            'bec_participation' => ['nullable', 'string'],
            'pastoral_needs' => ['nullable', 'array'],
            'volunteer_skills' => ['nullable', 'array'],
            'family_joy' => ['nullable', 'string'],
            'family_concern' => ['nullable', 'string'],
            'how_parish_can_help' => ['nullable', 'string'],
            'consent_given' => ['required', 'boolean'],
            'members' => ['required', 'array', 'min:1'],
            'members.*.full_name' => ['required', 'string', 'max:255'],
            'members.*.relationship' => ['required', 'string'],
            'members.*.sex' => ['nullable', 'string'],
            'members.*.age' => ['nullable', 'integer'],
            'members.*.civil_status' => ['nullable', 'string'],
            'members.*.is_baptized' => ['boolean'],
            'members.*.is_first_communion' => ['boolean'],
            'members.*.is_confirmed' => ['boolean'],
            'members.*.is_church_married' => ['boolean'],
        ]);

        DB::transaction(function () use ($validated) {
            $count = Household::count() + 42;
            $familyCode = sprintf('FAM-2026-%04d', $count);

            $headName = $validated['head_name'] ?: ($validated['members'][0]['full_name'] ?? $validated['family_name']);

            $volunteer = User::where('role', 'volunteer')->first();

            $household = Household::create([
                'family_code' => $familyCode,
                'family_name' => $validated['family_name'],
                'head_name' => $headName,
                'address' => $validated['address'],
                'barangay' => $validated['barangay'],
                'sitio_purok' => $validated['sitio_purok'],
                'bec_cluster' => $validated['bec_cluster'],
                'contact_number' => $validated['contact_number'] ?? null,
                'date_encoded' => now()->toDateString(),
                'status' => 'pending_review',
                'mass_frequency' => $validated['mass_frequency'] ?? 'Every week',
                'bec_participation' => $validated['bec_participation'] ?? 'Regular',
                'pastoral_needs' => $validated['pastoral_needs'] ?? [],
                'volunteer_skills' => $validated['volunteer_skills'] ?? [],
                'family_joy' => $validated['family_joy'] ?? null,
                'family_concern' => $validated['family_concern'] ?? null,
                'how_parish_can_help' => $validated['how_parish_can_help'] ?? null,
                'consent_given' => $validated['consent_given'],
                'encoded_by_id' => $volunteer?->id,
            ]);

            foreach ($validated['members'] as $m) {
                $household->members()->create([
                    'full_name' => $m['full_name'],
                    'relationship' => $m['relationship'] ?? 'Member',
                    'sex' => $m['sex'] ?? 'Male',
                    'age' => $m['age'] ?? 0,
                    'civil_status' => $m['civil_status'] ?? 'Single',
                    'is_baptized' => (bool) ($m['is_baptized'] ?? false),
                    'is_first_communion' => (bool) ($m['is_first_communion'] ?? false),
                    'is_confirmed' => (bool) ($m['is_confirmed'] ?? false),
                    'is_church_married' => (bool) ($m['is_church_married'] ?? false),
                ]);
            }
        });

        return back()->with('success', 'Household survey submitted successfully for Pastor review.');
    }

    /**
     * Pastor review action (Approve or Return for correction).
     */
    public function reviewHousehold(Request $request, Household $household): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:approve,return_for_correction'],
            'correction_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $pastor = User::where('role', 'pastor')->first();

        if ($validated['action'] === 'approve') {
            $household->update([
                'status' => 'approved',
                'correction_notes' => null,
                'approved_by_id' => $pastor?->id,
                'approved_at' => now(),
            ]);
            $msg = "Household {$household->family_name} approved and saved to Parish Registry.";
        } else {
            $household->update([
                'status' => 'returned_for_correction',
                'correction_notes' => $validated['correction_notes'] ?? 'Please review and update member details.',
            ]);
            $msg = "Household {$household->family_name} returned to volunteer for correction.";
        }

        return back()->with('success', $msg);
    }

    /**
     * Parishioner requests a sacramental certificate.
     */
    public function requestCertificate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'household_id' => ['required', 'exists:households,id'],
            'family_member_id' => ['required', 'exists:family_members,id'],
            'certificate_type' => ['required', 'string'],
            'purpose' => ['required', 'string', 'max:255'],
        ]);

        $member = FamilyMember::findOrFail($validated['family_member_id']);
        $code = sprintf('CERT-2026-%03d', Certificate::count() + 1);

        $memberUser = User::where('role', 'parishioner')->first();

        Certificate::create([
            'certificate_code' => $code,
            'household_id' => $validated['household_id'],
            'family_member_id' => $member->id,
            'recipient_name' => $member->full_name,
            'certificate_type' => $validated['certificate_type'],
            'status' => 'pending_review',
            'purpose' => $validated['purpose'],
            'requested_by_id' => $memberUser?->id,
        ]);

        return back()->with('success', "Certificate request submitted for {$member->full_name}.");
    }

    /**
     * Pastor verifies registry book and issues the certificate.
     */
    public function issueCertificate(Request $request, Certificate $certificate): RedirectResponse
    {
        $validated = $request->validate([
            'book_no' => ['required', 'string', 'max:50'],
            'page_no' => ['required', 'string', 'max:50'],
            'line_no' => ['required', 'string', 'max:50'],
            'sponsor_names' => ['required', 'string', 'max:500'],
            'date_of_sacrament' => ['nullable', 'date'],
            'place_of_sacrament' => ['nullable', 'string', 'max:255'],
            'minister_name' => ['nullable', 'string', 'max:255'],
        ]);

        $pastor = User::where('role', 'pastor')->first();

        $certificate->update([
            'status' => 'approved_and_issued',
            'book_no' => $validated['book_no'],
            'page_no' => $validated['page_no'],
            'line_no' => $validated['line_no'],
            'sponsor_names' => $validated['sponsor_names'],
            'date_of_sacrament' => $validated['date_of_sacrament'] ?? ($certificate->date_of_sacrament ?: now()->toDateString()),
            'place_of_sacrament' => $validated['place_of_sacrament'] ?? 'San Isidro Labrador Parish Church',
            'minister_name' => $validated['minister_name'] ?? 'Rev. Fr. Emmanuel D. Garcia',
            'issued_by_id' => $pastor?->id,
            'issued_at' => now(),
        ]);

        return back()->with('success', "Certificate {$certificate->certificate_code} signed and issued successfully.");
    }

    /**
     * Add a new dropdown option (barangay, sitio_purok, or bec_cluster).
     */
    public function storeOption(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:barangay,sitio_purok,bec_cluster'],
            'label' => ['required', 'string', 'max:100'],
        ]);

        $maxOrder = ParishOption::where('type', $validated['type'])->max('sort_order') ?? 0;

        ParishOption::create([
            'type' => $validated['type'],
            'label' => trim($validated['label']),
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', "'{$validated['label']}' added successfully.");
    }

    /**
     * Rename an existing dropdown option.
     */
    public function updateOption(Request $request, ParishOption $parishOption): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:100'],
        ]);

        $parishOption->update(['label' => trim($validated['label'])]);

        return back()->with('success', 'Option updated successfully.');
    }

    /**
     * Delete a dropdown option.
     */
    public function destroyOption(ParishOption $parishOption): RedirectResponse
    {
        $parishOption->delete();

        return back()->with('success', 'Option removed.');
    }
}
