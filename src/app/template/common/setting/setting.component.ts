import {Component, OnInit, Inject, Input, Output, EventEmitter, NgZone} from '@angular/core';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

    public config: any;

    constructor() {
        this.config = {
            title: '全局设置',
            header: false,
            mask: true,
            footerButton: false,
            headerClose: true
        };
    }

    ngOnInit() {
    }

}
