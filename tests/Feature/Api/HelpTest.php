<?php

namespace Tests\Feature\Api;

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
}
