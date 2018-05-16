const electron = require('electron');
const url = require('url');
const path = require('path');

const {BrowserWindow, app, Menu, ipcMain, ipcRenderer} = electron;
// SET ENV
// process.env.NODE_ENV = 'production';
let mainWindow;

// Listen for app to be ready
app.on('ready', function(){
  mainWindow = new BrowserWindow({});
  // Load html into window
  mainWindow.on('closed', _ => {
  console.log('closed')
  mainWindow = null
})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Quit app when main window closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
  // this.BrowserWindow = BrowserWindow;
  console.log("this opened the popup");
  // Create new window
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add shopping list item'
  });
  // Load html into window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Garbage collection handle
  addWindow.on('close', function(){
    addWindow = null;
  });
};

ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  addWindow = null;
});

// ^ boilerplate

/* TODO:
1. GET on Google calendar
2. Display current events
  2a. In format "startOfEvent-endOfEvent - title of event - person"
3. Add (+) button to create event for next half hour
4. POST to Google calendar
5. Make it look nice
  5a. logo in top left
*/






















// \/ boilerplate

// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add item',
        accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If mac, add empty object to menu to show 'file'
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools if not in prod
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: "Developer tools",
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
