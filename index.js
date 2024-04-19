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
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    ipcMain.handle('open-file-dialog', async (event) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile']
        });
        if (canceled) {
            return;
        } else {
            const content = await fs.promises.readFile(filePaths[0], 'utf8');
            return { content, filePath: filePaths[0] };
        }
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
