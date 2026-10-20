<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'household_id',
    'full_name',
    'relationship',
    'sex',
    'age',
    'birthdate',
    'civil_status',
    'occupation',
    'employment_type',
    'years_in_service',
    'education',
    'marital_situation',
    'marriage_date_parish',
    'is_baptized',
    'is_first_communion',
    'is_confirmed',
    'is_church_married',
    'needs_sacrament_prep',
    'is_homebound',
    'special_needs',
    'is_senior',
    'is_pwd',
    'pwd_details',
    'needs_communion_anointing',
    'needs_pastoral_visit',
    'is_out_of_school_youth',
    'youth_ministry_involvement',
    'parish_ministries',
    'skills_talents',
])]
class FamilyMember extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'birthdate' => 'date',
            'is_baptized' => 'boolean',
            'is_first_communion' => 'boolean',
            'is_confirmed' => 'boolean',
            'is_church_married' => 'boolean',
            'needs_sacrament_prep' => 'boolean',
            'is_homebound' => 'boolean',
            'is_senior' => 'boolean',
            'is_pwd' => 'boolean',
            'needs_communion_anointing' => 'boolean',
            'needs_pastoral_visit' => 'boolean',
            'is_out_of_school_youth' => 'boolean',
            'youth_ministry_involvement' => 'boolean',
            'parish_ministries' => 'array',
            'skills_talents' => 'array',
        ];
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
