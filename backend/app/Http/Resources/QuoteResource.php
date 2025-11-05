<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'client_name' => $this->client_name,
            'client_phone' => $this->client_phone,
            'client_email' => $this->client_email,
            'site' => $this->whenLoaded('site', fn() => ['id' => $this->site->id, 'name' => $this->site->name, 'code' => $this->site->code]),
            'user' => $this->whenLoaded('user', fn() => ['id' => $this->user->id, 'name' => $this->user->name]),
            'devices' => $this->devices,
            'notes' => $this->notes,
            'file_path' => $this->file_path ? asset("storage/{$this->file_path}") : null,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
