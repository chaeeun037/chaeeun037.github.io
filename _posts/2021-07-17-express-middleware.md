---
search: true
comments: true
categories: [Backend]
---


# EXPRESS MIDDLEWARE

> middleware는 요청과 응답 사이에서 실행되는 함수들의 목록이며 순차적으로 실행된다.

### Why?

비동기 로직을 다루기 위한 패턴으로 middleware는 Express 프레임워크의 핵심이다. 

Express 자체가 일련의 middleware 함수 호출이라고 봐도 무방하다. 


![](https://developer.okta.com/assets-jekyll/blog/express-middleware-examples/middleware-30b3b30ad54e21d8281719042860f3edd9fb1f40f93150233a08165d908f4631.png)





## [미들웨어 사용](https://expressjs.com/ko/guide/using-middleware.html)

### 애플리케이션 레벨 미들웨어

> `app.use()` 및 `app.METHOD()` 함수를 이용한다.

[예시]

```js
var app = express();

// 마운트 경로가 없는 경우에는 요청을 수신할 때마다 실행된다.
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});
```



### 라우터 레벨 미들웨어

[예시]

```js
var router = express.Router();
```



### 오류 처리 미들웨어

> 매개변수가 4개다.

[예시]

```js
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```



### 기본 제공 미들웨어

> 정적 assets 제공을 위한 경로의 루트 디렉토리를 지정한다.

[예시]

```js
app.use(express.static('public', options));
```



### 써드파티 미들웨어

> express에 기능을 추가하기 위해 사용한다.

[예시] cookie-parser 추가하기

```js
var cookieParser = require('cookie-parser');
app.use(cookieParser());
```



#### [미들웨어 작성](https://expressjs.com/ko/guide/writing-middleware.html)

![](https://expressjs.com/images/express-mw.png)

#### [직접 만들어보기](https://jeonghwan-kim.github.io/series/2018/12/08/node-web-8_middleware.html)

> Serve-static 모듈 문제 해결

