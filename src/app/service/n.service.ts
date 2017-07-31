import {Component, Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class NService {

    public noteBarSwitch: EventEmitter<any> = new EventEmitter<any>();

}
