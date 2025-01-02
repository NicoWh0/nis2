<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

class QuestionController extends Controller
{
    public function getQuestions(Request $request, $step)
    {
        if($step < 1) {
            return response()->json(['message' => 'Invalid step'], 400);
        }
        $perStep = config('app.questions.per_step');
        $skip = ($step - 1) * $perStep;

        $questions = Question::with(['answers' => function ($query) {
                $query->select('id', 'question_id', 'answer_text', 'score');
            }])
            ->orderBy('position')
            ->whereNull('deleted_at')
            ->skip($skip)
            ->take($perStep)
            ->select('id', 'question_text', 'position')
            ->get();

        return $questions->isNotEmpty() ?
            response()->json($questions) :
            response()->json(['message' => 'No questions found'], 404);
    }
}
