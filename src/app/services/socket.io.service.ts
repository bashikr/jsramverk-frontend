import { UpdateDoc } from './../components/documents/docs.interface';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class SocketIoService {
  constructor(private socket: Socket) {}

  public listen(eventName: string) {
    return new Observable<UpdateDoc>((Subscriber) => {
      this.socket.on(eventName, (data: UpdateDoc) => {
        Subscriber.next(data);
      });
    });
  }

  public emit(eventName: string, data: any) {
      this.socket.emit(eventName, data);
  }
}
