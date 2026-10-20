<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('households', function (Blueprint $table) {
            $table->string('housing_situation')->nullable()->after('contact_number'); // Owned, Rented, Living with extended family
            $table->string('monthly_income')->nullable()->after('housing_situation'); // Below ₱5,000, ₱5,001–₱10,000, etc.
            $table->boolean('is_vulnerable')->default(false)->after('monthly_income');
            $table->string('livelihood_assistance_needed')->nullable()->after('is_vulnerable');
            $table->json('pastoral_followup')->nullable()->after('how_parish_can_help');
            $table->json('training_needs')->nullable()->after('pastoral_followup');
        });

        Schema::table('family_members', function (Blueprint $table) {
            $table->string('occupation')->nullable()->after('civil_status');
            $table->string('employment_type')->nullable()->after('occupation');
            $table->string('years_in_service')->nullable()->after('employment_type');
            $table->string('education')->nullable()->after('years_in_service');
            $table->string('marital_situation')->nullable()->after('education');
            $table->string('marriage_date_parish')->nullable()->after('marital_situation');
            $table->boolean('needs_sacrament_prep')->default(false)->after('is_church_married');
            $table->boolean('is_senior')->default(false)->after('special_needs');
            $table->boolean('is_pwd')->default(false)->after('is_senior');
            $table->string('pwd_details')->nullable()->after('is_pwd');
            $table->boolean('needs_communion_anointing')->default(false)->after('pwd_details');
            $table->boolean('needs_pastoral_visit')->default(false)->after('needs_communion_anointing');
            $table->boolean('is_out_of_school_youth')->default(false)->after('needs_pastoral_visit');
            $table->boolean('youth_ministry_involvement')->default(false)->after('is_out_of_school_youth');
            $table->json('parish_ministries')->nullable()->after('youth_ministry_involvement');
            $table->json('skills_talents')->nullable()->after('parish_ministries');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('households', function (Blueprint $table) {
            $table->dropColumn([
                'housing_situation',
                'monthly_income',
                'is_vulnerable',
                'livelihood_assistance_needed',
                'pastoral_followup',
                'training_needs',
            ]);
        });

        Schema::table('family_members', function (Blueprint $table) {
            $table->dropColumn([
                'occupation',
                'employment_type',
                'years_in_service',
                'education',
                'marital_situation',
                'marriage_date_parish',
                'needs_sacrament_prep',
                'is_senior',
                'is_pwd',
                'pwd_details',
                'needs_communion_anointing',
                'needs_pastoral_visit',
                'is_out_of_school_youth',
                'youth_ministry_involvement',
                'parish_ministries',
                'skills_talents',
            ]);
        });
    }
};
