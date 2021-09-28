import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CKEditorComponent } from './ckeditor.component';

describe('CKEditorComponent', () => {
  let component: CKEditorComponent;
  let fixture: ComponentFixture<CKEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CKEditorComponent],
      imports: [HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CKEditorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call CKEditor's onReady method", fakeAsync(() => {
    expect(component.model.content).toEqual('<p>Hello, world!</p>');
    let editor = fixture.debugElement.query(By.css('#myEditor')).nativeElement;
    expect(editor).toBeTruthy();

    let readyEvent = new Event('ready');
    spyOn(component, 'onReady').withArgs(readyEvent).and.callThrough();
    editor.dispatchEvent(readyEvent);

    expect(component.onReady).toHaveBeenCalledTimes(1);
    expect(component.onReady).toHaveBeenCalledWith(readyEvent);
  }));

  it('should call onChange method', fakeAsync(() => {
    expect(component.model.content).toEqual('<p>Hello, world!</p>');

    let editor = fixture.debugElement.query(By.css('#myEditor')).nativeElement;

    let onChange = spyOn(component, 'onChange').and.callThrough();
    editor.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    expect(onChange).toHaveBeenCalledTimes(1);
  }));
});
