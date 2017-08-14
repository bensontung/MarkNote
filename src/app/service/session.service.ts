import {Injectable} from '@angular/core';

@Injectable()
export class SessionService {

    public obj: any;

    constructor() {
        this.obj = [];
    }

    set (key, value) {
        this.obj[key] = value;
    }

    get (key) {
        return this.obj[key];
    }

}
