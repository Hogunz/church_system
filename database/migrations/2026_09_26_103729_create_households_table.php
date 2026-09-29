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
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->string('family_code')->unique();
            $table->string('family_name');
            $table->string('head_name');
            $table->string('address');
            $table->string('barangay');
            $table->string('sitio_purok');
            $table->string('bec_cluster');
            $table->string('contact_number')->nullable();
            $table->date('date_encoded')->nullable();
            $table->string('status')->default('pending_review'); // pending_review, approved, returned_for_correction
            $table->text('correction_notes')->nullable();
            $table->string('mass_frequency')->nullable();
            $table->string('bec_participation')->nullable();
            $table->json('pastoral_needs')->nullable();
            $table->json('volunteer_skills')->nullable();
            $table->text('family_joy')->nullable();
            $table->text('family_concern')->nullable();
            $table->text('how_parish_can_help')->nullable();
            $table->boolean('consent_given')->default(false);
            $table->foreignId('encoded_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};
