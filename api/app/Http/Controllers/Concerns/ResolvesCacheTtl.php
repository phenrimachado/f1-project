<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Meeting;
use App\Models\Session;

trait ResolvesCacheTtl
{
    /** Short TTL for data that can still change (in seconds). */
    protected int $activeTtl = 60;

    /** Long TTL for data that is settled and won't change (in seconds). */
    protected int $finishedTtl = 86400;

    protected function sessionCacheTtl(Session $session): int
    {
        $reference = $session->date_end ?? $session->date_start;

        return $reference && $reference->isPast() ? $this->finishedTtl : $this->activeTtl;
    }

    protected function meetingCacheTtl(Meeting $meeting): int
    {
        return $meeting->date_start && $meeting->date_start->isPast()
            ? $this->finishedTtl
            : $this->activeTtl;
    }
}
