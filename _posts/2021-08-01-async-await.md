# ASYNC & AWAIT

### Why?

promise를 간편하게 사용할 수 있도록 만든 것이다.



## promise then vs async/await

> fetch API를 사용함에 있어서 두 가지를 비교해보자.

### promise then

```javascript
(function() {
    fetch("/index")
    .then((res) => res.json())
    .then(({lists}) => {
      console.log(lists.reduce((p,n)=> p + `<p>${n}</p>`,``));
    });
})();

코드복사
```

### async/await

```javascript
(async function() {
    const res  = await fetch("/index")
    const {lists} = await res.json()
    const result = lists.reduce((p,n)=> p + `<p>${n}</p>`,``);
    console.log(result);
})();
코드복사
```

### 비교

> async/await가 더 낫다.

- 비동기가 복잡한 상황이 많은 nodeJS에서 더 환영받을 스펙이다.
- Promise 와 밀접한 기능을 가지고 있다.
- async 함수의 반환값은 promise이고, await뒤에 선언된 비동기 로직도 Promise로 구현돼야 한다.

## 주의사항

async 함수의 반환값도 Promise임을 주의해야 한다.
그 특징을 잘 이해하고, 동기적인 코드와 비동기 코드의 순서를 잘 예측해야 한다.

[예시]

```javascript
async function as() {
   console.log('async function');
   var result = await new Promise(resolve => setTimeout(()=> resolve('대기끝'),2000));
   console.log('result : ', result);
   return result;
}

function sync(num) {
  console.log('sync', num);
}

(function() {
   sync(1);
   var result = as();	// 올바른 결과를 내기 위해서는 as() 앞에도 await을 걸어줘야 한다.
   result.then((data) => console.log("data: ", data));
   sync(2);
})();
```

[결과]

~~~
sync 1
async function
sync 2
result :  대기끝
data:  대기끝
~~~

[async 코드 예제](https://github.com/crongro/javascript-async/blob/master/src/asyncAwait.js)

## 고민할 점

- async함수에서 Data fetching 과정중에 생기는 에러처리는 어떻게 해야할까?
  - [비동기 에러처리 참고](https://chaeeun037.github.io/error-handling) - 비동기 함수를 wrapping해서 에러를 처리한다.
- 병렬로 데이터를 요청해야 하는 경우에는 어떻게 해야할까?
  - promise all을 사용하는 방법...? 이건 잘 모르겠다.