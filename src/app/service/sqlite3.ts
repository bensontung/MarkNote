declare const sqlite3: any;
import {Injectable} from '@angular/core';

@Injectable()
export class DBService {

    public sqlite3: any;
    private db: any;

    constructor() {

        sqlite3.verbose();
        this.db = new sqlite3.Database('./database/database.db');

        return this.db;

    }

}
