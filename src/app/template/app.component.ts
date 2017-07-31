import {
    Component,
    ViewContainerRef,
    ComponentFactoryResolver,
    ViewChild,
    AfterViewInit,
    Inject,
    NgZone
} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

    public module: Array<any>;
    public modalElement: any;
    public barStatus: number;
    public loading: boolean;

    @ViewChild('insert', {read: ViewContainerRef}) insert;

    constructor(
        private _cfr: ComponentFactoryResolver,
        @Inject('modalComm') private modalComm,
        @Inject('N_service') private N_service,
        public zone: NgZone
    ) {

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
        });

    }

    removeModal() {
        this.modalElement.destroy();
    }

}
