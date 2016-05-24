# koa-bind-context

将 context 绑定到项目中的每个角落

## 安装

```
npm install koa-bind-context --save
```
## API

* [koa-bind-context](#koa-bind-context)
  * [config](#config)
  * [exports](#exports)

## Config

设置模块的依赖关系，使所有配置中的模块都可以访问上下文

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
* controllers/user/index.js 配置context
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
  // 不需要require，直接通过this就可以访问到依赖（仅限于业务逻辑）
  return yield this.UserApi.get(id);
};
```

proxy/index.js

```javascript
module.exports = {
  get: function (id) {
    // 在这里是可以获取到context的
    var logined = this.cookies.get('token') ? true : false;
    return {id: id, name: 'berwin', age: 21, logined: logined};
  }
};
```