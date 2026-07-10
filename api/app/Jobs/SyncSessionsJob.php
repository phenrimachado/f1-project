<?php

namespace App\Jobs;

use App\Models\Meeting;
use App\Models\Session;
use App\Services\OpenF1Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncSessionsJob implements ShouldQueue
{
    use Queueable;

    public function __construct(protected int $meetingKey)
    {
    }

    public function handle(OpenF1Client $client): void
    {
        $meeting = Meeting::where('openf1_meeting_key', $this->meetingKey)->firstOrFail();

        $sessions = $client->getSessions(['meeting_key' => $this->meetingKey]);

        foreach ($sessions as $data) {
            $session = Session::updateOrCreate(
                ['openf1_session_key' => $data['session_key']],
                [
                    'meeting_id' => $meeting->id,
                    'session_name' => $data['session_name'] ?? '',
                    'session_type' => $data['session_type'] ?? null,
                    'date_start' => $data['date_start'] ?? null,
                    'date_end' => $data['date_end'] ?? null,
                ]
            );

            SyncDriversJob::dispatch($session->openf1_session_key);
            SyncLapsJob::dispatch($session->openf1_session_key)->delay(now()->addSeconds(2));
        }
    }
}
