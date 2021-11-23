import { DisplayDoc } from './../documents/docs.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfComponentComponent } from './pdf-component.component';

describe('PdfComponentComponent', () => {
  let component: PdfComponentComponent;
  let fixture: ComponentFixture<PdfComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfComponentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfComponentComponent);
    component = fixture.componentInstance;

    const drift = fixture.debugElement.componentInstance;
    const item: DisplayDoc = {
      _id: '123123123123',
      title: 'test',
      content: 'test',
      docType: 'text',
    };
    drift.item = item;

    const drift1 = fixture.debugElement.componentInstance;
    const id: string = '123123123123';
    drift1.id = id;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a pdf file', () => {
    component.data = document;

    const spy = spyOn(component, 'exportHtmlToPDF').and.callThrough();
    expect(spy).toHaveBeenCalledTimes(0);
    component.exportHtmlToPDF();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.id).toEqual('123123123123');
    expect(component.item._id).toEqual('123123123123');
  });
});
