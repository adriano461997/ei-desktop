import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import path from 'path';
import {updateElectronApp, UpdateSourceType} from "update-electron-app"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

updateElectronApp()

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Store = require('electron-store');
const store = new Store();

const createWindow = () => {
  // Create the browser window.
  new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
    center: true,
  });

  let mainWindowWa: BrowserWindow = null;

  const slug = store.get("slug")

  if(slug === undefined){

    mainWindowWa = new BrowserWindow({
      width: 600,
      height: 700,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: true
      },
      resizable: false,
      show: false,
      center: true,
    });

    mainWindowWa.maximize();

    mainWindowWa.show();

    mainWindowWa.setMenu(null);
    //mainWindowWa.webContents.openDevTools();
    mainWindowWa.loadFile("setEscola.html");

  } else {
    startApp();
  }

  // Event handler for asynchronous incoming messages
  ipcMain.on('box_error', (event, arg) => {
    dialog.showErrorBox("Ocorreu um erro", arg);
  })


  // Event handler for asynchronous incoming messages
  ipcMain.on('save_url', (event, arg) => {

    if(mainWindowWa){
      mainWindowWa.close();
    }
    store.set("slug", arg);
    startApp();
  })

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

const startApp = ()=>{

  const slug = store.get("slug")

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
    center: true,
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'Ajuda',
      click: ()=> {
        shell.openExternal("https://ajuda.escola.ao")
      }
    },
    {
      label: "Web",
      click: ()=> {
        shell.openExternal("https://"+slug+".escola.ao");
      }
    },
    {
      label: "Site principal",
      click: ()=> {
        shell.openExternal("https://escola.ao");
      }
    },
    {
      label: "Contactos",
      click: ()=> {
        shell.openExternal("https://escola.ao/contactos");
      }
    },
    {
      label: "Sobre",
      click: ()=> {
        const windowSobre = new BrowserWindow({
          width: 400,
          height: 400,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
          },
          maximizable: false,
          minimizable: false,
          center: true,
        });

        windowSobre.setTitle("Algo")
        windowSobre.setMenu(null);
        windowSobre.loadFile("sobre.html");
      }
    }
  ]);

  Menu.setApplicationMenu(menu);

  mainWindow.loadURL("https://"+slug+".escola.ao")

  const loadingWindow = new BrowserWindow({
    width: 512,
    height: 384,
    resizable: false,
    transparent: true,
    frame: false,
    center: true,
  })

  loadingWindow.loadFile('loading.html')

  mainWindow.webContents.on('did-finish-load', () => {
    if (loadingWindow) loadingWindow.close();
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.webContents.on('did-fail-load', () => {
    dialog.showErrorBox("Ocorreu um erro", "Não conseguimos carregar!")
    mainWindow.close();
  });

  mainWindow.on("close", ()=> {
    app.quit();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
