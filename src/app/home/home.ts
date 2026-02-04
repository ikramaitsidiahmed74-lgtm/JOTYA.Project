import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  // Pause auto scroll on hover
  pauseScroll = false;
  pauseScroll2 = false;

  constructor(private router: Router) {}

  goRegisterVendeur() {
    this.router.navigate(['/auth/vendeur-register']);
  }

  // ===================== DATA =====================
  categories = [
    {
      name: 'Vêtements',
      products: [
        { id: 1, name: 'jacket Cuire', price: 79, image: '/assets/V1.jpg' },
        { id: 2, name: 'Robe Courte', price: 99, image: '/assets/V5.PNG' },
        { id: 3, name: 'Mini Djellaba', price: 60, image: '/assets/V10.PNG' },
        { id: 4, name: 'Pantalon femme', price: 30, image: '/assets/V9.PNG' },
      ],
    },
    {
      name: 'Accessoires',
      products: [
        { id: 5, name: 'Sac Cuire', price: 79, image: '/assets/V12.jpg' },
        { id: 6, name: 'Collie', price: 349, image: '/assets/V13.jpg' },
        { id: 7, name: 'Chasseurs Talonts', price: 80, image: '/assets/V14.jpg' },
      ],
    },
    {
      name: 'Maison',
      products: [
        { id: 8, name: 'Zarbia', price: 299, image: '/assets/V18.PNG' },
        { id: 9, name: 'Objets décoratifs vintage', price: 167, image: '/assets/V19.PNG' },
        { id: 10, name: 'KHALAT', price: 50, image: '/assets/V20.PNG' },
      ],
    },
    {
      name: 'Électroniques',
      products: [
        { id: 11, name: 'Camera HD', price: 500, image: '/assets/V21.PNG' },
        { id: 12, name: 'PC gamer', price: 4000, image: '/assets/V22.PNG' },
      ],
    },
    {
      name: 'Jeux',
      products: [
        { id: 13, name: 'Piano électrique', price: 389, image: '/assets/V22.PNG' },
      ],
    },
  ];

  // ===================== GETTERS =====================
  get vetementAccessoireProducts() {
    return this.categories
      .filter(c => c.name === 'Vêtements' || c.name === 'Accessoires')
      .flatMap(c => c.products);
  }

  get vetementAccessoireLoop() {
    return [...this.vetementAccessoireProducts, ...this.vetementAccessoireProducts];
  }

  get maisonElectroJeuxProducts() {
    return this.categories
      .filter(c =>
        c.name === 'Maison' ||
        c.name === 'Électroniques' ||
        c.name === 'Jeux'
      )
      .flatMap(c => c.products);
  }

  get maisonElectroJeuxLoop() {
    return [...this.maisonElectroJeuxProducts, ...this.maisonElectroJeuxProducts];
  }

  goToProduct(product: any) {
    this.router.navigate(['/product', product.id]);
  }

  // ===================== 3D COVERFLOW =====================
  expertiseCards = [
    'Vendeurs Vérifiés',
    'Paiement Sécurisé',
    'Livraison Rapide',
    'Produits de Qualité',
    'Support 24/7',
  ];

  private coverInterval!: any;

  ngOnInit() {
    this.coverInterval = setInterval(() => {
      this.rotateCoverflow();
    }, 2500);
  }

  rotateCoverflow() {
    // 🔥 الطريقة الصحيحة مع Angular
    this.expertiseCards = [
      ...this.expertiseCards.slice(1),
      this.expertiseCards[0],
    ];
  }

  ngOnDestroy() {
    clearInterval(this.coverInterval);
  }
}