import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UpdateDoc } from './../documents/docs.interface';
import { DataService } from '../../services/data.service';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { SocketIoService } from 'src/app/services/socket.io.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
})
export class CodeEditorComponent implements OnInit, OnDestroy {
  isOn = true;
  public mode = 'vs-dark';

  public editorOptions: object = {
    theme: this.mode,
    language: 'javascript',
  };
  modeSwitch() {
    this.isOn = !this.isOn;

    if (this.isOn == false) {
      this.editorOptions = {
        theme: 'vs-light',
        language: 'javascript',
      };
    } else {
      this.editorOptions = {
        theme: 'vs-dark',
        language: 'javascript',
      };
    }
  }

  onInit(editor: any) {
    let line = editor.getPosition();
    console.log(line);
  }
  clickSubscriber: Subscription;

  public model: UpdateDoc = {
    _id: '',
    title: 'undefined',
    content: 'console.log("Hello world!");',
    docType: 'code',
  };
  public decodedOutput: string | undefined;

  setValue(document: UpdateDoc) {
    this.model._id = document._id;
    this.model.content = document.content;
    this.model.title = document.title;
    this.model.docType = document.docType;
  }

  constructor(
    private dataService: DataService,
    private documentsAPI: DocumentsAPIService,
    private btnClicksService: BtnClicksService,
    private socketIoService: SocketIoService
  ) {
    this.dataService.updatedDocument().subscribe((document) => {
      this.model.title = document.title;
      this.model.content = document.content;
      this.model.docType = 'code';
    });

    this.clickSubscriber = this.btnClicksService
      .saveBtnClick()
      .subscribe(() => {
        this.dataService.getCurrentEditor().subscribe((res) => {
          if (res === 'code-editor') {
            this.documentsAPI
              .createDocReq({
                title: this.model.title,
                content:
                  this.model.content != ''
                    ? this.model.content
                    : 'console.log("Hello world!");',
                docType: 'code',
              })
              .subscribe();
            this.model.content = 'console.log("Hello world!");';
          }
        });
        setTimeout(() => {
          if (this.clickSubscriber) {
            this.clickSubscriber.unsubscribe();
          }
        }, 600);
      });

    this.documentsAPI.docByIdRes().subscribe((object) => {
      this.setValue(object);
    });

    this.btnClicksService.updateBtnClick().subscribe(() => {
      this.model.content = 'console.log("Hello world!");';
    });

    this.btnClicksService.deleteBtnClick().subscribe(() => {
      this.model.content = 'console.log("Hello world!");';
    });
  }

  ngOnDestroy() {
    if (this.clickSubscriber) {
      this.clickSubscriber.unsubscribe();
    }
  }

  public onKeyUp(event: KeyboardEvent) {
    event.preventDefault();

    this.socketIoService.listen('updateContent').subscribe((obj: any) => {
      this.model.content = obj.content;
    });

    this.dataService.updateDocument({
      _id: this.model._id,
      content: this.model.content,
      title: this.model.title,
      docType: 'code',
    });

    this.socketIoService.emit('updateDocument', this.model);
  }

  ngOnInit() {
    this.socketIoService
      .listen('updateDocument')
      .subscribe((doc: UpdateDoc) => {
        this.socketIoService.emit('updateContent', {
          id: doc._id,
          content: this.model.content,
          docType: 'code',
        });
        if (doc._id == this.model._id) {
          this.model.content = doc.content;
        }
        setTimeout(() => {
          this.documentsAPI.updateDocReq(this.model);
          this.documentsAPI.updateSharedDocReq(this.model);
        }, 2000);
      });
  }

  compile() {
    var data = {
      code: btoa(this.model.content || 'console.log("");'),
    };

    fetch('https://execjs.emilfolino.se/code', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(function (response) {
        return response.json();
      })
      .then((result: any) => {
        let decodedOutput = atob(result.data);
        this.decodedOutput = decodedOutput;
      });
  }
}
