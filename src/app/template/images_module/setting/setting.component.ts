import {Component, OnInit, OnDestroy, Inject, ViewChild, AfterViewInit, NgZone} from '@angular/core';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})
export class ImagesModuleSettingComponent implements OnInit, AfterViewInit, OnDestroy {

    public config: object;
    public superLink: any;
    @ViewChild('appModal') appModal;
    private onConfirmSubscription: any;
    private onCloseSubscription: any;
    public onModalConfirm: any;
    public onModalClose: any;

    public tinyKeys: any;

    constructor(
        @Inject('modalComm') private modalComm,
        @Inject('node') private node,
        @Inject('db') private db,
        private zone: NgZone
    ) {

        this.tinyKeys = [];

        this.superLink = {
            text: ''
        };
        this.config = {
            title: '配置项',
            footerButton: true,
            headerClose: true
        };
        this.select();
    }

    select() {
        const this_ = this;
        this_.db.get('SELECT value FROM _images_setting WHERE name = "tinyKeys"', function (err, row) {
            const tinyKeys = JSON.parse(row.value);
            this_.zone.run(() => {
                this_.tinyKeys = tinyKeys;
                this_.loadAutocheckTinyKey();
            });
        });
    }

    ngOnInit(): void {

    }

    loadAutocheckTinyKey() {
        for (let i = 0; i < this.tinyKeys.length; i++) {
            this.tinyKeys[i].status = 0;
            this.checkTinyKey(i, this.tinyKeys[i].key);
        }
    }

    checkTinyKey(index, key) {

        if (this.tinyKeys[index].status === 1) {
            return false;
        }

        const this_ = this;
        this.node.tinify.key = key;
        this.tinyKeys[index].status = 1;
        this.node.tinify.validate(function (err) {
            if (err) {
                this_.zone.run(() => {
                    this_.tinyKeys[index].status = -1;
                    this_.tinyKeys[index].compressionCount = '?';
                });
            } else {
                this_.zone.run(() => {
                    this_.tinyKeys[index].status           = 2;
                    const compressionsThisMonth            = this_.node.tinify.compressionCount;
                    console.log(this_.node.tinify);
                    this_.tinyKeys[index].compressionCount = compressionsThisMonth;
                    console.log(compressionsThisMonth);
                });
            }

        });
    }

    ngAfterViewInit() {
        this.onCloseSubscription = this.modalComm.onClose.subscribe(() => {
            this.appModal.closeModal();
        });
        this.onConfirmSubscription = this.modalComm.onConfirm.subscribe(() => {
            this.emitSetting();
        });
    }

    emitSetting() {
        const data = {
            type: 'setting',
            content: {
                tinyKeys: this.tinyKeys
            }
        };
        this.modalComm.sendDatas.emit(data);
        this.appModal.closeModal();
    }

    ngOnDestroy() {
        this.onConfirmSubscription.unsubscribe();
        this.onCloseSubscription.unsubscribe();
    }

}

