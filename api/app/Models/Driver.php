<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Model
{
    protected $fillable = [
        'openf1_driver_number',
        'full_name',
        'team_name',
        'country_code',
    ];

    public function sessions(): BelongsToMany
    {
        return $this->belongsToMany(Session::class, 'session_driver');
    }

    public function laps(): HasMany
    {
        return $this->hasMany(Lap::class);
    }
}
