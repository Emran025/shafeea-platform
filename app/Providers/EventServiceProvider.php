<?php

namespace App\Providers;

use App\Events\AdminLogin;
use App\Events\ApiLogin;
use App\Listeners\LogAdminLoginSession;
use App\Listeners\LogApiLoginSession;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        ApiLogin::class => [
            LogApiLoginSession::class,
        ],
        AdminLogin::class => [
            LogAdminLoginSession::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
