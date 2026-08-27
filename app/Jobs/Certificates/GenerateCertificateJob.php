<?php

namespace App\Jobs\Certificates;

use App\Models\Certificates\Certificate;
use App\Services\Certificates\CertificateGeneratorService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateCertificateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $certificate;

    public function __construct(Certificate $certificate)
    {
        $this->certificate = $certificate;
    }

    public function handle(CertificateGeneratorService $generatorService): void
    {
        try {
            $generatorService->generate($this->certificate);

            $batch = $this->certificate->batch;
            $batch->increment('processed_count');

            if ($batch->processed_count >= $batch->total_count) {
                $batch->update(['status' => 'completed']);
            }
        } catch (\Exception $e) {
            $this->certificate->update(['status' => 'failed']);
            throw $e;
        }
    }
}
