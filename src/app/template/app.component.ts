import {
    Component,
    ViewContainerRef,
    ComponentFactoryResolver,
    ViewChild,
    AfterViewInit,
    Inject,
    NgZone,
    OnInit
} from '@angular/core';

import {SearchComponent} from './common/search/search.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {

    public module: Array<any>;
    public modalElement: any;
    public barStatus: number;
    public loading: boolean;
    public sendDatasSubscription: any;
    public searchPanel: boolean;

    @ViewChild('insert', {read: ViewContainerRef}) insert;

    constructor(
        private _cfr: ComponentFactoryResolver,
        @Inject('modalComm') private modalComm,
        @Inject('N_service') private N_service,
        public zone: NgZone
    ) {
        this.searchPanel = false;
        this.loading = false;
        this.module = [
            {name: 'note', icon: 'icon-orders', router: '/note', display: true},
            {name: 'remind', icon: 'icon-date', router: '/remind', display: false},
            {name: 'laboratory', icon: 'icon-bloodoxygen', router: '/laboratory', display: true}
        ];

        this.barStatus = 1;

        this.N_service.noteBarSwitch.subscribe((data) => {
            this.barStatus = data;
        });
    }

    ngAfterViewInit() {
        this.modalComm.insert.subscribe((data) => {
            this.insert.clear();
            const factory     = this._cfr.resolveComponentFactory(data);
            this.modalElement = this.insert.createComponent(factory);
        });
        this.modalComm.remove.subscribe(() => {
            this.removeModal();
            this.searchPanel = false;
        });
    }

    openSearchPanle() {
        this.modalComm.insert.emit(SearchComponent);
    }

    ngOnInit() {
        document.addEventListener('keyup', (event) => {
            if (event.keyCode === 70 && event.ctrlKey === true && event.shiftKey === true && this.searchPanel === false) {
                this.searchPanel = true;
                this.zone.run(() => {
                    this.openSearchPanle();
                });
            }
        })
    }

    removeModal() {
        this.modalElement.destroy();
    }

}
