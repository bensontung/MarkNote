declare const electron: any;
import {Injectable} from '@angular/core';

@Injectable()
export class DialogService {

    public win: any;
    public remote: any;
    public menu: any;
    public shell: any;
    public dialog: any;
    public menuItem: any;
    public BrowserWindow: any;
    public ipcRenderer: any;

    constructor() {

        this.remote        = electron.remote;
        this.menu          = electron.remote.Menu;
        this.shell         = electron.remote.shell;
        this.dialog        = electron.remote.dialog;
        this.menuItem      = electron.remote.MenuItem;
        this.BrowserWindow = electron.remote.BrowserWindow;
        this.ipcRenderer   = electron.ipcRenderer;

        this.win = this.BrowserWindow.getFocusedWindow();

    }

    showMessageBox(options, callback) {
        this.dialog.showMessageBox(this.win, options, callback);
    }

}
