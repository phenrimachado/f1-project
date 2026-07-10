<?php

use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\SessionController;
use Illuminate\Support\Facades\Route;

Route::get('meetings', [MeetingController::class, 'index']);
Route::get('meetings/{meeting}/sessions', [MeetingController::class, 'sessions']);

Route::get('sessions/{session}/drivers', [SessionController::class, 'drivers']);
Route::get('sessions/{session}/laps', [SessionController::class, 'laps']);
Route::get('sessions/{session}/drivers/{driver}/laps', [SessionController::class, 'driverLaps']);
