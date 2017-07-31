import {Component, Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class ModalComm {
    public insert:    EventEmitter<any> = new EventEmitter<any>();
    public remove:    EventEmitter<any> = new EventEmitter<any>();
    public onClose:   EventEmitter<any> = new EventEmitter<any>();
    public onConfirm: EventEmitter<any> = new EventEmitter<any>();
    public sendDatas: EventEmitter<any> = new EventEmitter<any>();
}
