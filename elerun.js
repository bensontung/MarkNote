const electron = require('electron');
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


let mainWindow;
let tray = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        show: false,
        minWidth: 1024,
        minHeight: 600,
        frame: false,
        acceptFirstMouse: true,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        transparent: false,
//        backgroundColor: '#FFF'
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.loadURL('http://localhost:4200/');
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    tray = new Tray('./logo.ico');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '打开', click(){
            mainWindow.show();
        }
        },
        {label: '', type: 'separator'},
        {
            label: '退出', click(){
            app.quit();
        }
        },
    ]);

    tray.setToolTip('MarkNote');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
        mainWindow.show();
    });

    mainWindow.on('maximize', function (e) {
        mainWindow.webContents.send('windMaximize');
    });

    mainWindow.on('unmaximize', function (e) {
        mainWindow.webContents.send('windUnmaximize');
    });

}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    console.log(commandLine);
    console.log(workingDirectory);
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus()
    }
});

if (shouldQuit) {
    app.quit()
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }[]
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

ipcMain.on('actionWin', (event, arg) => {
    switch (arg) {
        case 'minimize':
            mainWindow.minimize();
            break;
        case 'maximize':
            mainWindow.maximize();
            break;
        case 'restore':
            mainWindow.unmaximize();
            break;
        case 'close':
            mainWindow.hide();
            break;
    }
});
