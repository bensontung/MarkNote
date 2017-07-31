import {Component, OnInit, Inject, NgZone} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public isMaximize = false;
    public columnNum = 1;

    constructor(
        @Inject('E_service') private E_service,
        @Inject('N_service') private N_service,
        public zone: NgZone
    ) {

    };

    ngOnInit() {
        this.E_service.ipcRenderer.on('windMaximize', (event, message) => {
            this.zone.run(() => {
                this.isMaximize = true;
            });
        });

        this.E_service.ipcRenderer.on('windUnmaximize', (event, message) => {
            this.zone.run(() => {
                this.isMaximize = false;
            });
        });
    }

    columnSwitch() {
        this.columnNum++;
        if (this.columnNum === 5) {
            this.columnNum = 1;
        }
        this.N_service.noteBarSwitch.emit(this.columnNum);
    }

    actionWin(type) {
        this.E_service.ipcRenderer.send('actionWin', type);
    }

}
