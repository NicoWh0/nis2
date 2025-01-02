<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['question_text', 'position'];

    public function answers()
    {
        return $this->hasMany(Answer::class)
            ->whereNull('deleted_at');
    }
}
