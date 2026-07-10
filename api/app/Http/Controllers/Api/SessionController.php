<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ResolvesCacheTtl;
use App\Http\Controllers\Controller;
use App\Http\Resources\DriverResource;
use App\Http\Resources\LapResource;
use App\Models\Driver;
use App\Models\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SessionController extends Controller
{
    use ResolvesCacheTtl;

    public function drivers(Session $session): JsonResponse
    {
        $data = Cache::remember(
            "f1:session:{$session->id}:drivers",
            $this->sessionCacheTtl($session),
            fn () => DriverResource::collection($session->drivers()->orderBy('full_name')->get())->resolve()
        );

        return response()->json(['data' => $data]);
    }

    public function laps(Session $session): JsonResponse
    {
        $data = Cache::remember(
            "f1:session:{$session->id}:laps",
            $this->sessionCacheTtl($session),
            fn () => LapResource::collection(
                $session->laps()->with('driver')->orderBy('lap_number')->get()
            )->resolve()
        );

        return response()->json(['data' => $data]);
    }

    public function driverLaps(Session $session, Driver $driver): JsonResponse
    {
        $data = Cache::remember(
            "f1:session:{$session->id}:driver:{$driver->id}:laps",
            $this->sessionCacheTtl($session),
            fn () => LapResource::collection(
                $session->laps()
                    ->where('driver_id', $driver->id)
                    ->with('driver')
                    ->orderBy('lap_number')
                    ->get()
            )->resolve()
        );

        return response()->json(['data' => $data]);
    }
}
