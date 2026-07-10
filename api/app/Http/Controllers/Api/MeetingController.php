<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ResolvesCacheTtl;
use App\Http\Controllers\Controller;
use App\Http\Resources\MeetingResource;
use App\Http\Resources\SessionResource;
use App\Models\Meeting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class MeetingController extends Controller
{
    use ResolvesCacheTtl;

    public function index(): JsonResponse
    {
        $data = Cache::remember('f1:meetings', $this->activeTtl, function () {
            return MeetingResource::collection(Meeting::orderByDesc('date_start')->get())->resolve();
        });

        return response()->json(['data' => $data]);
    }

    public function sessions(Meeting $meeting): JsonResponse
    {
        $data = Cache::remember(
            "f1:meeting:{$meeting->id}:sessions",
            $this->meetingCacheTtl($meeting),
            fn () => SessionResource::collection($meeting->sessions()->orderBy('date_start')->get())->resolve()
        );

        return response()->json(['data' => $data]);
    }
}
