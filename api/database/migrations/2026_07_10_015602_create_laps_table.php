<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('laps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('race_sessions')->cascadeOnDelete();
            $table->foreignId('driver_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('lap_number');
            $table->decimal('lap_duration', 8, 3)->nullable();
            $table->decimal('duration_sector_1', 8, 3)->nullable();
            $table->decimal('duration_sector_2', 8, 3)->nullable();
            $table->decimal('duration_sector_3', 8, 3)->nullable();
            $table->boolean('is_pit_out_lap')->default(false);
            $table->timestamps();

            $table->unique(['session_id', 'driver_id', 'lap_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laps');
    }
};
