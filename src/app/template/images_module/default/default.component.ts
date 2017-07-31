import {
    Component,
    OnInit,
    Inject,
    NgZone,
    ViewContainerRef,
    ComponentFactoryResolver,
    ViewChild,
    AfterViewInit,
} from '@angular/core';

import {ImagesModuleSettingComponent} from '../setting/setting.component';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

    public data: any;
    public out_dir: any;
    public quality: number;
    public format: any;
    public work_status: number;
    public work_count: number;
    public sendDatasSubscription: any;

    public formatData: any = [
        {id: 1, name: '原格式'},
        {id: 2, name: 'WebP'}
    ];

    constructor(
        private zone: NgZone,
        @Inject('db') private db,
        @Inject('dialog') private dialog,
        @Inject('modalComm') private modalComm,
        @Inject('node') private node,
        @Inject('E_service') private  E_service,
        @Inject('actionMessage') private actionMessage,
    ) {
        this.node.tinify.key = '';
        this.format = 1;
        this.work_count = 0;
        this.quality = 80;
        this.work_status = 0;
        this.data = [];
        this.out_dir = `${this.node.baseConfig.path.images}`;
        this.setTinyKey();
    }

    setTinyKey() {
        const this_ = this;
        this_.db.get('SELECT value FROM _images_setting WHERE name = "tinyKeys"', function (err, row) {
            const tinyKeys = JSON.parse(row.value);
            this_.zone.run(() => {
                this_.node.tinify.key = tinyKeys[0].key;
                this_.node.tinify.validate();
            });
        });
    }

    bytesToSize(bytes) {
        if (bytes === 0) {
            return '0 B';
        }
        const k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

    importFiles() {

        const options = {
            title: '选择文件',
            filters: [
                {name: 'Images', extensions: ['jpg', 'png']}
            ],
            properties: ['multiSelections']
        };
        this.E_service.remote.dialog.showOpenDialog(options, res => {
            const data = [];
            if (res && res.length > 0) {

                for (let i = 0; i < res.length; i++) {
                    const imagesInfo = this.node.imageinfo(this.node.fs.readFileSync(res[i]));
                    const filesStat = this.node.fs.statSync(res[i]);
                    const fileName = this.node.path.basename(res[i]);
                    const import_size = this.bytesToSize(filesStat.size);
                    const filesUrl = res[i];

                    let export_type = 'WEBP';

                    export_type = this.format === 1 ? imagesInfo.format : export_type;

                    const rowData = {
                        file_name: fileName,
                        file_url: filesUrl,
                        import_size: import_size,
                        export_type: export_type,
                        export_quality: '',
                        export_rate: '---',
                        export_status: 0,
                        export_size: '---',
                        export_time: '---'
                    };
                    data.push(rowData);
                }
                this.zone.run(() => {
                    this.data = data;
                    this.work_status = 1;
                });
            }
        });
    }

    formatChange(type) {
        if (this.data && this.data.length > 0) {
            switch (type) {
                case 1:
                    for (let i = 0; i < this.data.length; i++) {
                        const imagesInfo = this.node.imageinfo(this.node.fs.readFileSync(this.data[i].file_url));
                        this.data[i].export_type = imagesInfo.format;
                    }
                    break;
                case 2:
                    for (let i = 0; i < this.data.length; i++) {
                        this.data[i].export_type = 'WebP';
                    }
                    break;
            }
        }
    };

    importFolder() {
        const options = {
            title: '选择目录',
            filters: [
                {name: 'Images', extensions: ['jpg', 'png', 'gif']}
            ],
            properties: ['openDirectory']
        };
        this.E_service.remote.dialog.showOpenDialog(options, res => {
            console.log(res);
        });
    }

    exportFolder() {
        const options = {
            title: '选择输出目录',
            properties: ['openDirectory']
        };
        this.E_service.remote.dialog.showOpenDialog(options, res => {
            this.zone.run(() => {
                if (res && res.length > 0) {
                    this.out_dir = res[0];
                }
            });
        });
    }

    setEmpty() {
        this.data = [];
    }

    setting() {
        const this_ = this;
        this.modalComm.insert.emit(ImagesModuleSettingComponent);
        this.sendDatasSubscription = this.modalComm.sendDatas.subscribe((data) => {

            const setting: any = {};
            setting.tinyKeys = JSON.stringify(data.content.tinyKeys);
            this_.db.run('UPDATE _images_setting SET value = ? WHERE name = "tinyKeys"', [setting.tinyKeys], function (err, row) {
                this_.zone.run(() => {
                    this_.actionMessage.goMessage.emit({type: 'success', message: '更新配置成功!'});
                    this_.setTinyKey();
                });
            });
            this.sendDatasSubscription.unsubscribe();
        });
    }

    transformWebP() {
        const this_ = this;
        this.work_count = 0;
        this.work_status = 2;

        function getSize(export_url) {
            return this_.node.fs.statSync(export_url);
        }

        for (let i = 0; i < this.data.length; i++) {

            this.data[i].export_status = 1;

            const import_url = this.data[i].file_url;
            const export_url = `${this.out_dir}/${this.data[i].file_name}.webp`;
            const start_time = (new Date()).valueOf();
            const cmd_a = `start /B ${this.node.baseConfig.url}bin/webp/cwebp.exe -q ${this.quality} `;
            const cmd_b = `-m 6 -metadata all ${import_url} -o ${this.node.baseConfig.url}attached/images_zip/1.jpg.webp`;
            const cmd   = cmd_a + cmd_b;

            console.log(cmd);

            this.node.exec(cmd, function (res, res1, res2) {

                console.log(res1);

                const end_time   = (new Date()).valueOf();
                const count_time = end_time - start_time + 'ms';

                this_.zone.run(() => {

                    if (this_.work_count === this_.data.length - 1) {
                        this_.work_status = 1;
                    }

                    this_.data[i].export_status = 2;
                    this_.data[i].export_size = this_.bytesToSize(getSize(export_url).size);
                    this_.data[i].export_rate = (100 - getSize(export_url).size / getSize(import_url).size * 100).toFixed(2) + '%';
                    this_.data[i].export_time = count_time;
                });

                this_.work_count++;

            });
        }
    }

    transOther() {

        const compressionsThisMonth = this.node.tinify.compressionCount;
        if (compressionsThisMonth > 499) {
            this.actionMessage.goMessage.emit({type: 'warning', message: '当前tinyKey已受限，请更换tinyKey!'});
            return false;
        }

        const this_      = this;
        this.work_count  = 0;
        this.work_status = 2;

        function getSize(export_url) {
            return this_.node.fs.statSync(export_url);
        }

        for (let i = 0; i < this.data.length; i++) {

            this.data[i].export_status = 1;

            const import_url  = this.data[i].file_url;
            const export_type = this.data[i].export_type;
            const export_url  = `${this.out_dir}/${this.data[i].file_name}.${export_type}`;
            const start_time  = (new Date()).valueOf();

            this.node.fs.readFile(import_url, function (err, sourceData) {

                this_.node.tinify.fromBuffer(sourceData).toBuffer(function (err1, resultData) {
                    this_.node.fs.writeFile(export_url, resultData, function (err2) {

                        const end_time   = (new Date()).valueOf();
                        const count_time = end_time - start_time + 'ms';

                        this_.zone.run(() => {
                            if (this_.work_count === this_.data.length - 1) {
                                this_.work_status = 1;
                            }

                            const rate = (100 - getSize(export_url).size / getSize(import_url).size * 100).toFixed(2) + '%';
                            this_.data[i].export_status = 2;
                            this_.data[i].export_size = this_.bytesToSize(getSize(export_url).size);
                            this_.data[i].export_rate = rate;
                            this_.data[i].export_time = count_time;
                        });

                        this_.work_count++;

                    });
                });
            });
        }
    }

    start() {

        if (this.work_status === 0) {
            return false;
        }

        switch (this.format) {
            case 1 :
                this.transOther();
                break;
            case 2 :
                this.transformWebP();
                break;
        }

    }

    ngOnInit() {
    }

}
