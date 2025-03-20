import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerAdicionaisComponent } from './container-adicionais.component';

describe('ContainerAdicionaisComponent', () => {
  let component: ContainerAdicionaisComponent;
  let fixture: ComponentFixture<ContainerAdicionaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerAdicionaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerAdicionaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
