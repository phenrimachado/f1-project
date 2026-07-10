<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Collection;

class OpenF1Client
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.openf1.base_url');
    }

    public function getMeetings(array $params = []): Collection
    {
        return $this->get('meetings', $params);
    }

    public function getSessions(array $params = []): Collection
    {
        return $this->get('sessions', $params);
    }

    public function getDrivers(array $params = []): Collection
    {
        return $this->get('drivers', $params);
    }

    public function getLaps(array $params = []): Collection
    {
        return $this->get('laps', $params);
    }

    protected function get(string $endpoint, array $params = []): Collection
    {
        $response = Http::baseUrl($this->baseUrl)
            ->get($endpoint, $params)
            ->throw();

        return collect($response->json());
    }
}
