---
title:  "array-method"
search: true
categories: 
  - frontend
last_modified_at: 2021-01-26T08:06:00-05:00
---

# ARRAY METHODS

map, filter, reduce, forEach

모든 array 메소드는 사본을 반환하며, 원래의 배열은 바뀌지 않는다.



## array.map()

배열 내의 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 가진 새로운 배열을 만든다.

```js
let newArr=arr.map(function callback (현재값 [, index [, array]] ) {
// return newArr를 위한 요소
}[,thisArg)
```



[예시]

```js
let numbers = [1, 4, 9]
let roots = numbers.map(function(num){
	return Math.squrt(num)
})
//roots is now [1, 2, 3]
//numbers is still [1, 4, 9]
```



## array.filter()

주어진 조건을 통과한 요소들을 새로운 배열로 반환한다.

```js
let newArray = arr.filter(callback(curr [,index [,array]]){
	return //새로운 배열에 포함되기 위해 통과할 조건
}[,this Arg]
```



[예시]

```js
function isBigEnough(value){
	return value>=10
}

let filtered = [12, 5, 8, 130, 44].filter(isBigEnough);
//filtered is [12, 130, 44]
```



## array.reduce()

배열의 각 요소에 대해서 주어진 reducer 함수를 실행하고, 하나의 결과값을 반환한다. 

```js
arr.reduce(callback (누산기, 현재값 [, currentindex [, array]]){
//return 누적 결과의 결과 값
 [, 초기값]}
```



[예시]

```js
[0,1,2,3,4].reduce(function(acc,cur){
 	return acc+cur
}); 
//return 10
```



## array.forEach()

배열의 모든 요소에 주어진 함수를 실행한다. 

```js
arr.forEach(callback(현재값 [,index [,array]])[, thisArg]
```



[예시]

```js
let array1= ['a', 'b', 'c'];
array1.forEach(element => console.log(element));
//expected output:'a'
//expected output:'b'
//expected output:'c'
```