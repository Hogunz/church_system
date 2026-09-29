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
        Schema::create('family_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('relationship'); // Head, Spouse, Son, Daughter, Parent, Relative, Other
            $table->string('sex')->nullable(); // Male, Female
            $table->integer('age')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('civil_status')->nullable();
            $table->boolean('is_baptized')->default(false);
            $table->boolean('is_first_communion')->default(false);
            $table->boolean('is_confirmed')->default(false);
            $table->boolean('is_church_married')->default(false);
            $table->boolean('is_homebound')->default(false);
            $table->string('special_needs')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};
