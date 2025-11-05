<?php

namespace App\Policies;

use App\Models\Quote;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class QuotePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Quote $quote)
    {
        if ($user->role === 'admin') return true;
        if ($user->role === 'technician') {
            // technicien peut voir quotes de son site
            return $user->site_id && $user->site_id === $quote->site_id;
        }
        // vendeur / manager : voir quotes du site s'il a site_id
        return $user->site_id && $user->site_id === $quote->site_id;
    }

    public function update(User $user, Quote $quote)
    {
        // admin or technician of site can update status/notes
        if ($user->role === 'admin') return true;
        if ($user->role === 'technician') return $user->site_id && $user->site_id === $quote->site_id;
        return false;
    }

    public function delete(User $user, Quote $quote)
    {
        return $user->role === 'admin';
    }
}
