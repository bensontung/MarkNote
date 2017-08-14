const fs            = require('fs');
const path          = require('path');
const electron      = require('electron');
const url           = require('url');
const app           = electron.app;
const ipcMain       = electron.ipcMain;
const Tray          = electron.Tray;
const Menu          = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

// 加载自动更新模块
const appUpdate = require('./appUpdate');

let mainWindow;
let tray = null;

// 创建渲染进程的窗口
function createWindow () {
    mainWindow = new BrowserWindow({
        width            : 1024,
        height           : 600,
        show             : false,
        minWidth         : 1024,
        minHeight        : 600,
        frame            : false,
        acceptFirstMouse : true,
        titleBarStyle    : 'hidden',
        autoHideMenuBar  : true,
        transparent      : false,
        backgroundColor  : '#FFF'
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.loadURL('http://localhost:4200/');
    mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    
    tray              = new Tray('./logo.ico');
    const contextMenu = Menu.buildFromTemplate([
        {
            label : '打开',
            click () {
                mainWindow.show();
            }
        },
        {
            label : '',
            type  : 'separator'
        },
        {
            label : '退出',
            click () {
                app.quit();
            }
        }
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

// 只允许开启一个实例
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    console.log(commandLine);
    console.log(workingDirectory);
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus()
    }
});

if (shouldQuit) {
    app.quit()
}

// 监听渲染进程的ready事件
app.on('ready', createWindow);

// 监听渲染进程的窗口关闭事件
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

// 监听渲染进程的窗口激活事件
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

// 相应渲染进程的窗口事件
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

// 自动升级配置
const updateConfig      = {};
updateConfig.remote     = `mn-update.wunao.net`
updateConfig.packPath   = `/dev/version/`;
updateConfig.diffJson   = `/dev/update.json`;
updateConfig.fileSuffix = `.asar`;
updateConfig.localJson  = path.join(__dirname, 'package.json');

const verInfo    = fs.readFileSync(updateConfig.localJson);
const verInfoOBJ = JSON.parse(verInfo.toString());
const verOBJ     = {};
verOBJ.version   = verInfoOBJ.version;
verOBJ.minor     = verInfoOBJ.minor;
global.localVersion = verOBJ;

// 监听渲染进程的请求更新事件
ipcMain.on('checkRemoteVersion', (event, arg) => {
    console.log('进来了1');
    new appUpdate(updateConfig, event.sender).init();
})


ipcMain.on('startUpdate', (event, arg) => {
    new appUpdate(updateConfig, event.sender).update(arg);
})

ipcMain.on('appReset', (event, arg) => {
    app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
    app.exit(0)
})

