<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LapResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'driver' => $this->whenLoaded('driver', fn () => (new DriverResource($this->driver))->resolve()),
            'lap_number' => $this->lap_number,
            'lap_duration' => $this->lap_duration,
            'duration_sector_1' => $this->duration_sector_1,
            'duration_sector_2' => $this->duration_sector_2,
            'duration_sector_3' => $this->duration_sector_3,
            'is_pit_out_lap' => $this->is_pit_out_lap,
        ];
    }
}
