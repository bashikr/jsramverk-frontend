import { DisplayDoc } from './../documents/docs.interface';
import { Component, OnInit, Input } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pdf-component',
  templateUrl: './pdf-component.component.html',
  styleUrls: ['./pdf-component.component.css'],
})
export class PdfComponentComponent implements OnInit {
  @Input() item!: DisplayDoc;
  @Input() id!: string;
  data: any = document.getElementById('htmltable');

  constructor() {}
  ngOnInit(): void {}

  public exportHtmlToPDF() {
    if (this.id === this.item._id) {
      html2canvas(this.data.lastChild.childNodes[1].nextElementSibling).then(
        (canvas) => {
          let docWidth = 208;
          let docHeight = (canvas.height * docWidth) / (canvas.width + 200);

          const contentDataURL = canvas.toDataURL('image/png');

          let doc = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight);
          if (this.item.title !== undefined) {
            doc.save(this.item.title + '.pdf');
          } else {
            doc.save('exportedPdf.pdf');
          }
        }
      );
    }
  }
}
