import { DataService } from './../../services/data.service';
import { DisplayDoc } from './../documents/docs.interface';
import { DocumentsAPIService } from './../../services/documents.api.service';
import { BtnClicksService } from './../../services/btnClicks.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header.component';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

const config: SocketIoConfig = { url: 'http://localhost:1337', options: {} };

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de;
  let documentsAPIService: any;
  let dataService: DataService;
  let updateBtn: DebugElement;
  let btnClicksService: BtnClicksService;
  let titleInput: HTMLInputElement;
  const documents: Array<DisplayDoc> = [
    {
      _id: '123456123456',
      title: 'first document',
      content: 'first content',
      creationDate: new Date('2021-01-01'),
    },
    {
      _id: '123456123457',
      title: 'second document',
      content: 'second content',
      creationDate: new Date('2021-01-02'),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [HttpClientModule, RouterTestingModule, FormsModule, SocketIoModule.forRoot(config)],
      providers: [BtnClicksService, SocketIoService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    btnClicksService = de.injector.get(BtnClicksService);
    documentsAPIService = de.injector.get(DocumentsAPIService);
    dataService = de.injector.get(DataService);

    updateBtn = fixture.debugElement.query(By.css('#documents-hide-button'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the toggleDocuments bool state when clicking on the documents button', () => {
    spyOn(documentsAPIService, 'docsReq').and.stub();

    expect(component.toggleDocuments).toEqual(false);

    updateBtn.triggerEventHandler('btnClick', 'fetchSavedDocuments');

    expect(component.toggleDocuments).toEqual(true);

    updateBtn.triggerEventHandler('btnClick', 'fetchSavedDocuments');

    expect(component.toggleDocuments).toEqual(false);
  });

  it('should toggle the buttonName string state when clicking on the documents button ', () => {
    spyOn(documentsAPIService, 'docsReq').and.stub();

    expect(component.buttonName).toEqual('Documents');

    updateBtn.triggerEventHandler('btnClick', 'fetchSavedDocuments');

    expect(component.buttonName).toEqual('Hide');
    updateBtn.triggerEventHandler('btnClick', 'fetchSavedDocuments');

    expect(component.buttonName).toEqual('Documents');
  });

  it('should send request to get a mock documents array when calling fetchSavedDocuments()', (() => {
    var spyOnFunc = spyOn(documentsAPIService, 'docsReq');

    component.fetchSavedDocuments();

    expect(spyOnFunc).toHaveBeenCalledTimes(1);

    spyOn(documentsAPIService, 'docsRes').and.returnValue(documents);

    expect(documentsAPIService.docsRes()).toEqual(documents);
  }));

  it('form should be invalid when submitting with a  title input less than 3 characters long', fakeAsync(() => {
    let saveSubmitMock = spyOn(component, 'onAddDocument').and.callThrough();

    fixture.whenStable();
    let form = fixture.debugElement.query(By.css('form'));
    titleInput = form.nativeElement.querySelector('#title-input');
    titleInput.value = 'ca';

    titleInput.dispatchEvent(new Event('input'));

    let compiled = fixture.debugElement.nativeElement;
    let submitForm = form.triggerEventHandler('submit', compiled);

    expect(submitForm).toBeUndefined();
    expect(saveSubmitMock).toHaveBeenCalledTimes(1);
  }));

  it('form should save when submitting with a title input equal or longer than 3 characters', fakeAsync(() => {
    expect(component.isSave).toBe(true);

    let saveSubmitMock = spyOn(component, 'onAddDocument').and.callThrough();
    let updateDocument = spyOn(dataService, 'updateDocument').and.callThrough();
    let clickSaveBtnService = spyOn(
      btnClicksService,
      'clickSaveBtn'
    ).and.callThrough();

    tick(5000);

    fixture.whenStable();
    let form = fixture.debugElement.query(By.css('form'));
    titleInput = form.nativeElement.querySelector('#title-input');
    titleInput.value = 'cat';

    titleInput.dispatchEvent(new Event('input'));

    let compiled = fixture.debugElement.nativeElement;
    let submitForm = form.triggerEventHandler('submit', compiled);

    expect(submitForm).toBeUndefined();
    expect(saveSubmitMock).toHaveBeenCalledTimes(1);

    expect(component.document.title).toEqual('');

    expect(clickSaveBtnService).toHaveBeenCalledTimes(1);

    expect(updateDocument).toHaveBeenCalledTimes(1);
  }));

  it('form should update when submitting with a title input equal or longer than 3 characters', async () => {
    component.isSave = false;
    expect(component.isSave).toBe(false);

    let updateSubmitMock = spyOn(component, 'onAddDocument').and.callThrough();
    let updateDocService = spyOn(
      dataService,
      'updateDocument'
    ).and.callThrough();
    let updateDocReqService = spyOn(
      documentsAPIService,
      'updateDocReq'
    ).and.callThrough();

    fixture.whenStable();

    let form = fixture.debugElement.query(By.css('form'));
    titleInput = form.nativeElement.querySelector('#title-input');
    titleInput.value = 'dog';

    titleInput.dispatchEvent(new Event('input'));
    expect(component.document.content).toEqual('');

    let compiled = fixture.debugElement.nativeElement;

    expect(component.onAddDocument).toHaveBeenCalledTimes(0);

    let submitForm = form.triggerEventHandler('submit', compiled);

    expect(submitForm).toBeUndefined();
    expect(component.onAddDocument).toHaveBeenCalledTimes(1);
    expect(updateDocService).toHaveBeenCalledTimes(1);
    expect(component.isSave).toEqual(true);
    expect(updateSubmitMock).toHaveBeenCalledTimes(1);
    expect(updateDocReqService).toHaveBeenCalledTimes(1);
  });
});
