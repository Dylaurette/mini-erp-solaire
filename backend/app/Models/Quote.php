<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'client_name',
        'client_phone',
        'client_email',
        'site_id',
        'user_id',
        'devices',
        'notes',
        'file_path',
        'status',
    ];

    protected $casts = [
        'devices' => 'array',
    ];

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

