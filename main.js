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
const iconPath = path.join(__dirname, "static/icon.png");
let tray = null;
const init = () => {
  // // 應用程式視窗設定
  const createWindow = () => {
    let win = new BrowserWindow({
      icon: path.join(__dirname, "static/icon.png"),
      webPreferences: {
        nodeIntegration: true, //Boolean - 是否完整支持node. 默认为 true
        contextIsolation: false
      }
    });

    //系统托盘右键菜单
    const trayMenuTemplate = [
      {
        label: "设置",
        // eslint-disable-next-line prettier/prettier
        click: () => { } //打开相应页面
      },
      {
        label: "exit",
        click: () => {
          app.quit();
        }
      }
    ];

    //图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

    win.on("close", e => {
      e.preventDefault(); // 阻止退出程序
      win.hide(); // 隐藏主程序窗口
    }); // 当点击关闭按钮

    const setTray = () => {
      tray = new Tray(iconPath);
      tray.setContextMenu(contextMenu);
      tray.setToolTip("碼表視窗小程式");
      tray.on("click", () => {
        win.show();
      });
    };

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
              setTray();
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
  };

  createWindow();
};
// 当 Electron 完成初始化时被触发。
app.on("ready", init);
// 当所有的窗口都被关闭时触发。
app.on("window-all-closed", () => app.quit());
// 当应用被激活时触发，常用于点击应用的 dock 图标的时候。
app.on("activate", () => win === null && init());
