<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeetingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'openf1_meeting_key' => $this->openf1_meeting_key,
            'name' => $this->name,
            'location' => $this->location,
            'country' => $this->country,
            'circuit_short_name' => $this->circuit_short_name,
            'date_start' => $this->date_start?->toIso8601String(),
        ];
    }
}
