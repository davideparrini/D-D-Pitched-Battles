import {app, BrowserWindow} from 'electron'
import path from 'path'
import { isDev } from './util.js';

app.on("ready", ()=>{
    const mainWindow = new BrowserWindow({});
    if(isDev()){
        mainWindow.loadURL('http://localhost:8888')
    }
    else{
        mainWindow.loadFile(path.join(app.getAppPath() + '/dist/dist-react/index.html'));
    }
})

const handleCloseEvents = (mainWindow: BrowserWindow) => {
    let willClose = false;
  
    mainWindow.on('close', (e) => {
      if (willClose) {
        return;
      }
      e.preventDefault();
      mainWindow.hide();
      if (app.dock) {
        app.dock.hide();
      }
    });
  
    app.on('before-quit', () => {
      willClose = true;
    });
  
    mainWindow.on('show', () => {
      willClose = false;
    });
}