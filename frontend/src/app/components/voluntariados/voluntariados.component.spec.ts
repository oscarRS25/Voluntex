import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntariadosComponent } from './voluntariados.component';

describe('VoluntariadosComponent', () => {
  let component: VoluntariadosComponent;
  let fixture: ComponentFixture<VoluntariadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoluntariadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoluntariadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
