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

  imagePreview: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((q) => {
      if (q && q['editId']) {
        this.isEdit = true;
        this.editId = Number(q['editId']);
        // In future: load product data by id to prefill the form.
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = (reader.result as string) || null;
      };
      reader.readAsDataURL(file);
    }
  }
}
