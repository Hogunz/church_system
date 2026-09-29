<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ParishOption extends Model
{
    /** @var list<string> */
    protected $fillable = ['type', 'label', 'sort_order'];

    /**
     * Scope a query to a specific option type.
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type)->orderBy('sort_order')->orderBy('label');
    }
}
