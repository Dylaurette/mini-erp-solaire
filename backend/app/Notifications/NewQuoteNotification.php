<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Quote;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class NewQuoteNotification extends Notification
{
    use Queueable;

    protected $quote;

    public function __construct(Quote $quote)
    {
        $this->quote = $quote;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'quote_id' => $this->quote->id,
            'message' => "Nouvelle demande de devis ({$this->quote->type}) de {$this->quote->client_name}",
            'site_id' => $this->quote->site_id,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Nouvelle demande de devis')
                    ->line("Nouvelle demande de devis de {$this->quote->client_name}")
                    ->action('Voir le devis', url('/')) // remplacer par front url
                    ->line('Merci.');
    }
}
