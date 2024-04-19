const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'api', {
        loadFile: (path) => ipcRenderer.invoke('load-file', path),
        onSaveFile: (callback) => ipcRenderer.on('save-file', callback)
    }
);
