# wolai-client

使用 electron 创建 wolai 桌面客户端

## 特性

- 适配 MacOS 左上角控制条
- 根据系统主题自动切换 wolai 主题
- win64 客户端优先使用本地[更纱黑体](https://github.com/be5invis/Sarasa-Gothic)

## 构建

### 环境要求

- macOS 10.9+ / Windows / Linux
- [Node.js](https://nodejs.org/zh-cn/download/) `>= 10`

---

下载并解压本项目，进入项目文件夹下

### 安装依赖

```bash
npm install
```

### 构建客户端

MacOS

```bash
npm run build:osx
```

win64

```bash
npm run build:win
```

🥳 需要自定义 css 可以修改 src/osx.js 或 src/windows.js

## 截图

<img src="https://wx2.sbimg.cn/2020/09/07/9kEJh.png">
