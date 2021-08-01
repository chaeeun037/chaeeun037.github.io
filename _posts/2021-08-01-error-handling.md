# ERROR HANDLING

### Why?

에러는 불가피하고, 에러를 처리하지 않으면 프로그램이 멈출 것이다. 따라서 에러를 사전에 예측하고 대응하는 것이 중요하다.

## Error 객체

```js
const myError = new Error('please improve your code');
```

## throw 문

```js
throw expression;
```

```js
throw "Error2";   // String type
throw 42;         // Number type
throw true;       // Boolean type
throw {toString: function() { return "I'm an object!"; } };
```



## try ... catch

```js
const a = 5

try {
    console.log(b) // b is not defined, so throws an error
} catch (err) {
    console.error(err) // will log the error with the error stack
}

console.log(a) // still gets executed
```

try문에서 에러가 발생했을 때 catch로 넘어간다.

```js
try {
  throw "myException" // generates an exception
}
catch (e) {
  // statements to handle any exceptions
  logMyErrors(e) // pass exception object to error handler
}
```



### ... finally

```js
const a = 5

try {
    console.log(b) // b is not defined, so throws an error
} catch (err) {
    console.error(err) // will log the error with the error stack
} finally {
    console.log(a) // will always get executed
}
```



## 비동기 에러 처리

> 비동기 에러를 처리하기 위해 내가 사용하는 코드이다. 비동기 함수를 한번 더 wrapping해서 비동기 과정에서 일어나는 에러를 catch할 수 있다.

[예시] express에서 비동기 함수 에러 처리 코드

```typescript
import { NextFunction, Request, Response } from 'express';

const wrapAsync = (fn: unknown) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (typeof fn === 'function') {
      fn(req, res, next)
        .catch(next);
    }
  };
};

export default wrapAsync;
```



## [Promise](https://chaeeun037.github.io/promise/)

- *pending*: 초기상태, fulfilled 되거나 rejected 되지 않음.
- *fulfilled*: 연산 수행 성공.
- *rejected*: 연산 수행 실패.
- *settled*: Promise 가 fulfilled 이거나 rejected 이지만 pending 은 아님.

![img](https://mdn.mozillademos.org/files/8633/promises.png)