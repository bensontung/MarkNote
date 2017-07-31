import {Component, Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class ActionMessageComm {

    public goMessage: EventEmitter<any> = new EventEmitter<any>();

}
