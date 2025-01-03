<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use Illuminate\Support\Facades\Log;

class FormController extends Controller
{
    private $perStep;
    private $totalQuestions;
    private $totalSteps;
    private $max_score;


    public function __construct()
    {
        $this->perStep = config('app.questions.per_step');
        $this->totalQuestions = Question::whereNull('deleted_at')->count();
        $this->totalSteps = ceil($this->totalQuestions / $this->perStep);
        $this->max_score = Question::whereNull('deleted_at')->with('answers')->get()->sum(function($question) {
            return $question->answers->max('score');
        });
    }

    public function handleFormSubmission(Request $request, $step)
    {
        if ($step < 1 || $step > $this->totalSteps) {
            return response()->json(['message' => 'Invalid step'], 400);
        }
        $lastStep = $step == $this->totalSteps;
        for($i = 1; $i < $step; $i++) {
            Log::info("Checking step $i");
            $formValues = $request->session()->get("step_$i");
            if (!$this->validateStepFormValues($formValues, $this->perStep)) {
                return response()->json(['message' => 'Invalid form values in session'], 400);
            }
        }
        $formValues = $request->input('formValues');
        Log::info("Form values: " . json_encode($formValues));
        if (!$this->validateStepFormValues($formValues, $lastStep ? $this->totalQuestions % $this->perStep : $this->perStep)) {
            return response()->json(['message' => 'Invalid form values in request'], 400);
        }
        $request->session()->put("step_$step", $formValues);

        if(!$lastStep) {
            return response()->json(['message' => 'Form submitted']);
        }

        $score = 0;
        for($i = 1; $i <= $this->totalSteps; $i++) {
            $formValues = $request->session()->get("step_$i");
            // Calculate score
            $score += collect($formValues)->sum(function($formValue) {
                return Question::find($formValue['question_id'])->answers->find($formValue['answer_id'])->score;
            });

            $request->session()->forget("step_$i");
        }
        $percent = round($score / $this->max_score * 100, 3);
        // Score and/or percent could be saved somewhere (eg. in database)
        return response()->json([
            'message' => 'Final Form submitted',
            'score' => $score,
            'max_score' => $this->max_score,
            'percent' => $percent
        ]);
    }

    public function isPrevQuestionsAnswered(Request $request, $step) {
        if ($step < 1 || $step > $this->totalSteps) {
            return response()->json(['message' => 'Invalid step'], 400);
        }
        for($i = 1; $i < $step; $i++) {
            $formValues = $request->session()->get("step_$i");
            if(!$formValues) {
                return response()->json(['answered' => false, 'step' => $i]);
            }
        }
        return response()->json(['answered' => true]);
    }


    public function getAnswers(Request $request, $step)
    {
        if ($step < 1 || $step > $this->totalSteps) {
            return response()->json(['message' => 'Invalid step'], 400);
        }
        $formValues = $request->session()->get("step_$step");
        if (!$formValues) {
            return response()->json(['message' => 'No answers found for this step'], 404);
        }
        return response()->json($formValues);
    }


    public function getTotalSteps()
    {
        return response()->json(['totalSteps' => $this->totalSteps]);
    }

    public function cleanup(Request $request)
    {
        $request->session()->flush();
        return response()->json(['message' => 'Session cleared']);
    }


    private function calculateTotalSteps() {
        $perStep = config('app.questions.per_step');
        $totalQuestions = Question::whereNull('deleted_at')->count();
        return ceil($totalQuestions / $perStep);
    }


    /*
        Values for each step are: [
            {
                question_id: 1,
                answer_id: 1
            },
            {
                question_id: 2,
                answer_id: 2
            }
        ]
        Validate that both question_id and answer_id are present id database and that answer_id belongs to question_id
    */
    private function validateStepFormValues($formValues, $toCount) {
        if (count($formValues) != $toCount) {
            Log::info("Count mismatch: " . count($formValues) . " != " . $toCount);
            return false;
        }
        foreach ($formValues as $formValue) {
            $question = Question::find($formValue['question_id']);
            if (!$question) {
                return false;
            }
            $answer = $question->answers()->find($formValue['answer_id']);
            if (!$answer) {
                return false;
            }
        }
        return true;
    }
}
