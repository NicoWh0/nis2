<?php

use App\Http\Controllers\FormController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

Route::get('/form/{step}/questions', [QuestionController::class, 'getQuestions'])
->where('step', '[1-9][0-9]*')->name('form.questions');

Route::get('/form/{step}/answers', [FormController::class, 'getAnswers'])
->where('step', '[1-9][0-9]*')->name('form.answers');

Route::get('/form/steps', [FormController::class, 'getTotalSteps'])->name('form.steps');

Route::get('/form/{step}/prev-answered', [FormController::class, 'isPrevQuestionsAnswered'])
->where('step', '[1-9][0-9]*')->name('form.prev-answers');

Route::get('/form/cleanup', [FormController::class, 'cleanup'])->name('form.cleanup');

Route::post('/form/{step}/submit', [FormController::class, 'handleFormSubmission'])
->where('step', '[1-9][0-9]*')->name('form.submit');

Route::get('/{any}', function () {
    Log::info('Client-side routing for route: ' . request()->path());
    return view('app');
})->where('any', '.*')->name('app');
