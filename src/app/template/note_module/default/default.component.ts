import {Component, OnInit, Inject} from '@angular/core';
import {TreeListViewComm} from '../../../service/treeListViewComm';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.css'],
    viewProviders: [TreeListViewComm]
})
export class DefaultComponent implements OnInit {

    public barStatus: number;

    constructor(
        @Inject('N_service') private N_service
    ) {
        this.barStatus = 1;
        this.N_service.noteBarSwitch.subscribe((data) => {
            this.barStatus = data;
        });
    }

    ngOnInit() {
    }

}
