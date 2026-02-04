import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-product.html'
})
export class AddProductComponent implements OnInit {
  isEdit = false;
  editId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((q) => {
      if (q['editId']) {
        this.isEdit = true;
        this.editId = Number(q['editId']);
        // In future: load product data by id to prefill the form.
      }
    });
  }
}
