<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'openf1_driver_number' => $this->openf1_driver_number,
            'full_name' => $this->full_name,
            'team_name' => $this->team_name,
            'country_code' => $this->country_code,
        ];
    }
}
