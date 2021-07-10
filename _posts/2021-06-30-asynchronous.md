---
title:  "asynchronous"
search: true
categories: 
  - frontend
last_modified_at: 2021-01-26T08:06:00-05:00
---

# ASYNCHRONOUS

자바스크립트의 비동기는 특정 코드의 연산이 끝날 때까지 코드의 실행을 멈추지 않고 다음 코드를 먼저 실행하는 자바스크립트의 특성을 말한다.



**[예제1] ajax**

```js
function getData() {
	var tableData;
	$.get('https://domain.com/products/1', function(response) {
		tableData = response;
	});
	return tableData;
}

console.log(getData()); // undefined
```

getData()의 결과 값은 초기 값을 설정하지 않은 tableData의 값 undefined를 출력합니다.



**[예제2] setTimeout()**

```js
// #1
console.log('Hello');
// #2
setTimeout(function() {
	console.log('Bye');
}, 3000);
// #3
console.log('Hello Again');
```

‘Hello’ 출력

‘Hello Again’ 출력

3초 있다가 ‘Bye’ 출력



## 콜백 함수

비동기 처리 방식의 문제점을 해결하기 위해 콜백 함수를 사용한다.

**[예제1] ajax callback**

```js
function getData(callbackFunc) {
	$.get('https://domain.com/products/1', function(response) {
		callbackFunc(response); // 서버에서 받은 데이터 response를 callbackFunc() 함수에 넘겨줌
	});
}

getData(function(tableData) {
	console.log(tableData); // $.get()의 response 값이 tableData에 전달됨
});
```

로직이 다 끝났을 때 원하는 동작을 실행하기 위해 콜백 함수를 호출한다.



## 콜백 지옥(callback hell)

가독성이 떨어지고 로직을 변경하기 어렵다.

[예제] callback hell

```js
$.get('url', function(response) {
	parseValue(response, function(id) {
		auth(id, function(result) {
			display(result, function(text) {
				console.log(text);
			});
		});
	});
});
```



개선하기 위해서 Promise 또는 Async, Await 을 사용하거나 콜백 함수를 분리하는 방법이 있다.

**[예제] 콜백 함수를 분리하여 개선한 사례**

```js
function parseValueDone(id) {
	auth(id, authDone);
}
function authDone(result) {
	display(result, displayDone);
}
function displayDone(text) {
	console.log(text);
}
$.get('url', function(response) {
	parseValue(response, parseValueDone);
});
```

