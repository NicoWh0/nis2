<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['question_id', 'answer_text', 'score'];

    public function question()
    {
        return $this->belongsTo(Question::class)
            ->whereNull('deleted_at');
    }
}
