<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HelpTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_returns_the_latest_privacy_policy_with_summary_as_an_array_of_strings()
    {
        // Arrange
        $this->seed(\Database\Seeders\PrivacyPolicySeeder::class);

        // Act
        $response = $this->getJson('/api/v1/help/privacy-policy/latest');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'version',
                'last_updated',
                'summary',
                'sections',
                'changelog',
                'is_active',
            ],
            'message'
        ]);

        $response->assertJsonPath('data.summary', [
            'توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية.',
            'نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك.',
            'باستخدام خدماتنا، فإنك توافق على الممارسات الموضحة في هذه السياسة.',
        ]);
    }

    /** @test */
    public function an_authenticated_user_can_create_a_help_ticket()
    {
        // Arrange
        $user = User::factory()->create();
        $ticketData = [
            'subject' => 'Test Subject',
            'body' => 'Test body',
        ];

        // Act
        $response = $this->actingAs($user)->postJson('/api/v1/help/tickets', $ticketData);

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'user_id',
                'subject',
                'body',
                'status',
                'created_at',
                'updated_at',
            ],
            'message'
        ]);
        $this->assertDatabaseHas('help_tickets', [
            'user_id' => $user->id,
            'subject' => 'Test Subject',
        ]);
    }
}
