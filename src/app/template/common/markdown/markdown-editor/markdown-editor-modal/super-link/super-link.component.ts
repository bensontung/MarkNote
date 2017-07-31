import {Component, OnInit, OnDestroy, Inject, ViewChild, AfterViewInit} from '@angular/core';

@Component({
    selector: 'app-super-link',
    templateUrl: './super-link.component.html',
    styleUrls: ['./super-link.component.css']
})
export class SuperLinkComponent implements OnInit, AfterViewInit, OnDestroy {

    public config: object;
    public superLink: any;
    @ViewChild('appModal') appModal;
    private onConfirmSubscription: any;
    private onCloseSubscription: any;
    public onModalConfirm: any;
    public onModalClose: any;

    constructor(@Inject('modalComm') private modalComm) {
        this.superLink = {
            text: ''
        };
        this.config = {
            title: '插入超链接',
            footerButton: true,
            headerClose: true
        };
    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        this.onCloseSubscription = this.modalComm.onClose.subscribe(() => {
            this.appModal.closeModal();
        });
        this.onConfirmSubscription = this.modalComm.onConfirm.subscribe(() => {
            this.emitSuperLink();
        });
    }

    emitSuperLink() {
        if (this.superLink.text.length > 0) {
            const data = {
                type: 'superLink',
                url: this.superLink.text
            };
            this.modalComm.sendDatas.emit(data);
            this.appModal.closeModal();
        }
    }

    ngOnDestroy() {
        this.onConfirmSubscription.unsubscribe();
        this.onCloseSubscription.unsubscribe();
    }

}

