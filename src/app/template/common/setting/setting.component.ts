import {Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter, NgZone} from '@angular/core';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, OnDestroy {

    public config: any;
    public localVersion: any;
    public remoteVersion: any;
    public isNewVersion: any;
    public updateing: any;
    public progress: any;
    public update_text: any;
    public update_code: number;
    public updateDone: any;

    constructor(
        public Zone: NgZone,
        @Inject('E_service') private E_service,
        @Inject('modalComm') private modalComm,
        @Inject('session') private session
    ) {
        this.config = {
            title: '全局设置',
            header: false,
            mask: true,
            footerButton: false,
            headerClose: true
        };
        this.remoteVersion = {};
        this.localVersion = '';
        this.isNewVersion = 0;
        this.updateing = 0;
        this.progress = 0;
        this.update_text = '';
        this.update_code = 0;

        this.updateDone = this.session.get('updateDone') === true;

        console.log(this.session.get('updateDone'));

        // console.log(this.session.defaultSession.cookies.get({name: 'updateDone'}));

        // console.log(this.session.cookies);

        // 向主进程发送检测版本地与远端版本的请求
        this.E_service.ipcRenderer.send('checkRemoteVersion');
    }

    ngOnInit() {

        // 监听验证远端版本返回的事件
        this.E_service.ipcRenderer.once('onCheckRemoteVersion', (event, arg) => {
            this.Zone.run(() => {
                this.update_code = arg.code;
                if (arg.code === 3000) {
                    this.initVersion(arg);
                }
            });
        });

        // 监听升级时返回的进度事件
        this.E_service.ipcRenderer.on('onUpdateding', (event, arg) => {
            console.log('zzzz');
            this.Zone.run(() => {
                this.update_code = arg.code;
                if (arg.code === 4000) {
                    if (arg.data !== undefined) {
                        this.progress = arg.data * 100 + '%';
                        if (this.progress === '100%') {
                            this.update_text = '升级完毕';
                        }
                    }
                }
            });
        });


        // 监听升级完毕返回的事件
        this.E_service.ipcRenderer.once('onUpdateDone', (event, arg) => {
            this.session.set('updateDone', true);
            this.Zone.run(() => {
                this.update_code = arg.code;
                if (arg.code === 4003) {
                    this.updateDone  = true;
                    this.update_text = '升级成功';
                }
            });
        });
    }

    initVersion(arg) {
        this.remoteVersion = arg.data.remoteVerOBJ;
        setTimeout(() => {
            this.isNewVersion = arg.data.newVer ? 1 : 2;
            this.localVersion = arg.data.localVerOBJ;
        }, 1000);
    }

    appUpdate() {
        this.updateing = 1;
        this.update_text = '升级中 ...';
        this.E_service.ipcRenderer.send('startUpdate', this.remoteVersion);
    }

    appReset() {
        this.E_service.ipcRenderer.send('appReset');
    }

    ngOnDestroy() {
        this.E_service.ipcRenderer.removeAllListeners('onCheckRemoteVersion');
        this.E_service.ipcRenderer.removeAllListeners('onUpdateding');
        this.E_service.ipcRenderer.removeAllListeners('onUpdateDone');
    }

}
