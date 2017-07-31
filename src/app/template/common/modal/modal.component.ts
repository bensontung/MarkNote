import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

    public modal: boolean;
    @Input() config: any;

    constructor(@Inject('modalComm') private modalComm) {
        this.modal               = true;
        this.config              = {};
        this.config.title        = '对话框';
        this.config.footerButton = true;
        this.config.headerClose  = true;
    }

    closeModal() {
        this.modal = false;
        this.modalComm.remove.emit();
    }

    buttonClose() {
        this.modalComm.onClose.emit();
    }

    buttonConfirm() {
        this.modalComm.onConfirm.emit();
    }

    ngOnInit() {
    }

}
