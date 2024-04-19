const { ipcRenderer } = require('electron');
const { Titlebar } = require("custom-electron-titlebar");

window.addEventListener('DOMContentLoaded', () => {
  new Titlebar();
});

import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
};

monaco.editor.defineTheme('default', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {
        token: "identifier",
        foreground: "9CDCFE"
      },
      {
        token: "identifier.function",
        foreground: "DCDCAA"
      },
      {
        token: "type",
        foreground: "1AAFB0"
      }
    ],
    colors: {}
    });
monaco.editor.setTheme('default')

// monaco.editor.setTheme('vs-dark');

monaco.editor.create(document.getElementById('container'), {
	value: '',
	language: 'javascript',
	automaticLayout: true,
	fontSize: 18,
    // fontFamily: 'Consolas, "Courier New", monospace',
});
