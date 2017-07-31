import {Component, OnInit, Inject} from '@angular/core';

@Component({
    selector: 'app-action-message',
    templateUrl: './action-message.component.html',
    styleUrls: ['./action-message.component.css']
})
export class ActionMessageComponent implements OnInit {

    public show: boolean;
    public message: string;
    public type: string;

    constructor(@Inject('actionMessage') private actionMessage) {

        let t: any;

        this.actionMessage.goMessage.subscribe((data) => {

            t            = null;
            this.show    = true;
            this.type    = data.type;
            this.message = data.message;

            t = setTimeout(() => {
                this.show    = false;
                this.message = '';
            }, 2000);

        });
    }

    ngOnInit() {
    }

}
