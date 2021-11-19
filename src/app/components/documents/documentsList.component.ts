import { Component } from '@angular/core';
import { DocumentsAPIService } from '../../services/documents.api.service';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { DisplayDoc } from './docs.interface';
import { BtnClicksService } from 'src/app/services/btnClicks.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { User } from './user.interface';
import { NgForm } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documentsList.component.html',
  styleUrls: ['./documentsList.component.css'],
})
export class DocumentsComponent {
  public documents?: [DisplayDoc];
  public sharedDocuments?: DisplayDoc[];
  public users?: [User];
  public email?: string;
  public id: string = '';
  public title: string | undefined;
  public returnUserRes!: string;
  public isVisiblePDF: boolean = false;
  public visibleDocs: boolean = false;
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  closeResult = '';

  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  constructor(
    private documentsAPI: DocumentsAPIService,
    private btnClicksService: BtnClicksService,
    private socketIoService: SocketIoService,
    private modalService: NgbModal
  ) {
    this.documentsAPI.docsRes().subscribe((documents) => {
      this.documents = documents;
    });
    this.documentsAPI.sharedDocumentsRes().subscribe((documents) => {
      let res = documents.map((document: any) => {
        return document['docs'];
      });
      let arr = [];

      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].length; j++) {
          if (Object.keys(res[i][j]).includes('allowed_users')) {
            arr.push(res[i][j]);
          }
        }
      }

      this.sharedDocuments = arr;
    });
    this.documentsAPI.usersRes().subscribe((users) => {
      this.users = users;
    });
    this.btnClicksService.docsBtnClick().subscribe((bool) => {
      this.visibleDocs = bool;
      return this.visibleDocs;
    });
  }

  public deleteDocument(id: string) {
    this.documentsAPI.deleteDocReq(id).subscribe(() => {});
    this.btnClicksService.clickDocsBtn(true);

    this.documents?.forEach((document, index) => {
      if (document._id === id) this.documents?.splice(index, 1);
    });
    this.btnClicksService.clickDeleteBtn();
  }

  public updateDocument(id: string) {
    this.isVisiblePDF = true;
    this.id = id;

    this.socketIoService.emit('openDoc', id);

    this.btnClicksService.tglUpdateBtn(false);
    return this.documentsAPI.docByIdReq(id);
  }

  getChosenUser(doc: DisplayDoc) {
    this.id = doc._id;
    this.title = doc.title;
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public addUser(usersForm: NgForm) {
    if (usersForm.invalid) {
      this.returnUserRes = 'Enter a valid email!';
      return;
    }

    if (usersForm.value.email !== undefined) {
      this.documentsAPI.sendCollaborationInvite({
        email: usersForm.value.email,
        title: this.title,
        id: this.id,
      });
      this.returnUserRes = 'Done';
      this.modalService.dismissAll('Cross click');
    }
  }

  public exportHtmlToPDF(item: DisplayDoc) {
    if (this.id === item._id) {
      let data: any = document.getElementById('htmltable');

      html2canvas(data.lastChild.childNodes[1].nextElementSibling).then(
        (canvas) => {
          let docWidth = 208;
          let docHeight = (canvas.height * docWidth) / (canvas.width + 200);

          const contentDataURL = canvas.toDataURL('image/png');

          let doc = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight);
          if (item.title !== undefined) {
            doc.save(item.title + '.pdf');
          } else {
            doc.save('exportedPdf.pdf');
          }
        }
      );
      this.isVisiblePDF = false;
    } else {
      alert('Please open the document then click on download');
    }
  }
}
