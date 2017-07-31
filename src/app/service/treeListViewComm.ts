import {Component, Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class TreeListViewComm {

    public update_tree: EventEmitter<any> = new EventEmitter<any>();
    public update_list: EventEmitter<any> = new EventEmitter<any>();
    public update_article: EventEmitter<any> = new EventEmitter<any>();
    public update_tabs: EventEmitter<any> = new EventEmitter<any>();
    public rename_tabs: EventEmitter<any> = new EventEmitter<any>();

}
