import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {

    private storage: any;

    constructor() {
        this.storage = localStorage;
    }

    put(key, value) {
        localStorage[key] = value;
    }

    put_obj(key, object) {
        const value = JSON.stringify(object);
        localStorage[key] = value;
    }

    get(key) {
        return localStorage[key];
    }

    get_obj(key) {
        let data;
        if (localStorage[key]) {
            data = JSON.parse(localStorage[key]);
        }else {
            data = '';
        }
        return data;
    }

}
