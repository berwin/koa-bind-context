# koa-bind-context

将 context 绑定到项目中的每个角落

## 解决了什么问题？

解决了在实际项目中除了controller层之外的层次无法访问 context 这个尴尬的问题。

在简单的项目中，所有的参数从 controller 获取然后调用其他层面的方法来获取数据，例如 service 层。

但是在实际应用中，需要满足各种各样的需求，有时候确实是需要在其他层面去读取cookie，和访问context中的其他方法，与中间件更好的结合在一起。

所以我就写了这个模块，设计之初，我想尽可能的不影响正常的开发模式，不需要改变太多的逻辑，但其实是不可能的。

正常的开发模式是在controller 使用 require 引用 service 的模块来调用相应的方法，但是这样就好比一座围墙，没有办法把我封装的逻辑执行，也就没有办法为 service和其他层面的模块绑定context，除非针对原生的require做一层封装，我也有考虑过，但是后来有两点，让我放弃了这个办法

1. require第三方中间件时，会污染它的纯洁度
2. node不同版本对require部分的代码都略有不同

所以在考虑再三之后，我决定用一个综合的办法搞定这个事情，既不会改变太大，又保证了context只会绑定在业务代码中，也就是说，只绑定在它需要绑定的地方（需要用到context的模块）

或许我的解决方案不是最好的，但它绝对是解决方案之一，至于什么是最好的解决方案，不知~~~

## 安装

```
npm install koa-bind-context --save
```
## API

* [koa-bind-context](#koa-bind-context)
  * [config](#config)
  * [exports](#exports)

## Config

使用Config这个方法来设置哪些模块是需要访问context的，这样我会根据配置对这些模块统一绑定context。之后这些模块就可以访问到context了

当然，所有需要绑定context的模块，都会出现在context中，他们互相之间可以通过this.[配置好的名字] 来访问该模块，需要访问context的模块不能像普通模块那样使用require来调用，因为使用require调用的模块是没有办法绑定context的，所以直接通过this.[配置好的名字].[模块抛出的方法名] 调用该模块的某个方法

* main 必选 自定义 key 与 value 
  * key 可以在 context 中通过这个 key 来读取对应的模块
  * value 配置模块地址，根据模块路径把模块抛出的内容填入 context
* context 与main同理，不同的是，所有需要绑定上下文的模块都需要在context中配置，main只能配置一个文件

### 例子

```javascript
koaBindContext.config({
  main: {
    controller: './user.js'
  },
  context: {
    service: '../../service/user/index.js',
    proxy: '../../proxy/user/index.js'
  }
});
```

## Exports

抛出绑定上下文后的入口文件，暴露的 API 与 config中配置的 main 入口文件中所抛出的接口一模一样~

* @return {Object || Function || Other} 返回内容与入口文件的 module.exports 相同~

### 例子

```javascript
koaBindContext.exports();
```

## 应用例子

项目结构
```
  app.js
  controllers/user/
                  index.js
                  user.js
  service/user/index.js
```
* app 项目入口
* controllers/user/index.js 配置context的配置文件
* controllers/user/user.js controller 文件
* service/user/index.js 为controller提供接口

app.js

```javascript
// ...
var user = require('./controllers/user/index.js');
// ...
router.get('/user/:id', user.findById);
// ...
```

controllers/user/index.js

```javascript
var koaBindContext = require('koa-bind-context');
koaBindContext.config({
  main: {
    controller: './user.js'
  },
  context: {
    UserService: '../../service/user/index.js',
    UserApi: '../../proxy/user/index.js'
  }
});

koaBindContext.exports();
```

controllers/user/user.js

```javascript
exports.findById = function *() {
  var userID = this.params.id;
  this.body = yield *this.UserService.findById(userID);
}
```

service/user/index.js

```javascript
exports.findById = function *(id) {
  // 不需要require，直接通过this就可以访问到依赖（仅限于配置文件中配置过的）
  return yield this.UserApi.get(id);
};
```

proxy/user/index.js

```javascript
module.exports = {
  get: function (id) {
    // 在这里是可以获取到context的
    var logined = this.cookies.get('token') ? true : false;
    return {id: id, name: 'berwin', age: 21, logined: logined};
  }
};
```