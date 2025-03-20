import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarInfosComponent } from './alterar.component';

describe('AlterarInfosComponent', () => {
  let component: AlterarInfosComponent;
  let fixture: ComponentFixture<AlterarInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlterarInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterarInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
