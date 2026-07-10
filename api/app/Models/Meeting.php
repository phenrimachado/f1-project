<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meeting extends Model
{
    protected $fillable = [
        'openf1_meeting_key',
        'name',
        'location',
        'country',
        'circuit_short_name',
        'date_start',
    ];

    protected $casts = [
        'date_start' => 'datetime',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }
}
