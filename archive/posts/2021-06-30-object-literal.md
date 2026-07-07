---
search: true
comments: true
categories: [Javascript]
---

# OBJECT LITERAL

객체를 생성하는 방법 중 하나이다. 이 외에는 생성자로 객체를 생성하는 방법이 있다.



### 생성

객체 리터럴로 객체 생성하기

```javascript
const plus = {a1: 1, a2: 2};

console.log(plus); // { a1: 1, a2: 2 }
```



### 접근

객체 프로퍼티에 접근하기

```javascript
const plus = {a1: 1, 'a2': 2};

console.log(plus.a1);      // 1
console.log(plus['a1']);   // 1
```



### 삭제

프로퍼티 삭제는 delete 키워드를 사용한다.

```javascript
const plus = {a1: 1, a2: 2};

plus.a3 = 3;
console.log(plus);

delete plus.a3;
console.log(plus);

// { a1: 1, a2: 2, a3: 3 }
// { a1: 1, a2: 2 }
```



### 검색

프로퍼티 key 검색은 in 키워드를 사용한다.

```javascript
const plus = {a1: 1, a2: 2};

plus.a3 = 3;
console.log('a1' in plus); // true
```



### 함수 프로퍼티 생성

```javascript
const plus = {
    a1: 100,
    a2: 123,
    result: function () {

        return this.a1 + this.a2;
    }
};

console.log(plus.result()); // 223
```





## ES6에서 확장된 객체 리터럴 기능



### 프로퍼티 초기화

변수 이름과 프로퍼티 키가 동일한 이름일 때 프로퍼티 키를 생략할 수 있다.

[예제1]

```javascript
const firstName = 'Jimmy';
const lastName = 'Joo';

const obj = { firstName, lastName };

console.log(obj); // {firstName: 'Jimmy', lastName: 'Joo'}
```

[예제2]

```javascript
function a(a1, a2) {
        a1,
        a2

    return a1 + a2;
}

console.log(a(1, 2)); // 3
```



이전 방법 - [예제2]

```javascript
function a(a1, a2) {

    this.a1 = a1;
    this.a2 = a2;

    return a1 + a2;
}

console.log(a(1, 2)); // 3
```



### 객체 내에서 간결한 메서드 생성

메서드 정의할 때 function 키워드를 생략 가능하다.

```javascript
 const a = {
    a1: 2,
    a2: 3,
    sum() {
        return this.a1 + this.a2;
    }
}

console.log(a.sum()); // 5
```



이전 방법

```javascript
const a = {
    a1: 2,
    a2: 3,
    sum: function () {
        return this.a1 + this.a2;
    }
}

console.log(a.sum()); // 5
```



### 프로퍼티 키 동적 생성

객체 리터럴 내부에서도 계산된 프로퍼티 이름으로 프로퍼티 키를 동적 생성 가능하다.

```javascript
const prefix = 'prop';
let i = 0;

const obj = {
  [`${prefix}-${++i}`]: i,
  [`${prefix}-${++i}`]: i,
  [`${prefix}-${++i}`]: i,
};

console.log(obj); // {prop-1: 1, prop-2: 2, prop-3: 3}
```



이전에는 외부에서만 동적 생성이 가능했다.

