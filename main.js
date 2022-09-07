const {app, dialog, BrowserWindow, Menu, MenuItem, ipcMain, ipcRenderer, nativeTheme, globalShortcut, session} = require('electron')
const shell = require('electron').shell;
const path = require('path')


let myWindow = null

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore()
      myWindow.focus()
    }
  })

  app.whenReady().then(() => {
    myWindow = createWindow()
  })
}
const {autoUpdater} = require("electron-updater");
const aboutMessage = `عالم شبلول | Tweegee`;


//ipcMain.on('location', (event, arg) => {

  const DiscordRPC = require('discord-rpc');
  

  const clientId = '968913503710748712';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

const startTimestamp = new Date();

async function setActivity(location) {
  if (!rpc || !mainWindow) {
    return;
  }
  



  const boops = await mainWindow.webContents.executeJavaScript('window.boops');
  
  

  rpc.setActivity({
    state:  location,
    startTimestamp,
    largeImageKey: 'shablol',
    largeImageText: 'عالم شبلول',
    smallImageKey: 'shsmall',
    smallImageText: 'عالم شبلول',
    instance: false,
    buttons: [{label: "Visit Game Website", url: "https://www.cocolani.net"}]
    

    
  });
}

rpc.on('ready', () => {

  
  setActivity();

});

rpc.login({ clientId }).catch(console.error);

  
//})

const https = require('https');

function getLocation(username){
	https.get(`https://www.cocolani.net/lshablol.php?uname=${username}`, function(res) {
		console.log(res.statusCode);
		res.setEncoding('utf8');
		res.on('data', function(data) {			
			
			setActivity(data)
			
		});
	}).on('error', function(err) {
		//alert(err);
	});
	}


ipcMain.on('username', (event, arg) => {  
  getLocation(arg)
  setInterval(() => {
    getLocation(arg)
    }, 5e3);

})


let pluginName
switch (process.platform) {
	case 'win32':
		imageName = 'windows_icon';
		switch (process.arch) {
			case 'ia32':
			case 'x32':
				pluginName = 'flash/windows/32/pepflashplayer.dll'
				break
			case 'x64':
				pluginName = 'flash/windows/64/pepflashplayer.dll'
				break
			}
		break
	case 'linux':
		imageName = 'linux_icon';
		switch (process.arch) {
			case 'ia32':
			case 'x32':
				pluginName = 'flash/linux/32/libpepflashplayer.so'
				break
			case 'x64':
				pluginName = 'flash/linux/64/libpepflashplayer.so'
				break
			}
		
		app.commandLine.appendSwitch('no-sandbox');
		break
	case 'darwin':
		imageName = 'mac_os_icon';
		pluginName = 'flash/mac/PepperFlashPlayer.plugin'
		break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch("disable-http-cache");


/**
 * Activates Discord Rich Presence
 * @returns {void}
 */

/**
 * creates the loading screen
 * @returns {void}
 */
let loadingScreen;
function createLoadingScreen(){
  /// create a browser mainWindow
  
  loadingScreen = new BrowserWindow({
      /// define width and height for the mainWindow
      width: 200,
      height: 300,
      /// remove the mainWindow frame, so it will become a frameless mainWindow
      frame: false,
      /// and set the transparency, to remove any mainWindow background color
      transparent: true,
    }
  );
  if(mainWindow) mainWindow.close()
  loadingScreen.setResizable(false);
  loadingScreen.loadURL(
    'file://' + __dirname + '/window/loading.html'
  );
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
	createWindow();
	mainWindow.webContents.on('did-finish-load', () => {
		if(loadingScreen) loadingScreen.close()
		//if(!rpc) activateRPC()
		mainWindow.show()
	})
  });
};
/**
 * Creates the Menu Bar
 * @returns {Menu}
 */
 function createMenu() { 
    fsmenu = new Menu();
    if (process.platform == 'darwin') {
        fsmenu.append(new MenuItem({
            label: "عالم شبلول - Tweegee",
            submenu: [
                {
                    label: 'Full Screen',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        mainWindow.webContents.send('fullscreen', mainWindow.isFullScreen());
                    }
                },
                {
                    label: 'Mute',
					accelerator: 'CmdOrCtrl+M',
                    click: () => {
                        mainWindow.webContents.audioMuted = !mainWindow.webContents.audioMuted;
                        mainWindow.webContents.send('muted', mainWindow.webContents.audioMuted);
                    }
                },
                {
                    label: 'Refresh',
                    accelerator: 'CmdOrCtrl+R',
                    click (item, focusedWindow) {
                         if (focusedWindow) focusedWindow.reload()
                    }
                },
                {
                    label: 'Dark Mode (Toggle)',
                    click: () => {
                        darkMode()
                    }
                },
                {
                  label: 'Discord',
                  click: () => mainWindow.loadURL('https://discord.gg/vCUVwfP2VH')
              },
              {
                label: 'Store',
                click: () => mainWindow.loadURL('https://www.cocolani.net/store')
            },
                {
                  label: 'App Version',
                  click: () => app.getVersion()
                },
                
                {
                  label: '',
        click: () => clearCacheAndReload()
              }
            ]
        }));
    } else {
        fsmenu.append(new MenuItem({
            'label': 'Official Website',
            click: () => shell.openExternal('https://www.cocolani.net/')
        }));
        fsmenu.append(new MenuItem({
          'label': 'Discord',
          click: () => shell.openExternal('https://discord.gg/vCUVwfP2VH',)
      }));
      fsmenu.append(new MenuItem({
        'label': 'Store',
        click: () => shell.openExternal('https://www.cocolani.net/store',)
    }));
        fsmenu.append(new MenuItem({
            label: 'Full Screen',
            accelerator: 'CmdOrCtrl+F',
            click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Refresh',
            accelerator: 'CmdOrCtrl+R',
            click (item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload()
            }
        }));
        fsmenu.append(new MenuItem({
          label: 'Mute',
    accelerator: 'CmdOrCtrl+M',
          click: () => {
              mainWindow.webContents.audioMuted = !mainWindow.webContents.audioMuted;
              mainWindow.webContents.send('muted', mainWindow.webContents.audioMuted);
          }
      }));
      fsmenu.append(new MenuItem({
        label: 'App Version',
        click: () => {
          dialog.showMessageBox({
            type: "info",
            buttons: ["Ok"],
            title: "App Version",
            message: 'Current Version is ' + app.getVersion()
            });
     
      
            
        }
    }));
    fsmenu.append(new MenuItem({
      label: '',
      click: () => clearCacheAndReload()
  }));

    }
	return fsmenu
}
/**
 * creates MainWindow
 * @returns {void}
 */
