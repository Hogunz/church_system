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
                'housing_situation' => 'Owned House & Lot',
                'monthly_income' => '₱10,001 – ₱15,000',
                'is_vulnerable' => true,
                'livelihood_assistance_needed' => 'Small capital grant for grocery restocking',
                'date_encoded' => '2026-09-20',
                'status' => 'approved',
                'encoded_by_id' => $volunteer->id,
                'approved_by_id' => $pastor->id,
                'approved_at' => now()->subDays(5),
                'mass_frequency' => 'Every week',
                'bec_participation' => 'Regular',
                'pastoral_needs' => ['Home communion for elderly grandmother', 'Youth catechesis for junior high students'],
                'training_needs' => ['Health Care & First Aid (Midwifery/Nursing)', 'Basic Computer Literacy & Online Jobs'],
                'pastoral_followup' => [
                    'regular_communion' => true,
                    'house_blessing' => true,
                    'counseling' => false,
                    'livelihood_referral' => true,
                ],
                'volunteer_skills' => ['Teaching / Catechesis', 'Choir & Music'],
                'family_joy' => 'Grateful for good health and eldest son graduating high school.',
                'family_concern' => 'Rising prices of basic medicine and groceries for Lola Rosa.',
                'how_parish_can_help' => 'Monthly home visit for Lola Rosa to receive Holy Communion.',
                'consent_given' => true,
            ]
        );

        // Parishioner User linked to Santos Household
        User::updateOrCreate(
            ['email' => 'member@parish.org'],
            [
                'name' => 'Roberto Santos',
                'password' => Hash::make('password'),
                'role' => 'parishioner',
                'household_id' => $santosHousehold->id,
                'email_verified_at' => now(),
            ]
        );

        // Parish Pastoral Council (PPC) User
        User::updateOrCreate(
            ['email' => 'ppc@parish.org'],
            [
                'name' => 'Dra. Elena Bautista',
                'password' => Hash::make('password'),
                'role' => 'ppc',
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
                'occupation' => 'Carpenter / Construction',
                'employment_type' => 'Self-employed / Daily Wage',
                'years_in_service' => '15 years',
                'education' => 'High School Graduate',
                'marital_situation' => 'Canonical Marriage (Church)',
                'marriage_date_parish' => '2005-06-18, San Isidro Labrador Parish',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'parish_ministries' => ['Liturgy & Worship', 'Stewardship'],
                'skills_talents' => ['Carpentry & Repairs', 'Choir & Music'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Maria Santos'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 43,
                'civil_status' => 'Married (Church)',
                'occupation' => 'Sari-sari Store Keeper',
                'employment_type' => 'Self-employed / Informal',
                'years_in_service' => '8 years',
                'education' => 'Vocational / TVET',
                'marital_situation' => 'Canonical Marriage (Church)',
                'marriage_date_parish' => '2005-06-18, San Isidro Labrador Parish',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'parish_ministries' => ['Catechetical Ministry', 'BEC St. Jude Core Team'],
                'skills_talents' => ['Teaching / Catechesis', 'Cooking & Food Service'],
            ]
        );

        $juanSantos = FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Juan Santos'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 12,
                'civil_status' => 'Single',
                'occupation' => 'Junior High Student',
                'education' => 'Elementary Graduate',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'parish_ministries' => ['Altar Server Guild'],
                'skills_talents' => ['Altar Serving', 'Acoustic Guitar'],
            ]
        );

        $sofiaSantos = FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Sofia Santos'],
            [
                'relationship' => 'Daughter',
                'sex' => 'Female',
                'age' => 8,
                'civil_status' => 'Single',
                'occupation' => 'Elementary Student',
                'education' => 'Primary Level',
                'is_baptized' => true,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $santosHousehold->id, 'full_name' => 'Rosa Santos'],
            [
                'relationship' => 'Parent',
                'sex' => 'Female',
                'age' => 78,
                'civil_status' => 'Widowed',
                'occupation' => 'Retired / Senior Parishioner',
                'education' => 'Elementary Graduate',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'is_senior' => true,
                'is_homebound' => true,
                'needs_communion_anointing' => true,
                'needs_pastoral_visit' => true,
                'special_needs' => 'Homebound elderly; stroke recovery; difficulty walking',
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
                'housing_situation' => 'Informal Settler / Danger Zone',
                'monthly_income' => 'Below ₱10,000 (Low income)',
                'is_vulnerable' => true,
                'livelihood_assistance_needed' => 'Livelihood capital for vegetable vending cart',
                'training_needs' => ['Culinary Arts & Food Processing', 'Welding & Electrical Installation'],
                'pastoral_followup' => [
                    'regular_communion' => false,
                    'house_blessing' => true,
                    'counseling' => true,
                    'livelihood_referral' => true,
                ],
                'date_encoded' => '2026-09-24',
                'status' => 'pending_review',
                'encoded_by_id' => $volunteer->id,
                'mass_frequency' => 'Occasionally',
                'bec_participation' => 'Sometimes',
                'pastoral_needs' => ['Sacramental preparation for children', 'Church wedding guidance (Kasalang Bayan)'],
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
                'occupation' => 'Tricycle Driver / Daily Wage',
                'employment_type' => 'Self-employed / Daily Wage',
                'education' => 'High School Level',
                'marital_situation' => 'Civil Marriage Only',
                'marriage_date_parish' => '2019-03-10, City Civil Registrar',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'skills_talents' => ['Carpentry & Maintenance', 'Vehicle Maintenance'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $delaCruzHousehold->id, 'full_name' => 'Teresa Dela Cruz'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 32,
                'civil_status' => 'Civilly Married',
                'occupation' => 'Market Vendor (Vegetables)',
                'employment_type' => 'Self-employed / Informal',
                'education' => 'High School Graduate',
                'marital_situation' => 'Civil Marriage Only',
                'marriage_date_parish' => '2019-03-10, City Civil Registrar',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'skills_talents' => ['Food Processing & Preservation'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $delaCruzHousehold->id, 'full_name' => 'Mateo Dela Cruz'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 3,
                'civil_status' => 'Single',
                'occupation' => 'Toddler',
                'education' => 'None',
                'is_baptized' => false,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
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
                'housing_situation' => 'Living with Extended Family / Relatives',
                'monthly_income' => 'Below ₱10,000 (Low income)',
                'is_vulnerable' => true,
                'livelihood_assistance_needed' => 'Vocational training scholarship for eldest youth',
                'training_needs' => ['Carpentry & Basic Construction', 'Automotive Servicing & Small Engine Repair'],
                'pastoral_followup' => [
                    'regular_communion' => false,
                    'house_blessing' => true,
                    'counseling' => true,
                    'livelihood_referral' => true,
                ],
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
                'occupation' => 'Mason / Construction Helper',
                'employment_type' => 'Contractual / Project-based',
                'education' => 'High School Level',
                'is_baptized' => true,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'needs_pastoral_visit' => true,
                'skills_talents' => ['Carpentry & Maintenance'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $moralesHousehold->id, 'full_name' => 'Gabriel Morales'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 14,
                'civil_status' => 'Single',
                'occupation' => 'Youth',
                'education' => 'Elementary Level',
                'is_out_of_school_youth' => true,
                'is_baptized' => false,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'special_needs' => 'Out-of-school youth; interested in TVET skills scholarship',
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
                'housing_situation' => 'Rented House / Apartment',
                'monthly_income' => '₱15,001 – ₱25,000',
                'is_vulnerable' => false,
                'training_needs' => ['Graphic Design & Digital Marketing', 'Events & Hospitality Management'],
                'pastoral_followup' => [
                    'regular_communion' => true,
                    'house_blessing' => true,
                    'counseling' => false,
                    'livelihood_referral' => false,
                ],
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
                'occupation' => 'Logistics Courier / Rider',
                'employment_type' => 'Contractual / Project-based',
                'education' => 'College Level',
                'marital_situation' => 'Civil Marriage Only',
                'marriage_date_parish' => '2015-08-20, City Hall',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'parish_ministries' => ['Music Ministry / Choir'],
                'skills_talents' => ['Choir & Music', 'Youth Mentorship'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $mendozaHousehold->id, 'full_name' => 'Gina Mendoza'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 36,
                'civil_status' => 'Civilly Married',
                'occupation' => 'Accounting Clerk',
                'employment_type' => 'Employed / Regular Wage',
                'education' => 'College Graduate',
                'marital_situation' => 'Civil Marriage Only',
                'marriage_date_parish' => '2015-08-20, City Hall',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'parish_ministries' => ['Finance & Stewardship Council'],
                'skills_talents' => ['Teaching / Catechesis', 'Finance / Bookkeeping'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $mendozaHousehold->id, 'full_name' => 'Carlo Mendoza'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 10,
                'civil_status' => 'Single',
                'occupation' => 'Elementary Student',
                'education' => 'Elementary Level',
                'is_baptized' => true,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $mendozaHousehold->id, 'full_name' => 'Angel Mendoza'],
            [
                'relationship' => 'Daughter',
                'sex' => 'Female',
                'age' => 1,
                'civil_status' => 'Single',
                'occupation' => 'Infant',
                'education' => 'None',
                'is_baptized' => false,
                'is_first_communion' => false,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
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
                'housing_situation' => 'Owned House & Lot',
                'monthly_income' => '₱25,001 – ₱40,000',
                'is_vulnerable' => true,
                'training_needs' => ['Health Care & First Aid (Midwifery/Nursing)', 'Basic Computer Literacy & Online Jobs'],
                'pastoral_followup' => [
                    'regular_communion' => true,
                    'house_blessing' => false,
                    'counseling' => false,
                    'livelihood_referral' => false,
                ],
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
                'occupation' => 'Government Employee (LGU)',
                'employment_type' => 'Employed / Regular Wage',
                'education' => 'College Graduate',
                'marital_situation' => 'Canonical Marriage (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'parish_ministries' => ['Lector & Commentator Guild'],
                'skills_talents' => ['Public Speaking / Lecturing', 'BEC Leadership'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $floresHousehold->id, 'full_name' => 'Carmen Flores'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 50,
                'civil_status' => 'Married (Church)',
                'occupation' => 'Barangay Health Worker / Nurse',
                'employment_type' => 'Employed / Regular Wage',
                'education' => 'College Graduate',
                'marital_situation' => 'Canonical Marriage (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'parish_ministries' => ['Parish Health Ministry'],
                'skills_talents' => ['Medical / First Aid', 'Teaching / Catechesis'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $floresHousehold->id, 'full_name' => 'Mariano Flores'],
            [
                'relationship' => 'Parent',
                'sex' => 'Male',
                'age' => 82,
                'civil_status' => 'Widowed',
                'occupation' => 'Senior / Bedridden',
                'education' => 'Elementary Level',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'is_senior' => true,
                'is_homebound' => true,
                'needs_communion_anointing' => true,
                'needs_pastoral_visit' => true,
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
                'occupation' => 'Senior High Student',
                'education' => 'High School Level',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => false,
                'is_church_married' => false,
                'needs_sacrament_prep' => true,
                'youth_ministry_involvement' => true,
                'parish_ministries' => ['Parish Youth Ministry (PYM)'],
                'skills_talents' => ['Choir & Music', 'Youth Mentorship'],
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
                'housing_situation' => 'Owned House & Lot',
                'monthly_income' => '₱25,001 – ₱40,000',
                'is_vulnerable' => false,
                'training_needs' => ['Welding & Electrical Installation', 'Carpentry & Basic Construction'],
                'pastoral_followup' => [
                    'regular_communion' => false,
                    'house_blessing' => true,
                    'counseling' => false,
                    'livelihood_referral' => false,
                ],
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
                'occupation' => 'Electrical Contractor / Electrician',
                'employment_type' => 'Self-employed / Licensed',
                'education' => 'Vocational / TVET Graduate',
                'marital_situation' => 'Canonical Marriage (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'parish_ministries' => ['BEC San Pedro Leadership', 'Parish Maintenance Committee'],
                'skills_talents' => ['Carpentry & Maintenance', 'Electrical Installation'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $bautistaHousehold->id, 'full_name' => 'Elena Bautista'],
            [
                'relationship' => 'Spouse',
                'sex' => 'Female',
                'age' => 46,
                'civil_status' => 'Married (Church)',
                'occupation' => 'Dentist / Private Clinic',
                'employment_type' => 'Self-employed / Professional',
                'education' => 'Post-Graduate / Doctorate',
                'marital_situation' => 'Canonical Marriage (Church)',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => true,
                'parish_ministries' => ['Parish Pastoral Council (PPC)', 'Medical/Dental Mission Team'],
                'skills_talents' => ['Medical / First Aid', 'PPC Leadership'],
            ]
        );

        FamilyMember::updateOrCreate(
            ['household_id' => $bautistaHousehold->id, 'full_name' => 'Joshua Bautista'],
            [
                'relationship' => 'Son',
                'sex' => 'Male',
                'age' => 20,
                'civil_status' => 'Single',
                'occupation' => 'Electrician Apprentice',
                'employment_type' => 'Employed / Contractual',
                'education' => 'Vocational / TVET',
                'is_baptized' => true,
                'is_first_communion' => true,
                'is_confirmed' => true,
                'is_church_married' => false,
                'youth_ministry_involvement' => true,
                'parish_ministries' => ['Parish Youth Ministry (PYM)'],
                'skills_talents' => ['Electrical Maintenance', 'Youth Mentorship'],
            ]
        );
    }
}
