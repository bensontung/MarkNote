declare const R: any;
declare const fs: any;
declare const path: any;
declare const appPath: any;
declare const exec: any;
declare const md5: any;
declare const baseConfig: any;

import {Injectable} from '@angular/core';

@Injectable()
export class NodeService {

    public R: any;
    public fs: any;
    public path: any;
    public appPath: any;
    public exec: any;
    public baseConfig: any;
    public md5: any;

    constructor() {
        this.R          = R;
        this.fs         = fs;
        this.path       = path;
        this.exec       = exec;
        this.baseConfig = baseConfig;
        this.md5        = md5;
    }

}
