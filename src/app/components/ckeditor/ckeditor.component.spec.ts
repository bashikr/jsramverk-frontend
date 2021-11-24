import { By } from '@angular/platform-browser';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CKEditorComponent } from './ckeditor.component';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DocumentsAPIService } from 'src/app/services/documents.api.service';

const config: SocketIoConfig = { url: 'http://localhost:1337', options: {} };

describe('CKEditorComponent', () => {
  let component: CKEditorComponent;
  let fixture: ComponentFixture<CKEditorComponent>;
  let de;
  let documentsAPIService: DocumentsAPIService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CKEditorComponent],
      imports: [HttpClientModule, SocketIoModule.forRoot(config)],
      providers: [SocketIoService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CKEditorComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    documentsAPIService = de.injector.get(DocumentsAPIService);

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

  it('should call onKeyUp method', fakeAsync(() => {
    expect(component.model.content).toEqual('<p>Hello, world!</p>');

    let editor = fixture.debugElement.query(By.css('#myEditor')).nativeElement;

    let onKeyUp = spyOn(component, 'onKeyUp').and.callThrough();
    editor.dispatchEvent(new Event('keyup'));

    spyOn(documentsAPIService, 'updateDocReq').and.stub();

    flush();

    fixture.detectChanges();
    expect(onKeyUp).toHaveBeenCalledTimes(1);
  }));

  it('test SetValue', fakeAsync(() => {
    expect(component.model.content).toEqual('<p>Hello, world!</p>');

    var fakeDoc = {
      _id: '123456789123',
      title: 'test title',
      content: 'test content',
      docType: 'text',
    };

    component.setValue(fakeDoc);

    fixture.detectChanges();
    expect(component.model.content).toBe('test content');
    expect(component.model.title).toBe('test title');
    expect(component.model.docType).toBe('text');
  }));
});
