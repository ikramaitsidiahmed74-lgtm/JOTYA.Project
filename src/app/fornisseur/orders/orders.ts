import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
})
export class Orders {

  orders = [
    {
      id: 1,
      client: 'Amel D.',
      total: 1200,
      status: 'En attente',
    },
    {
      id: 2,
      client: 'Karim T.',
      total: 900,
      status: 'Livrée',
    },
  ];

}
