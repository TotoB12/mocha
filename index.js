const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');
    //   mainWindow.setMenuBarVisibility(false);

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
