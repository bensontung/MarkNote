import {
    Component,
    OnInit,
    Inject,
    NgZone,
    ViewContainerRef,
    ComponentFactoryResolver,
    ViewChild,
    AfterViewInit
} from '@angular/core';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.css'],
})

export class DefaultComponent implements OnInit {

    constructor(
        @Inject('dialog') private dialog,
        @Inject('modalComm') private modalComm
    ) {
    }

    ngOnInit() {
    }

}
