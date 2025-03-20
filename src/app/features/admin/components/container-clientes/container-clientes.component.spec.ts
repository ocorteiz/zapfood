import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerClientesComponent } from './container-clientes.component';

describe('ContainerClientesComponent', () => {
  let component: ContainerClientesComponent;
  let fixture: ComponentFixture<ContainerClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
