<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'meeting_id' => $this->meeting_id,
            'openf1_session_key' => $this->openf1_session_key,
            'session_name' => $this->session_name,
            'session_type' => $this->session_type,
            'date_start' => $this->date_start?->toIso8601String(),
            'date_end' => $this->date_end?->toIso8601String(),
        ];
    }
}
