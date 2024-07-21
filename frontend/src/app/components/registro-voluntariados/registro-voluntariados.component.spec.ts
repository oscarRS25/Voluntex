import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVoluntariadosComponent } from './registro-voluntariados.component';

describe('RegistroVoluntariadosComponent', () => {
  let component: RegistroVoluntariadosComponent;
  let fixture: ComponentFixture<RegistroVoluntariadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroVoluntariadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroVoluntariadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
