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

    mainWindow.loadFile('index.html');
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
