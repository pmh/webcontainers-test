import { WebContainer } from "./node_modules/@webcontainer/api/dist/index.js";
import { files } from './files.js';

document.querySelector('#app').innerHTML = `
    <div class="container">
        <div class="editor">
        <textarea>I am a textarea</textarea>
        </div>
        <div class="preview">
        <iframe src="loading.html"></iframe>
        </div>
    </div>
`
const iframeEl = document.querySelector('iframe');
const textareaEl = document.querySelector('textarea');

let webcontainerInstance;

async function installDependencies() {
    // Install dependencies
    const installProcess = await webcontainerInstance.spawn('npm', ['install']);
    installProcess.output.pipeTo(new WritableStream({
        write(data) {
            console.log(data);
        }
    }));
    // Wait for install command to exit
    return installProcess.exit;
}

async function startDevServer() {
    // Run `npm run start` to start the Express app
    await webcontainerInstance.spawn('npm', ['run', 'start']);

    // Wait for `server-ready` event
    webcontainerInstance.on('server-ready', (port, url) => {
        console.log('url', url)
        iframeEl.src = url;
    });
}


/** @param {string} content*/

async function writeIndexJS(content) {
    await webcontainerInstance.fs.writeFile('/index.js', content);
    fetch('/save-files', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: await webcontainerInstance.fs.readFile('/index.js', 'utf8') })
    })
};
  
  

window.addEventListener('load', async () => {
    textareaEl.value = files['index.js'].file.contents

    textareaEl.addEventListener('input', (e) => {
        writeIndexJS(e.currentTarget.value);
    });
    
    // Call only once
    webcontainerInstance = await WebContainer.boot();
    await webcontainerInstance.mount(files)

    const exitCode = await installDependencies()
    if (exitCode !== 0) {
        throw new Error('Installation failed')
    }

    startDevServer()
});