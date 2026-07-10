<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lap extends Model
{
    protected $fillable = [
        'session_id',
        'driver_id',
        'lap_number',
        'lap_duration',
        'duration_sector_1',
        'duration_sector_2',
        'duration_sector_3',
        'is_pit_out_lap',
    ];

    protected $casts = [
        'lap_duration' => 'float',
        'duration_sector_1' => 'float',
        'duration_sector_2' => 'float',
        'duration_sector_3' => 'float',
        'is_pit_out_lap' => 'boolean',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }
}
