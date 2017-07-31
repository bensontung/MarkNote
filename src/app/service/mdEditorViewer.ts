import {Component, Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class MDEditorViewerComm {

    public update_viewer: EventEmitter<any> = new EventEmitter<any>();
    public editor_save: EventEmitter<any> = new EventEmitter<any>();

}
