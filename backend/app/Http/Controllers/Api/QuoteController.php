<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quote;
use App\Models\Alert;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        // si manager/site, filtrer par site_id
        $query = Quote::with(['user','site'])->orderBy('created_at','desc');

        if ($request->user() && $request->user()->role === 'manager' && $request->user()->site_id) {
            $query->where('site_id', $request->user()->site_id);
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'type' => 'nullable|string',
            'client_name' => 'nullable|string',
            'client_phone' => 'nullable|string',
            'client_email' => 'nullable|email',
            'site_id' => 'nullable|exists:sites,id',
            'devices' => 'nullable',
            'notes' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $f = $request->file('file');
            $filePath = $f->store('quotes', 'public');
        }

        $quote = Quote::create([
            'type' => $request->input('type', 'electronic'),
            'client_name' => $request->input('client_name'),
            'client_phone' => $request->input('client_phone'),
            'client_email' => $request->input('client_email'),
            'site_id' => $request->input('site_id'),
            'user_id' => $request->user()?->id,
            'devices' => $request->input('devices') ? json_decode($request->input('devices'), true) : null,
            'notes' => $request->input('notes'),
            'file_path' => $filePath,
            'status' => 'pending',
        ]);

        // Créer une alerte pour technicien(s)
        if (class_exists(Alert::class)) {
            Alert::create([
                'type' => 'new_quote',
                'message' => 'Nouvelle demande de devis #' . $quote->id,
                'data' => json_encode(['quote_id' => $quote->id]),
            ]);
        }

        return response()->json($quote->load(['user','site']), 201);
    }

    public function show(Quote $quote)
    {
        return response()->json($quote->load(['user','site']));
    }

    public function update(Request $request, Quote $quote)
    {
        $quote->update($request->only(['status','notes']));
        return response()->json($quote);
    }

    public function destroy(Quote $quote)
    {
        if ($quote->file_path) {
            Storage::disk('public')->delete($quote->file_path);
        }
        $quote->delete();
        return response()->json(null, 204);
    }

    public function storeSolar(Request $request)
    {
        $request->merge(['type' => 'solar']);
        return $this->store($request);
    }
}
