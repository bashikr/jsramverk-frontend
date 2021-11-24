import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { By } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { CodeEditorComponent } from './code-editor.component';
import { DocumentsAPIService } from 'src/app/services/documents.api.service';
import { DebugElement } from '@angular/core';

const config: SocketIoConfig = { url: 'http://localhost:1337', options: {} };

describe('CodeEditorComponent', () => {
  let component: CodeEditorComponent;
  let fixture: ComponentFixture<CodeEditorComponent>;
  let de;
  let documentsAPIService: DocumentsAPIService;
  let executedCodeRes: DebugElement;
  let BtnClicksServiceStub: Partial<BtnClicksService>;
  let editor: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeEditorComponent],
      imports: [HttpClientTestingModule, SocketIoModule.forRoot(config)],
      providers: [
        SocketIoService,
        { provider: BtnClicksService, useValue: BtnClicksServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    documentsAPIService = de.injector.get(DocumentsAPIService);

    executedCodeRes = fixture.debugElement.query(By.css('#executedCodeRes'));
    editor = fixture.debugElement.query(By.css('#codeEditor')).nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onKeyUp method', fakeAsync(() => {
    expect(component.model.content).toEqual('console.log("Hello world!");');

    let onKeyUp = spyOn(component, 'onKeyUp').and.callThrough();
    editor.dispatchEvent(new Event('keyup'));

    spyOn(documentsAPIService, 'updateDocReq').and.stub();

    flush();

    fixture.detectChanges();
    expect(onKeyUp).toHaveBeenCalledTimes(1);
  }));

  it('test SetValue', fakeAsync(() => {
    expect(component.model.content).toEqual('console.log("Hello world!");');

    var fakeDoc = {
      _id: '123456789123',
      title: 'test title',
      content: 'test content',
    };

    component.setValue(fakeDoc);

    fixture.detectChanges();
    expect(component.model.content).toBe('test content');
    expect(component.model.title).toBe('test title');
  }));

  it('test modeSwitch', fakeAsync(() => {
    expect(component.isOn).toEqual(true);
    expect(component.editorOptions).toEqual({
      theme: 'vs-dark',
      language: 'javascript',
    });
    component.modeSwitch();
    expect(component.editorOptions).toEqual({
      theme: 'vs-light',
      language: 'javascript',
    });
    component.modeSwitch();
    expect(component.editorOptions).toEqual({
      theme: 'vs-dark',
      language: 'javascript',
    });
  }));

  it('test compile method', fakeAsync(() => {
    expect(component.model.content).toEqual('console.log("Hello world!");');

    let runButton = fixture.debugElement.query(
      By.css('#codeRunnerBtn')
    ).nativeElement;
    let compile = spyOn(component, 'compile').and.callThrough();

    runButton.dispatchEvent(new Event('click'));
    expect(compile).toHaveBeenCalledTimes(1);
    expect(executedCodeRes.nativeElement.textContent.trim()).toBe(
      'user@desktop$ Hello world!'
    );

    var fakeDoc = {
      _id: '123456789123',
      title: 'test title',
      content: '',
    };

    component.setValue(fakeDoc);
    expect(component.model.content).toEqual('');
    runButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(compile).toHaveBeenCalledTimes(2);
  }));
});
