import { DataService } from './../../services/data.service';
import { DisplayDoc } from './../documents/docs.interface';
import { DocumentsAPIService } from './../../services/documents.api.service';
import { BtnClicksService } from './../../services/btnClicks.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header.component';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de;
  let documentsAPIService: any;
  let dataService: any;
  let updateBtn: any;
  let btnClicksService: any;
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
      imports: [HttpClientModule, FormsModule],
      providers: [BtnClicksService],
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

  it('should send request to get a mock documents array when calling fetchSavedDocuments()', fakeAsync(() => {
    var spyOnFunc = spyOn(documentsAPIService, 'docsReq');

    component.fetchSavedDocuments();

    expect(spyOnFunc).toHaveBeenCalledTimes(1);

    spyOn(documentsAPIService, 'docsRes').and.returnValue(documents);

    expect(documentsAPIService.docsRes()).toEqual(documents);
  }));

  it('form should be invalid when submitting with a  title input less than 3 characters long', async () => {
    let saveSubmitMock = spyOn(component, 'onAddDocument').and.callThrough();

    await fixture.whenStable();
    let form = fixture.debugElement.query(By.css('form'));
    titleInput = form.nativeElement.querySelector('#title-input');
    titleInput.value = 'ca';

    titleInput.dispatchEvent(new Event('input'));

    let compiled = fixture.debugElement.nativeElement;
    let submitForm = form.triggerEventHandler('submit', compiled);

    expect(submitForm).toBeUndefined();
    expect(saveSubmitMock).toHaveBeenCalledTimes(1);
  });

  it('form should save when submitting with a title input equal or longer than 3 characters', async () => {
    expect(component.isSave).toBe(true);

    let saveSubmitMock = spyOn(component, 'onAddDocument').and.callThrough();
    let sendTitleService = spyOn(dataService, 'sendTitle').and.callThrough();
    let clickSaveBtnService = spyOn(
      btnClicksService,
      'clickSaveBtn'
    ).and.callThrough();

    await fixture.whenStable();
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

    expect(sendTitleService).toHaveBeenCalledTimes(1);
    expect(sendTitleService).toHaveBeenCalledWith('cat');
  });

  it('form should update when submitting with a title input equal or longer than 3 characters', async () => {
    component.isSave = false;
    expect(component.isSave).toBe(false);

    let updateSubmitMock = spyOn(component, 'onAddDocument').and.callThrough();
    let sendTitleService = spyOn(dataService, 'sendTitle').and.callThrough();
    let updateContentService = spyOn(
      dataService,
      'updatedContent'
    ).and.callThrough();
    let updateDocReqService = spyOn(
      documentsAPIService,
      'updateDocReq'
    ).and.callThrough();
    let initEditorDataService = spyOn(
      dataService,
      'initEditor'
    ).and.callThrough();

    await fixture.whenStable();
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
    expect(sendTitleService).toHaveBeenCalledTimes(1);
    expect(sendTitleService).toHaveBeenCalledWith('dog');
    expect(component.isSave).toEqual(true);
    expect(updateContentService).toHaveBeenCalledTimes(1);
    expect(updateSubmitMock).toHaveBeenCalledTimes(1);
    expect(updateDocReqService).toHaveBeenCalledTimes(1);
    expect(initEditorDataService).toHaveBeenCalledTimes(1);
  });
});
