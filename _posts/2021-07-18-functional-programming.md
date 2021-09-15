---
search: true
comments: true
categories: [Javascript]
---

# FUNCTIONAL PROGRAMMING

> 부수 효과를 없애고 함수끼리의 조합성을 강조하는 프로그래밍 패러다임이다.
>
> 자바스크립트는 함수형 언어가 아니지만 함수형 언어에서 사용하는 개념과 문법, 인터페이스를 지원한다.

### Why?

코드의 부작용이 적고 재사용성이 매우 높아진다. 자바스크립트가 함수형 패러다임을 받아들이고 있어 효율적인 코드를 작성할 수 있을 것이다.



## 원칙

#### 순수함수로 구성되어야 한다.

this의 사용으로 순수함수를 사용하기 힘들다.

#### side effect가 없어야 한다.

원본 데이터는 불변해야한다.

#### 함수와 데이터를 중점으로 생각한다.



## 함수형 패러다임

#### 고차 함수(Higher order function)

함수를 인자로 받거나 함수를 리턴하는 함수를 의미한다. 기존 변수에 대한 side effect가 없도록 구현한다.

> 일급 객체 조건
>
> 1) 변수에 할당할 수 있다.
>
> 2) 다른 함수의 인자로 전달될 수 있다.
>
> 3) 다른 함수의 결과로서 리턴될 수 있다.

* map

```js
const arr = ['foo', 'hello', 'diamond', 'A'];
const arr2 = arr.map((v) => v.length);
console.log(arr2) // [3, 5, 6, 1]
```



* filter

```js
const arr = [4, 15, 377, 395, 400, 1024, 3000];
const arr2 = arr.filter((v) => (v % 5 === 0));
console.log(arr2) // [15, 395, 400, 3000]
```



* reduce

```js
let arr = [9, 2, 8, 5, 7];
let sum = arr.reduce((pre, val) => pre + val);
console.log(sum)	// 31
```





#### 람다(Lambda calculus)

```js
// ES2015
[0, 1, 2, 3, 4].map(n => n * n);
```



#### 익명함수(Arrow function)

```js
// ES2015
[0, 1, 2, 3, 4].map(n => n * n);
```



#### 커링(Currying)

여러개의 인자를 받은 함수를 쪼개 하나의 인자를 받은 함수들로 연결하는 것이다.

```js
let sum = x => y => x+y;
let sum5 = sum(5);
let sum12 = sum5(7);

console.log(sum12, sum(5)(7)); // 12 12
```



#### 클로저(Closure)

열린 람다식을 닫힌 람다식으로 만드는 것이다. 

람다 표현식에서 변수들이 모두 묶인 변수일 때 닫힌 람다식, 자유 변수가 하나라도 있을 때 열린 람다식이라고 부른다.

```js
var a = 1;
function freeAdder(b) {
  return function(c) {
    return a + b + c;
  }
}

var add2 = freeAdder(2);
add2(3); // 6

a = undefined;
add2(3); // NaN
```

