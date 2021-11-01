import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click', () => {
    spyOn(component, 'onClick');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(component.onClick).toHaveBeenCalledTimes(1);
  });

  it('should trigger eventEmitter btnClick', () => {
    spyOn(component.btnClick, 'emit');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click()

    expect(component.btnClick.emit).toHaveBeenCalledTimes(1);
  });

  it('should call onClick function', () => {
    spyOn(component, 'onClick');
    component.onClick();

    expect(component.onClick).toHaveBeenCalledTimes(1);
  });
});
