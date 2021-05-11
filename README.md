
# uni-app基础框架使用

## 开始使用
本地环境需要有node和git,然后git clone 项目
### 安装依赖
安装package.json的项目依赖
```
$ yarn install
```
如果网络状况不佳，更换yarn的加载源如
`yarn config set registry https://registry.npm.taobao.org`

```
// 后续有需要新增依赖可以
yarn add 依赖名
// 更新
yarn update
```
### 目录结构

```
├─ api                      # Api路径
├─ common                   # 第三方依赖需要的配置文件
├─ components               # 业务通用组件
│  ├─ audio
│  │  └─ audio.vue
├─ config                   # 项目基础配置，如环境配置，全局配置
│  ├─ dev.env.js
│  ├─ index.js
│  └─ prod.env.js
├─ pages                    # 业务页面入口文件
│  ├─ account
│  │  └─ index.vue
│  └─ index
│     └─ index.vue
├─ pagesShop                # 小程序分包文件
│  ├─ index
│  │  └─ index.vue
│  └─ static
│     └─ images
├─ static                   # 静态资源文件
│  ├─ images                # 本地图片
│  │  └─ wu.jpg
│  └─ style
│     ├─ css
│     │  ├─ common.scss       # 公共设置css 
│     │  ├─ font-style.scss   # 文字css
│     │  ├─ iconfont.css      # 扩展图标css
│     │  ├─ layout.scss       # 布局css
│     │  └─ theme-color.scss  # 主题色css
│     └─ font                 # 扩展图标字体文件
├─ store                      # vuex 全局状态管理
│  ├─ index.js                # 入口
│  └─ modules                 # 状态模块
│     └─ account.js
├─ utils                    # 工具库
├─ .eslintrc.js             # eslint配置文件
├─ uni.scss                 # uni-app全局css
├─ App.vue                  # 模板入口
├─ main.js                  # 入口js
├─ manifest.json            # uni-app的项目配置
├─ package.json             # 包文件
├─ pages.json               # 路由文件

```

## 路由
路由配置全部在pages.json文件中.
**主要业务入口文件都写在pages中，扩展页面和功能加入分包subpackages.**
**底部tabbar的文件路径必须要在pages中**
```
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue" // 匹配uview-ui
    }
  },
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/account/index",
      "style": {
        "navigationBarTitleText": "我的"
      }
    }
  ],
  "subPackages": [
    {
    "root": "pagesScenic",
      "pages": [
        {
          "path": "index/index",
          "style": {
            "navigationBarTitleText": "导览"
          }
        }
      ]
    },
    {
      "root": "pagesShop",
        "pages": [
        {
          "path": "index/index",
          "style": {
            "navigationBarTitleText": "商城"
          }
        }
      ]
    },
  ],
  // 设置底部 tab 的表现
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#59b698",
    "borderStyle": "white",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/images/wu.jpg",
        "selectedIconPath": "static/images/wu.jpg",
        "text": "首页"
      },
      {
        "pagePath": "pages/account/index",
        "iconPath": "static/images/wu.jpg",
        "selectedIconPath": "static/images/wu.jpg",
        "text": "我的"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#fff",
    "backgroundColor": "#fff",
    "h5": {
      "titleNView": false
    },
    "mp-alipay": { "allowsBounceVertical": "NO" }
  }
}

```
## 布局

布局可以使用uView的[col](https://www.uviewui.com/components/layout.html)组件

也可以使用**static/style/css/layout.scss** 文件中flex布局的css样式(不够的可以加)

## 样式

每个项目主题色不同，需要让美工在[自定义主题色](https://www.uviewui.com/guide/theme.html)中选好颜色。
下载网页下的**uview.theme.scss**文件，把里面的样式复制替换**static/style/css/theme-color.scss**中样式

**项目的主题色，文字颜色，边框颜色，背景色等都直接用此文件中的样式**

可以使用uview的[内置样式](https://www.uviewui.com/components/common.html)。

文字大小样式使用**static/style/css/font-style.scss**中的样式。

[如果需要扩展自定义图标库，需要使用阿里图标库的文件代码。==详情==](https://www.uviewui.com/guide/customIcon.html)

**样式文件都已挂在全局**

## API接口
API接口根据接口文档生成并需要在package.json文件进行配置
```
"yapi": [
    {
      // 接口地址
      "host": "http://192.168.2.18:3000",  
      // 接口唯一令牌
      "token": "8ef06b299952851b96678550de30eff75f5eff575f1ec9b278879e4121f954bd",  
      // 输出目录 
      "outputDir": "./api",    
      // 目录文件名
      "fileName": "apiConfig"
    },
    {
      "host": "http://192.168.2.18:3000",
      "token": "7e338d0c58cb9a98d8a292fee45085b3b8cf7f2d98cd44a3ca00d27bbae80292",
      "outputDir": "./api",
      "fileName": "apiConfigTP5"
    }
  ]
```
执行命令
```
yarn yapi
```

## 组件

通用组件放在公共的components
```
├─ components               # 业务通用组件
│  ├─ audio
│  │  └─ audio.vue
```
非通用组件放在对应页面的componets下
```
├─ pages                     # 业务组件
│  ├─ account
│  |  └─ components
│  │     └─ audio.vue
```
uni-app 在HBuilderX 2.5.5后支持[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)模式，能够省略引入，注册，直接在页面使用.并且按需打包。(**组件支持easycom模式的可以使用**)如下
```
<template>
    <view class="container">
        <uni-list>
            <uni-list-item title="第一行"></uni-list-item>
            <uni-list-item title="第二行"></uni-list-item>
        </uni-list>
    </view>
</template>
<script>
    // 这里不用import引入，也不需要在components内注册uni-list组件。template里就可以直接用
    export default {
        data() {
            return {

            }
        }
    }
</script>
```
easycom默认开启，yarn安装的组件需要在pages.json进行匹配

```
"easycom": {
    "autoscan": true,
    "custom": {
      "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue" // 匹配uview-ui
    }
  },
```
## 发布

项目完成后通过HBuilderX的 
发行->对应平台 
完成项目的构建