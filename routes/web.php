<?php

use App\Http\Controllers\FormController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

Route::get('/form/{step}/questions', [QuestionController::class, 'getQuestions']);

Route::get('/form/steps', [FormController::class, 'getTotalSteps']);


Route::post('/form/{step}/submit', [FormController::class, 'handleFormSubmission']);

Route::get('/{any}', function () {
    Log::info('Client-side routing for route: ' . request()->path());
    return view('app');
})->where('any', '.*');
