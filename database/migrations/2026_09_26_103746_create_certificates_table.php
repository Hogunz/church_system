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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_code')->unique();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->foreignId('family_member_id')->constrained('family_members')->cascadeOnDelete();
            $table->string('recipient_name');
            $table->string('certificate_type')->default('Baptismal'); // Baptismal, Confirmation, First Communion, Marriage
            $table->string('status')->default('pending_review'); // pending_review, approved_and_issued, declined
            $table->string('purpose');
            $table->date('date_of_sacrament')->nullable();
            $table->string('place_of_sacrament')->nullable();
            $table->string('minister_name')->nullable();
            $table->string('book_no')->nullable();
            $table->string('page_no')->nullable();
            $table->string('line_no')->nullable();
            $table->text('sponsor_names')->nullable();
            $table->foreignId('requested_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('issued_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('issued_at')->nullable();
            $table->text('decline_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
