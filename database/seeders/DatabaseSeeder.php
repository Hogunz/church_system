<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\FamilyMember;
use App\Models\Household;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Core Users
        $pastor = User::updateOrCreate(
            ['email' => 'pastor@parish.org'],
            [
                'name' => 'Rev. Fr. Emmanuel D. Garcia',
                'password' => Hash::make('password'),
                'role' => 'pastor',
                'email_verified_at' => now(),
            ]
        );

        $volunteer = User::updateOrCreate(
            ['email' => 'volunteer@parish.org'],
            [
                'name' => 'Ana Ramos',
                'password' => Hash::make('password'),
                'role' => 'volunteer',
                'email_verified_at' => now(),
            ]
        );

        // 2. Household 1: Santos Family (Approved)
        $santosHousehold = Household::updateOrCreate(
            ['family_code' => 'FAM-2026-0042'],
            [
                'family_name' => 'Santos',
                'head_name' => 'Roberto Santos',
                'address' => '142 Rizal Street',
                'barangay' => 'San Isidro',
                'sitio_purok' => 'Purok 3',
                'bec_cluster' => 'BEC St. Jude',
                'contact_number' => '0917-555-1234',
                'date_encoded' => '2026-09-20',
                'status' => 'approved',
                'encoded_by_id' => $volunteer->id,
                'approved_by_id' => $pastor->id,
                'approved_at' => now()->subDays(5),
                'mass_frequency' => 'Every week',
                'bec_participation' => 'Regular',
                'pastoral_needs' => ['Home communion for elderly grandmother'],
                'volunteer_skills' => ['Teaching / Catechesis', 'Choir & Music'],
                'family_joy' => 'Grateful for good health and eldest son graduating high school.',
                'family_concern' => 'Rising prices of basic medicine and groceries.',
                'how_parish_can_help' => 'Monthly home visit for Lola Rosa to receive Holy Communion.',
                'consent_given' => true,
            ]
        );

        // Parishioner User linked to Santos Household
        User::updateOrCreate(
            ['email' => 'member@parish.org'],
            [
                'name' => 'Maria Santos',
                'password' => Hash::make('password'),
                'role' => 'parishioner',
                'household_id' => $santosHousehold->id,
                'email_verified_at' => now(),
            ]
        );

        // Members of Santos
        FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Roberto Santos'],
            [
                'relationship' => 'Head',
                'sex' => 'Male',
                'age' => 45,
                'civil_status' => 'Married (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Maria Santos'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 43,
                'civil_status' => 'Married (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
            ]
        );

        $juanSantos = FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Juan Santos'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 12,
                'civil_status' => 'Single',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        $sofiaSantos = FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Sofia Santos'],
            [
                'relationship' => 'Daughter',
                'sex' => 'Female',
                'age' => 8,
                'civil_status' => 'Single',
                'is_baptized' => true,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Rosa Santos'],
            [
                'relationship' => 'Parent',
                'sex' => 'Female',
                'age' => 78,
                'civil_status' => 'Widowed',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'is_homebound' => true,
                'special_needs' => 'Homebound elderly; difficulty walking',
            ]
        );

        // Certificates for Santos Family
        Certificate::updateOrCreate(
            ['certificate_code' => 'CERT-2026-001'],
            [
                'household_id' => $santosHousehold->id,
                'family_member_id' => $juanSantos->id,
                'recipient_name' => 'Juan Santos',
                'certificate_type' => 'Baptismal',
                'status' => 'approved_and_issued',
                'purpose' => 'School Enrollment & First Communion Verification',
                'date_of_sacrament' => '2014-10-14',
                'place_of_sacrament' => 'San Isidro Labrador Parish Church',
                'minister_name' => 'Rev. Fr. Emmanuel D. Garcia',
                'book_no' => 'XIV',
                'page_no' => '88',
                'line_no' => '12',
                'sponsor_names' => 'Carlos Ramos & Elena Gutierrez',
                'issued_by_id' => $pastor->id,
                'issued_at' => now()->subDays(4),
            ]
        );

        Certificate::updateOrCreate(
            ['certificate_code' => 'CERT-2026-002'],
            [
                'household_id' => $santosHousehold->id,
                'family_member_id' => $sofiaSantos->id,
                'recipient_name' => 'Sofia Santos',
                'certificate_type' => 'Baptismal',
                'status' => 'pending_review',
                'purpose' => 'First Holy Communion Class Requirement',
                'date_of_sacrament' => '2018-05-19',
                'place_of_sacrament' => 'San Isidro Labrador Parish Church',
                'minister_name' => 'Rev. Fr. Emmanuel D. Garcia',
                'book_no' => 'XVI',
                'page_no' => '45',
                'line_no' => '06',
                'sponsor_names' => 'Miguel Perez & Carmela Ramos',
            ]
        );

        // 3. Household 2: Dela Cruz Family (Pending Review)
        $delaCruzHousehold = Household::updateOrCreate(
            ['family_code' => 'FAM-2026-0043'],
            [
                'family_name' => 'Dela Cruz',
                'head_name' => 'Eduardo Dela Cruz',
                'address' => '77 Sampaguita Lane',
                'barangay' => 'San Isidro',
                'sitio_purok' => 'Purok 1',
                'bec_cluster' => 'BEC San Pedro',
                'contact_number' => '0928-888-4321',
                'date_encoded' => '2026-09-24',
                'status' => 'pending_review',
                'encoded_by_id' => $volunteer->id,
                'mass_frequency' => 'Occasionally',
                'bec_participation' => 'Sometimes',
                'pastoral_needs' => ['Sacramental preparation for children', 'Church wedding guidance'],
                'volunteer_skills' => ['Carpentry & Repairs'],
                'family_joy' => 'New baby born healthy last month.',
                'family_concern' => 'Seasonal farming income uncertainty.',
                'how_parish_can_help' => 'Assistance for civil marriage regularization (Kasalang Bayan) and baptism for infant.',
                'consent_given' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $delaCruzHousehold->id, 'full_name' => 'Eduardo Dela Cruz'],
            [
                'relationship' => 'Head',
                'sex' => 'Male',
                'age' => 34,
                'civil_status' => 'Civilly Married',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $delaCruzHousehold->id, 'full_name' => 'Teresa Dela Cruz'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 32,
                'civil_status' => 'Civilly Married',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => false,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $delaCruzHousehold->id, 'full_name' => 'Mateo Dela Cruz'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 3,
                'civil_status' => 'Single',
                'is_baptized' => false,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        // 4. Household 3: Morales Family (Returned for Correction)
        $moralesHousehold = Household::updateOrCreate(
            ['family_code' => 'FAM-2026-0044'],
            [
                'family_name' => 'Morales',
                'head_name' => 'Carmelo Morales',
                'address' => 'Block 4 Lot 9, Riverside',
                'barangay' => 'San Isidro',
                'sitio_purok' => 'Purok 4',
                'bec_cluster' => 'BEC St. Jude',
                'contact_number' => '0919-222-3344',
                'date_encoded' => '2026-09-22',
                'status' => 'returned_for_correction',
                'correction_notes' => 'Please clarify date of birth for eldest child and confirm if Father Carmelo is open to home visit.',
                'encoded_by_id' => $volunteer->id,
                'mass_frequency' => 'Rarely / Never',
                'bec_participation' => 'Not active',
                'pastoral_needs' => ['Pastoral home visit', 'Youth catechesis'],
                'volunteer_skills' => [],
                'family_joy' => 'Children doing well in public school.',
                'family_concern' => 'Flooding in riverside area during monsoon rains.',
                'how_parish_can_help' => 'Visit from the parish team or BEC leaders.',
                'consent_given' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $moralesHousehold->id, 'full_name' => 'Carmelo Morales'],
            [
                'relationship' => 'Head',
                'sex' => 'Male',
                'age' => 41,
                'civil_status' => 'Single',
                'is_baptized' => true,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $moralesHousehold->id, 'full_name' => 'Gabriel Morales'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 14,
                'civil_status' => 'Single',
                'is_baptized' => false,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        // 5. Household 4: Mendoza Family (Approved, Kasalang Bayan candidate)
        $mendozaHousehold = Household::updateOrCreate(
            ['family_code' => 'FAM-2026-0045'],
            [
                'family_name' => 'Mendoza',
                'head_name' => 'Ramon Mendoza',
                'address' => '88 Mabini Street',
                'barangay' => 'San Isidro',
                'sitio_purok' => 'Purok 2',
                'bec_cluster' => 'BEC San Lorenzo',
                'contact_number' => '0918-777-6543',
                'date_encoded' => '2026-09-25',
                'status' => 'approved',
                'encoded_by_id' => $volunteer->id,
                'approved_by_id' => $pastor->id,
                'approved_at' => now()->subDays(2),
                'mass_frequency' => 'Every week',
                'bec_participation' => 'Regular',
                'pastoral_needs' => ['Sacramental preparation for children', 'Church wedding assistance (Kasalang Bayan)'],
                'volunteer_skills' => ['Choir & Music', 'Youth Mentorship'],
                'family_joy' => 'Children are healthy and doing great in school.',
                'family_concern' => 'Need legal and church guidance to regularize civil marriage.',
                'how_parish_can_help' => 'Kasalang Bayan marriage seminar and baptism for our baby.',
                'consent_given' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $mendozaHousehold->id, 'full_name' => 'Ramon Mendoza'],
            [
                'relationship' => 'Head',
                'sex' => 'Male',
                'age' => 38,
                'civil_status' => 'Civilly Married',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $mendozaHousehold->id, 'full_name' => 'Gina Mendoza'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 36,
                'civil_status' => 'Civilly Married',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => false,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $mendozaHousehold->id, 'full_name' => 'Carlo Mendoza'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 10,
                'civil_status' => 'Single',
                'is_baptized' => true,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $mendozaHousehold->id, 'full_name' => 'Angel Mendoza'],
            [
                'relationship' => 'Daughter',
                'sex' => 'Female',
                'age' => 1,
                'civil_status' => 'Single',
                'is_baptized' => false,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        // 6. Household 5: Flores Family (Approved, Homebound Senior)
        $floresHousehold = Household::updateOrCreate(
            ['family_code' => 'FAM-2026-0046'],
            [
                'family_name' => 'Flores',
                'head_name' => 'Lito Flores',
                'address' => '22 Ilang-Ilang St.',
                'barangay' => 'San Isidro',
                'sitio_purok' => 'Purok 3',
                'bec_cluster' => 'BEC St. Jude',
                'contact_number' => '0920-333-8899',
                'date_encoded' => '2026-09-26',
                'status' => 'approved',
                'encoded_by_id' => $volunteer->id,
                'approved_by_id' => $pastor->id,
                'approved_at' => now()->subDays(1),
                'mass_frequency' => 'Every week',
                'bec_participation' => 'Regular',
                'pastoral_needs' => ['Home communion for elderly / sick', 'Pastoral home visit by Parish team'],
                'volunteer_skills' => ['Medical / First Aid', 'Teaching / Catechesis'],
                'family_joy' => 'Grateful for wife passing nurse licensing and serving the clinic.',
                'family_concern' => 'Tatay Mariano is bedridden and cannot walk to church.',
                'how_parish_can_help' => 'Monthly home communion and anointing of the sick for Tatay Mariano.',
                'consent_given' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $floresHousehold->id, 'full_name' => 'Lito Flores'],
            [
                'relationship' => 'Head',
                'sex' => 'Male',
                'age' => 52,
                'civil_status' => 'Married (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $floresHousehold->id, 'full_name' => 'Carmen Flores'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 50,
                'civil_status' => 'Married (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $floresHousehold->id, 'full_name' => 'Mariano Flores'],
            [
                'relationship' => 'Parent',
                'sex' => 'Male',
                'age' => 82,
                'civil_status' => 'Widowed',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'is_homebound' => true,
                'special_needs' => 'Bedridden senior; stroke survivor needing Viaticum',
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $floresHousehold->id, 'full_name' => 'Paolo Flores'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 17,
                'civil_status' => 'Single',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
            ]
        );

        // 7. Household 6: Bautista Family (Approved, BEC Leader)
        $bautistaHousehold = Household::updateOrCreate(
            ['family_code' => 'FAM-2026-0047'],
            [
                'family_name' => 'Bautista',
                'head_name' => 'Noel Bautista',
                'address' => '56 MacArthur Highway',
                'barangay' => 'San Isidro',
                'sitio_purok' => 'Purok 5',
                'bec_cluster' => 'BEC San Pedro',
                'contact_number' => '0917-888-9900',
                'date_encoded' => '2026-09-27',
                'status' => 'approved',
                'encoded_by_id' => $volunteer->id,
                'approved_by_id' => $pastor->id,
                'approved_at' => now()->subDay(),
                'mass_frequency' => 'Every week',
                'bec_participation' => 'Regular',
                'pastoral_needs' => ['Pastoral home visit by Parish team'],
                'volunteer_skills' => ['BEC Leader / Coordinator', 'Carpentry & Maintenance', 'Teaching / Catechesis'],
                'family_joy' => 'Son Joshua successfully completed vocational electrical training.',
                'family_concern' => 'Need more active volunteers for local purok chapel upkeep.',
                'how_parish_can_help' => 'Blessing of our house and family workshop.',
                'consent_given' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $bautistaHousehold->id, 'full_name' => 'Noel Bautista'],
            [
                'relationship' => 'Head',
                'sex' => 'Male',
                'age' => 48,
                'civil_status' => 'Married (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $bautistaHousehold->id, 'full_name' => 'Elena Bautista'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 46,
                'civil_status' => 'Married (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $bautistaHousehold->id, 'full_name' => 'Joshua Bautista'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 19,
                'civil_status' => 'Single',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => false,
            ]
        );
    }
}
