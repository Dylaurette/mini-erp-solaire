<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quote;
use App\Http\Resources\QuoteResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Notifications\NewQuoteNotification;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Gate;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        // Si admin -> voir tout, sinon limiter au site de l'utilisateur (si défini)
        $user = $request->user();

        $query = Quote::with(['site', 'user'])->orderBy('created_at', 'desc');

        if ($user->role !== 'admin') {
            // si user affecté à un site, on filtre ; sinon si manager, peut voir son site
            if ($user->site_id) {
                $query->where('site_id', $user->site_id);
            }
        }

        // pagination simple
        $quotes = $query->paginate(20);

        return response()->json($quotes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'nullable|string',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'nullable|string|max:50',
            'client_email' => 'nullable|email|max:255',
            'devices' => 'nullable',
            'file' => 'nullable|file|max:5120', // 5MB
            'site_id' => 'nullable|exists:sites,id',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();

        $data = $request->only(['type', 'client_name', 'client_phone', 'client_email', 'devices', 'site_id', 'notes']);
        $data['user_id'] = $user->id;
        $data['type'] = $data['type'] ?? 'electronic';
        $data['devices'] = is_string($data['devices']) ? json_decode($data['devices'], true) : $data['devices'];

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('quotes', 'public');
            $data['file_path'] = $path;
        }

        $quote = Quote::create($data);

        // audit log
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'create_quote',
            'meta' => json_encode(['quote_id' => $quote->id]),
        ]);

        // Notifier les techniciens du site (ou tous les techniciens si site non défini)
        $techsQuery = User::where('role', 'technician');
        if ($quote->site_id) {
            $techsQuery->where('site_id', $quote->site_id);
        }
        $techs = $techsQuery->get();

        foreach ($techs as $tech) {
            $tech->notify(new NewQuoteNotification($quote));
        }

        return new QuoteResource($quote->load('site','user'));
    }

    // route POST /api/quotes/solar
    public function storeSolar(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string|max:255',
            'site' => 'nullable|exists:sites,id',
            'required_power' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'file' => 'nullable|file|max:5120',
        ]);

        $data = [
            'type' => 'solar',
            'client_name' => $request->input('client_name'),
            'site_id' => $request->input('site'),
            'required_power' => $request->input('required_power'),
            'notes' => $request->input('notes'),
            'user_id' => $request->user()->id,
        ];

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('quotes', 'public');
        }

        $quote = Quote::create($data);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create_solar_quote',
            'meta' => json_encode(['quote_id' => $quote->id]),
        ]);

        // notify technicians
        $techsQuery = User::where('role','technician');
        if ($quote->site_id) $techsQuery->where('site_id', $quote->site_id);
        $techs = $techsQuery->get();
        foreach ($techs as $tech) $tech->notify(new NewQuoteNotification($quote));

        return new QuoteResource($quote->load('site','user'));
    }

    public function show(Quote $quote)
    {
        $this->authorize('view', $quote);
        return new QuoteResource($quote->load('site','user'));
    }

    public function update(Request $request, Quote $quote)
    {
        $this->authorize('update', $quote);

        $request->validate([
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $quote->update($request->only(['status','notes']));

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update_quote',
            'meta' => json_encode(['quote_id' => $quote->id,'status'=>$quote->status]),
        ]);

        return new QuoteResource($quote->fresh()->load('site','user'));
    }

    public function destroy(Request $request, Quote $quote)
    {
        $this->authorize('delete', $quote);

        $quote->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete_quote',
            'meta' => json_encode(['quote_id' => $quote->id]),
        ]);

        return response()->json(['deleted' => true]);
    }
}
