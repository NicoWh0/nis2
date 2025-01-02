<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $json = File::get(database_path('form.json'));

        $data = json_decode($json, true);

        foreach($data['questions'] as $question) {
            $questionId = DB::table('questions')->insertGetId([
                'question_text' => $question['question_text']
            ]);

            foreach($question['answers'] as $answer) {
                DB::table('answers')->insert([
                    'question_id' => $questionId,
                    'answer_text' => $answer['answer_text'],
                    'score' => $answer['score']
                ]);
            }
        }

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('questions')->truncate(); //on delete cascade
    }
};
