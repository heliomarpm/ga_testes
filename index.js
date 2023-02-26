const { app, BrowserWindow, screen, ipcMain, globalShortcut } = require('electron');
const path = require("path");
const fs = require("fs");
const settings = require("electron-settings");

const IS_DEBUG = process.argv.indexOf("--developer") != -1;

let win;
function createWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;
    const winPosition = getInitPosition({ width: 464, height: size.height });

    win = new BrowserWindow({
        icon: __dirname + "./app/assets/icon.png",
        // width: 464,
        // height: size.height,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            //preload: path.join(__dirname, 'preload.js'),
        },
        resizable: true,
        maximizable: true,
        autoHideMenuBar: true,
        ...winPosition
    })

    if (IS_DEBUG) {
        win.openDevTools({ detach: true });
        win.maximize();
    }

    createEvents()

    // win.setAlwaysOnTop(true, 'screen');
    win.loadFile(__dirname + '/app/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') app.quit();
});


function createEvents() {
    globalShortcut.register('f5', function () {
        console.log('f5 is pressed')
        win.reload()
    })
    globalShortcut.register('CommandOrControl+R', function () {
        console.log('CommandOrControl+R is pressed')
        win.reload()
    })

    win.addListener('ready-to-show', () => {
        win.show()
    })

    win.addListener('onclick', () => {
        console.log('click')
        win.transparent = !win.transparent;
    })

    win.on("close", () => {
        saveIniPosition();
    })
    win.on("closed", () => {
        win = null;
    });

    // ipcMain.on('open-file', (event, file) => {
    //     console.log(file)
    //     win.loadFile(file)
    // });

    ipcMain.on('closeApp', () => {
        win.close();
        app.quit();
    });

}

function getInitPosition(defaultPosition) {
    return settings.getSync("win-position") ?? defaultPosition;
}

function saveIniPosition() {
    settings.setSync("win-position", win.getBounds());
}