let mainWindow;


function createWindow () {
  // Create the browser mainWindow.
  mainWindow = new BrowserWindow({
    useContentSize: true,
    show: false,
    title: "عالم شبلول | Tweegee",
    webPreferences: {
	  preload: path.join(__dirname, './preload.js'),
      plugins: true,
      nodeIntegration: false,
	  webSecurity: false
    }
  })
  registerKeys()
  
  Menu.setApplicationMenu(createMenu());
  //mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.loadURL('https://www.cocolani.net/ch/main/index.php')
  autoUpdater.checkForUpdates()
  
  
  
  
 

};
autoUpdater.on('update-available', (updateInfo) => {
  dialog.showMessageBox({
  type: "info",
  buttons: ["Ok"],
  title: "Update Available",
  message: "There is a new version available (v" + updateInfo.version + "). It will be installed automatically."
  });
 
}
);
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
dialog.showMessageBox({
type: "info",
buttons: ["Ok"],
title: "Update Downloaded",
message: "Update has been installed successfully, the app will restart now to apply the updates."
});
setTimeout(() => {autoUpdater.quitAndInstall();}, 5000);

})




   





/**
 * Clears cache and reload
 * @returns {void}
 */
function clearCacheAndReload() {
	const ses = mainWindow.webContents.session;
	ses.clearCache().then(() => mainWindow.webContents.send('reload'));
}

/**
 * Registers the Shortcuts
 * @returns {void}
 */
function registerKeys() {
	globalShortcut.register('CmdOrCtrl+Shift+I', () => {
		mainWindow.webContents.openDevTools();
	})
}
/**
 * Toggles Dark mode
 * @returns {Boolean}
 */
function darkMode() {
	nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    mainWindow.webContents.send('theme', nativeTheme.themeSource);
    return nativeTheme.shouldUseDarkColors
}

/**
 * Auto Updater and Events!
 */
 
/**
* This event will fire if update is downloaded

/**
 * This event will fire if electron is ready

 */

app.whenReady().then(() => { 
  createLoadingScreen()
  autoUpdater.checkForUpdatesAndNotify();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoadingScreen()
  })
})

/**
 * This event will fire if the windows are all closed
 * @returns {void}
 */


/**
 
module.exports = {
    lintOnSave: false,
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          productName: '...',
          win: {
            icon: '222-3.ico'
          }
        }
      }
    }
  }
/**
 * This Event will fire if 'load:data' was sent from the site
 * @param {event}
 * @param {String}
 * @param {String}
 * @returns {void}
 */

ipcMain.on('load:data', (event, mute, theme) => {
	muted = (mute === 'true');
	nativeTheme.themeSource = theme;
	mainWindow.webContents.audioMuted = muted;
	
	mainWindow.webContents.send('theme', nativeTheme.themeSource);
	
});




