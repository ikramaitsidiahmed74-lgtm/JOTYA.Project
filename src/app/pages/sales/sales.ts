import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.html',
})
export class Sales {
  stats = [
    { label: 'Chiffre d’affaires', value: '78 500 MAD' },
    { label: 'Ventes', value: '124' },
    { label: 'Croissance', value: '+18%' },
    { label: 'Panier moyen', value: '635 MAD' },
  ];

  sales = [
    {
      product: 'Sac Hermès Birkin',
      client: 'Amel D.',
      price: '12 500 MAD',
      date: '12 Sep 2023',
      status: 'Payé',
    },
    {
      product: 'Rolex Datejust',
      client: 'Karim T.',
      price: '85 000 MAD',
      date: '10 Sep 2023',
      status: 'Payé',
    },
    {
      product: 'Sneakers Dior',
      client: 'Yassine R.',
      price: '9 800 MAD',
      date: '08 Sep 2023',
      status: 'En attente',
    },
  ];
}
