<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'family_code',
    'family_name',
    'head_name',
    'address',
    'barangay',
    'sitio_purok',
    'bec_cluster',
    'contact_number',
    'date_encoded',
    'status',
    'correction_notes',
    'mass_frequency',
    'bec_participation',
    'pastoral_needs',
    'volunteer_skills',
    'family_joy',
    'family_concern',
    'how_parish_can_help',
    'consent_given',
    'encoded_by_id',
    'approved_by_id',
    'approved_at',
])]
class Household extends Model
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
            'date_encoded' => 'date',
            'pastoral_needs' => 'array',
            'volunteer_skills' => 'array',
            'consent_given' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    public function members(): HasMany
    {
        return $this->hasMany(FamilyMember::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function encodedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'encoded_by_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_id');
    }
}
