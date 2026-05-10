<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Note;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create sample notes
        Note::create([
            'user_id' => $user->id,
            'title' => 'My first note',
            'content' => 'This is a sample note with some content.',
            'priority' => 'high',
        ]);

        Note::create([
            'user_id' => $user->id,
            'title' => 'Shopping list',
            'content' => 'Milk, Bread, Eggs, Cheese',
            'priority' => 'medium',
        ]);

        Note::create([
            'user_id' => $user->id,
            'title' => 'Meeting notes',
            'content' => 'Discussed project timeline and deliverables.',
            'priority' => 'high',
        ]);

        Note::create([
            'user_id' => $user->id,
            'title' => 'TODO: Learn React',
            'content' => null,
            'priority' => 'low',
        ]);
    }
}
