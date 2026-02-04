import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSlide } from './image-slide';

describe('ImageSlide', () => {
  let component: ImageSlide;
  let fixture: ComponentFixture<ImageSlide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageSlide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageSlide);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
