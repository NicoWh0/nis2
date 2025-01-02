<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

class FormController extends Controller
{
    private $perStep;
    private $totalQuestions;
    private $totalSteps;


    public function __construct()
    {
        $this->perStep = config('app.questions.per_step');
        $this->totalQuestions = Question::whereNull('deleted_at')->count();
        $this->totalSteps = ceil($this->totalQuestions / $this->perStep);
    }

    public function handleFormSubmission(Request $request, $step)
    {
        if ($step > $this->totalSteps) {
            return response()->json(['message' => 'Invalid step'], 400);
        }
        $lastStep = $step === $this->totalSteps;
        for($i = 1; $i < $step; $i++) {
            $formValues = $request->session()->get("step_$i");
            if (!$this->validateStepFormValues($formValues, $this->perStep)) {
                return response()->json(['message' => 'Invalid form values in session'], 400);
            }
        }
        $formValues = $request->input('formValues');
        if (!$this->validateStepFormValues($formValues, $lastStep ? $this->totalQuestions % $this->perStep : $this->perStep)) {
            return response()->json(['message' => 'Invalid form values in request'], 400);
        }

        if(!$lastStep) {
            $request->session()->put("step_$step", $formValues);
            return response()->json(['message' => 'Form submitted']);
        }

        for($i = 1; $i <= $this->totalSteps; $i++) {
            $formValues = $request->session()->get("step_$i");
            // Calculate score
            // Save score
            $request->session()->forget("step_$i");
        }
        return response()->json(['message' => 'Final Form submitted']);
    }


    public function getTotalSteps()
    {
        return response()->json(['totalSteps' => $this->totalSteps]);
    }


    private function calculateTotalSteps() {
        $perStep = config('app.questions.per_step');
        $totalQuestions = Question::whereNull('deleted_at')->count();
        return ceil($totalQuestions / $perStep);
    }

    private function validateStepFormValues($formValues, $toCount) {
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
        if (count($formValues) !== $toCount) {
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
