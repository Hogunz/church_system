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
    'is_baptized',
    'is_first_communion',
    'is_confirmed',
    'is_church_married',
    'is_homebound',
    'special_needs',
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
            'is_homebound' => 'boolean',
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
