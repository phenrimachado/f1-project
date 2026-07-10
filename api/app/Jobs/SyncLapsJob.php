<?php

namespace App\Jobs;

use App\Models\Lap;
use App\Models\Session;
use App\Services\OpenF1Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncLapsJob implements ShouldQueue
{
    use Queueable;

    public function __construct(protected int $sessionKey)
    {
    }

    public function handle(OpenF1Client $client): void
    {
        $session = Session::where('openf1_session_key', $this->sessionKey)->firstOrFail();

        $laps = $client->getLaps(['session_key' => $this->sessionKey]);

        foreach ($laps as $data) {
            $driver = $session->drivers()
                ->where('openf1_driver_number', $data['driver_number'])
                ->first();

            if (! $driver) {
                continue;
            }

            Lap::updateOrCreate(
                [
                    'session_id' => $session->id,
                    'driver_id' => $driver->id,
                    'lap_number' => $data['lap_number'],
                ],
                [
                    'lap_duration' => $data['lap_duration'] ?? null,
                    'duration_sector_1' => $data['duration_sector_1'] ?? null,
                    'duration_sector_2' => $data['duration_sector_2'] ?? null,
                    'duration_sector_3' => $data['duration_sector_3'] ?? null,
                    'is_pit_out_lap' => $data['is_pit_out_lap'] ?? false,
                ]
            );
        }
    }
}
