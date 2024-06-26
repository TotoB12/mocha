const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");
const fs = require('fs');
const path = require('path');

setupTitlebar();

function createWindow() {
    const mainWindow = new BrowserWindow({
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true, // true
            contextIsolation: false, // false
            worldSafeExecuteJavaScript: true,
            // preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.maximize();

    mainWindow.loadFile('index.html');

    ipcMain.on('open-file-dialog', (event) => {
        dialog.showOpenDialog(mainWindow, {
            properties: ['openFile']
        }).then(result => {
            if (!result.canceled) {
                event.sender.send('file-selected', result.filePaths[0]);
            }
        }).catch(err => {
            console.log(err);
        });
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
