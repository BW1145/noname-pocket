# 无名杀·随身版

基于完整无名杀懒人包的个人安卓定制版，沿用原版牌桌、素材和游戏规则。安卓运行层复用原客户端与 Cordova 原生插件，游戏资源导入应用的可写目录，沿用原版文件读写与触屏初始化。支持 Android 8.0 及以上版本。

- 设置按声音、画面、操作、对局工具、资料与选将、数据维护分组，提供常用页与搜索。
- 搜索武将名可定位所属武将包及子分组开关；启用子分组会同时启用所属包。
- 收藏武将在选将列表优先排列。首次身份将池开放标准包及“手杀异构·将1”，之后使用原包分组开关调整。
- 当前模式右上角提供“玩法说明”，复用对应模式及子模式的原帮助。

上游：[lieren2023/noname-for-dummies](https://github.com/lieren2023/noname-for-dummies)，固定提交 `e52bf9159ce0d8d6a590b6d8db4cfac3f609930c`。源码与修改遵循 GPL-3.0，素材沿用上游各自来源。

## 安装

从 [Releases](https://github.com/BW1145/noname-pocket/releases) 下载完整 APK。安装包约1.60 GB，包内包含全部游戏资源，准备好后可以离线游玩。

0.1.1 采用原安卓客户端运行层，升级使用相同包名和签名。首次进入按原包提示导入内置资源，之后从可写的本地游戏目录启动。

## 构建

从上游 v1.10.11.3-1989 Release 下载完整 Android APK，执行 `python tools/prepare.py <原版APK>`。工具核对官方 SHA-256，提取完整游戏并应用定制。已有完整上游目录时可执行 `python tools/apply.py <游戏目录>`。安卓客户端基线为 [nonameShijian/noname-shijian-android](https://github.com/nonameShijian/noname-shijian-android)，固定提交 `19a50d10b5791ca9d9b9aeaac6ba40a3ff552fc8`，原生核心模块固定为 `ee5ab34865bf0100a3e67e999fd86a8a528b654e`。构建脚本按上游 README 连接原生模块和插件。

构建环境为 JDK 17、Android SDK 35、Node.js 22、Cordova 12 / cordova-android 14。通过 `NONAME_KEY_PASSWORD` 提供签名密码，运行 `tools/build.ps1 -GameDirectory <完整游戏目录> -Keystore <签名文件>`；仓库 Actions 提供同一套完整构建流程。

本地浏览器运行：在已应用修改的游戏目录执行 `python -m http.server 8770 --bind 127.0.0.1`。完整安装包包含上游游戏代码与素材，初次启动按原包提示确认许可。

固定版本官方完整 APK 的 SHA-256：`9fce98d4ed8ed6c7d4fcb5ec42a807736e0063ea7d4cef2332540300089d5ef1`。
