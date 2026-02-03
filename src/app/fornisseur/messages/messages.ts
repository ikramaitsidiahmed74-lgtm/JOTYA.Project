import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.html',
})
export class Messages {
  messages = [
    {
      name: 'Amel D.',
      text: 'Est-ce que le sac est toujours disponible ?',
      date: 'Il y a 2h',
    },
    {
      name: 'Karim T.',
      text: 'Je souhaiterais un remboursement.',
      date: 'Hier',
    },
    {
      name: 'Sophie L.',
      text: 'Paiement effectué avec succès.',
      date: '2 jours',
    },
    {
      name: 'Yassine R.',
      text: 'Livraison prévue quand ?',
      date: '3 jours',
    },
  ];
}
