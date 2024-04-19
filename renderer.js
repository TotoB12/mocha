const { ipcRenderer } = require('electron');
const { Titlebar } = require("custom-electron-titlebar");
const fs = require('fs');
import * as monaco from 'monaco-editor';

let currentEditor;
let titlebar = new Titlebar();
let currentFilePath = '';

document.getElementById('fileSelectBtn').addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('file-selected', (event, path) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      alert('An error occurred reading the file:', err);
      return;
    }
    const fileName = path.split('\\').pop();
    currentFilePath = path;
    showEditor(data, fileName);
  });
});

function showEditor(fileContents, fileName) {
  document.getElementById('welcomePage').style.display = 'none';
  const container = document.getElementById('editorContainer');
  container.style.display = 'block';

  if (currentEditor) {
    currentEditor.dispose(); // Dispose old editor instance if exists
  }

  currentEditor = monaco.editor.create(container, {
    value: fileContents,
    language: 'javascript',
    automaticLayout: true,
    fontSize: 18,
  });

  setTitle(fileName);  // Set the initial title without the star

  currentEditor.onDidChangeModelContent(() => {
    setTitle(fileName + " *");  // Add a star to indicate unsaved changes
  });

  window.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();  // Prevent the browser's save dialog
      saveFile();
    }
  });
}

function saveFile() {
  const model = currentEditor.getModel();
  const value = model.getValue();

  fs.writeFile(currentFilePath, value, (err) => {
    if (err) {
      alert('An error occurred saving the file:', err);
      return;
    }
    const fileName = currentFilePath.split('\\').pop();
    setTitle(fileName);  // Update title to remove the star
  });
}

function setTitle(title) {
  titlebar.updateTitle(title);  // Update the custom titlebar's title
}

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

// monaco.editor.create(document.getElementById('container'), {
// 	value: '',
// 	language: 'javascript',
// 	automaticLayout: true,
// 	fontSize: 18,
//   // fontFamily: 'Consolas, "Courier New", monospace',
// });
