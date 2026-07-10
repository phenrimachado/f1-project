<?php

namespace App\Jobs;

use App\Models\Meeting;
use App\Services\OpenF1Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncMeetingsJob implements ShouldQueue
{
    use Queueable;

    public function __construct(protected ?int $year = null)
    {
    }

    public function handle(OpenF1Client $client): void
    {
        $year = $this->year ?? now()->year;

        $meetings = $client->getMeetings(['year' => $year]);

        foreach ($meetings as $data) {
            $meeting = Meeting::updateOrCreate(
                ['openf1_meeting_key' => $data['meeting_key']],
                [
                    'name' => $data['meeting_name'] ?? $data['meeting_official_name'] ?? '',
                    'location' => $data['location'] ?? null,
                    'country' => $data['country_name'] ?? null,
                    'circuit_short_name' => $data['circuit_short_name'] ?? null,
                    'date_start' => $data['date_start'] ?? null,
                ]
            );

            SyncSessionsJob::dispatch($meeting->openf1_meeting_key);
        }
    }
}
