const electronn = require('electron');
electronn.ipcRenderer.send('gpu', document.body.innerHTML);
console.log(document.body.innerHTM);
