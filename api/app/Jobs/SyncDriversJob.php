<?php

namespace App\Jobs;

use App\Models\Driver;
use App\Models\Session;
use App\Services\OpenF1Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncDriversJob implements ShouldQueue
{
    use Queueable;

    public function __construct(protected int $sessionKey)
    {
    }

    public function handle(OpenF1Client $client): void
    {
        $session = Session::where('openf1_session_key', $this->sessionKey)->firstOrFail();

        $drivers = $client->getDrivers(['session_key' => $this->sessionKey]);

        foreach ($drivers as $data) {
            $driver = Driver::updateOrCreate(
                [
                    'openf1_driver_number' => $data['driver_number'],
                    'full_name' => $data['full_name'] ?? '',
                ],
                [
                    'team_name' => $data['team_name'] ?? null,
                    'country_code' => $data['country_code'] ?? null,
                ]
            );

            $session->drivers()->syncWithoutDetaching([$driver->id]);
        }
    }
}
