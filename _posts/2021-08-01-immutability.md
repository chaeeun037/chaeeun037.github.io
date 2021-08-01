# IMMUTABILITY

> 불변 데이터란 생성 후 그 상태를 바꿀 수 없는 데이터를 말한다.
>
> 함수형 프로그래밍의 핵심 원리이다.

### Why

객체에서는 레퍼런스를 참조한 다른 객체에서 변경이 일어나기 때문에 의도하지 않은 변경이 발생하곤 한다. 

이러한 문제를 해결하기 위해 copy on write기법으로 데이터를 수정했을 때 이전의 복사본을 만들고, 변경을 한 후 참조만 바꿔주어 이전과 같이 원활하게 동작하도록 보장한다. (이 외에도 문제 해결 방법 중 observer 패턴이 있다.)

이로 인해 복제나 비교를 위한 조작을 단순화 할 수 있고, 불변 객체로서 실행 효율을 높일 수 있으며 메모리 절약으로 인해 성능 개선에 도움을 준다.

### 단점

객체가 변경 가능한 데이터를 많이 가지고 있는 경우 부적절 할 수 있다. 



## Immutable value vs mutable value

javascript의 원시 타입은 변경 불가능한 값이다. 이외의 모든 값은 객체 타입이며, 객체 타입은 변경 가능한 값이다.

이 때 변경이 불가능하다는 것은 메모리 영역에서의 변경이 불가능하다는 뜻이고, 재할당은 가능하다.



## Immutable data pattern

> ES6에서 불변 데이터 패턴을 쉽게 구현할 수 있는 새로운 기능이 추가되었다.

### 객체의 방어적 복사(defensive copy)

> Object.assign은 타킷 객체로 소스 객체의 프로퍼티를 복사한다. 이때 소스 객체의 프로퍼티와 동일한 프로퍼티를 가진 타켓 객체의 프로퍼티들은 소스 객체의 프로퍼티로 덮어쓰기된다. 리턴값으로 타킷 객체를 반환한다.

```js
Object.assign(target, ...sources);
```

[예시]

```js
// Copy
const obj = { a: 1 };
const copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }
console.log(obj == copy); // false

// Merge
const o1 = { a: 1 };
const o2 = { b: 2 };
const o3 = { c: 3 };

const merge1 = Object.assign(o1, o2, o3);

console.log(merge1); // { a: 1, b: 2, c: 3 }
console.log(o1);     // { a: 1, b: 2, c: 3 }, 타겟 객체가 변경된다!
```

Object.assign은 완전한 deep copy를 지원하지 않는다. 객체 내부의 객체(Nested Object)는 **Shallow copy**된다.

[예시]

```js
const user1 = {
  name: 'Lee',
  address: {
    city: 'Seoul'
  }
};

// 새로운 빈 객체에 user1을 copy한다.
const user2 = Object.assign({}, user1);
// user1과 user2는 참조값이 다르다.
console.log(user1 === user2); // false

user2.name = 'Kim';
console.log(user1.name); // Lee
console.log(user2.name); // Kim

// 객체 내부의 객체(Nested Object)는 Shallow copy된다.
console.log(user1.address === user2.address); // true

user1.address.city = 'Busan';
console.log(user1.address.city); // Busan
console.log(user2.address.city); // Busan
```



### 불변객체화를 통한 객체 변경 방지

> [Object.freeze()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)를 사용하여 불변(immutable) 객체로 만들수 있다.

```js
Object.freeze(object);
```

[예시]

```js
const user1 = {
  name: 'Lee',
  address: {
    city: 'Seoul'
  }
};

// Object.assign은 완전한 deep copy를 지원하지 않는다.
const user2 = Object.assign({}, user1, {name: 'Kim'});

console.log(user1.name); // Lee
console.log(user2.name); // Kim

Object.freeze(user1);

user1.name = 'Kim'; // 무시된다!

console.log(user1); // { name: 'Lee', address: { city: 'Seoul' } }

console.log(Object.isFrozen(user1)); // true
```

하지만 객체 내부의 객체(Nested Object)는 변경가능하다.

```js
const user = {
  name: 'Lee',
  address: {
    city: 'Seoul'
  }
};

Object.freeze(user);

user.address.city = 'Busan'; // 변경된다!
console.log(user); // { name: 'Lee', address: { city: 'Busan' } }
```

내부 객체까지 변경 불가능하게 만드려면 deep freeze를 구현해야 한다.

```js
function deepFreeze(obj) {
  const props = Object.getOwnPropertyNames(obj);

  props.forEach((name) => {
    const prop = obj[name];
    if(typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });
  return Object.freeze(obj);
}
```

### 단점 및 대안

Object.assign과 Object.freeze를 사용하여 불변 객체를 만들 수 있다. 하지만 이 방법들은 번거러울 뿐더러 성능상 이슈가 있어서 큰 객체에는 사용하지 않는 것이 좋다. 대안으로는 immutable.js의 사용이 있다. List, Stack, Map, OrderedMap, Set, OrderedSet, Record와 같은 영구 불변 (Permit Immutable) 데이터 구조를 제공한다.



## Redux 사전에 요구되는 개념들

https://lunit.gitbook.io/redux-in-korean/recipes/structuringreducers/prerequisiteconcepts