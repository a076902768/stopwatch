/*
 **  Nuxt
 */
const http = require("http");
const { Nuxt, Builder } = require("nuxt");
let config = require("./nuxt.config.js");
config.rootDir = __dirname; // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config);
const builder = new Builder(nuxt);
const server = http.createServer(nuxt.render);
// Build only in dev mode
if (config.dev) {
  builder.build().catch(err => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  });
}
// Listen the server
server.listen();
const _NUXT_URL_ = `http://localhost:${server.address().port}`;
console.log(`Nuxt working on ${_NUXT_URL_}`);

/*
 ** Electron
 */
let win = null; // Current window
/*
 *  用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
 */
const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");
const init = () => {
  // // 應用程式視窗設定
  const createWindow = () => {
    return new BrowserWindow({
      icon: path.join(__dirname, "static/icon.png"),
      webPreferences: {
        nodeIntegration: true, //Boolean - 是否完整支持node. 默认为 true
        contextIsolation: false
      }
    });
  };
  let win = createWindow();

  win.maximize(); // 窗口最大化
  win.on("closed", () => (win = null));

  if (config.dev) {
    // Install vue dev tool and open chrome dev tools
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require("electron-devtools-installer");
    installExtension(VUEJS_DEVTOOLS.id)
      .then(name => {
        console.log(`Added Extension:  ${name}`);
        win.webContents.openDevTools(); // 打開開發者模式
      })
      .catch(err => console.log("An error occurred: ", err));
    // Wait for nuxt to build
    const pollServer = () => {
      http
        .get(_NUXT_URL_, res => {
          if (res.statusCode === 200) {
            win.loadURL(_NUXT_URL_);
          } else {
            setTimeout(pollServer, 300);
          }
        })
        .on("error", pollServer);
    };
    pollServer();
  } else {
    return win.loadURL(_NUXT_URL_);
  }

  const createTray = () => {
    let appIcon = null;
    const iconPath = path.join(__dirname, "static/icon.png");

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "AlarmClock",
        click() {
          win.show(); // 展示并且使窗口获得焦点.
        }
      },
      {
        label: "Quit",
        click() {
          win.removeAllListeners("close");
          win.close(); // 尝试关闭窗口，这与用户点击关闭按钮的效果一样. 虽然网页可能会取消关闭
        }
      }
    ]);

    appIcon = new Tray(iconPath);
    appIcon.setToolTip("Alarm Clock");
    appIcon.setContextMenu(contextMenu);
  };

  createTray();
};
// 当 Electron 完成初始化时被触发。
app.on("ready", init);
// 当所有的窗口都被关闭时触发。
app.on("window-all-closed", () => app.quit());
// 当应用被激活时触发，常用于点击应用的 dock 图标的时候。
app.on("activate", () => win === null && init());
