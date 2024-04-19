const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: (callback) => ipcRenderer.on('file-selected', callback),
    readFile: (path, callback) => fs.readFile(path, 'utf-8', callback),
    send: (channel, data) => ipcRenderer.send(channel, data)
});
