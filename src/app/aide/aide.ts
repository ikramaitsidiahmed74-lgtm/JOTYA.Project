import { Component } from '@angular/core';

@Component({
  selector: 'app-aide',
  standalone: true,
  imports: [],
  templateUrl: './aide.html',
  styleUrls: ['./aide.css'],
})
export class Aide {
  mapsUrl = 'https://maps.app.goo.gl/NhfQZFbHoEiPuNwk6';

  openMaps(): void {
    window.open(this.mapsUrl, '_blank');
  }
}
