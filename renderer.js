const { ipcRenderer } = require('electron');
const hljs = require('highlight.js');

const openFileBtn = document.getElementById('openFileBtn');
const editorContainer = document.getElementById('editor');
const codeBlock = document.querySelector('#editor > code');
const welcomeMenu = document.getElementById('welcomeMenu');

openFileBtn.addEventListener('click', async () => {
  try {
    const result = await ipcRenderer.invoke('open-file-dialog');
    if (result) {
      welcomeMenu.style.display = 'none';
      editorContainer.style.display = 'block';
      document.title = result.filePath.split('\\').pop();

      const language = determineLanguage(result.filePath);
      if (language && hljs.getLanguage(language)) {
        const highlightedCode = hljs.highlight(result.content, { language }).value;
        codeBlock.innerHTML = highlightedCode;
      } else {
        codeBlock.textContent = result.content;
      }
    }
  } catch (error) {
    alert('An error occurred reading the file:' + error);
  }
});

function determineLanguage(filePath) {
  const extension = filePath.split('.').pop().toLowerCase();
  switch (extension) {
    case 'js':
    case 'mjs':
      return 'javascript';
    case 'json':
      return 'json';
    default:
      return null; // default to no highlighting
  }
}
