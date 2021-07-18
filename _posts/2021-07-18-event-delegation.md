# EVENT DELEGATION

>이벤트 리스너를 하위 요소에 추가하지 않고 상위 요소에 추가하는 기법이다.

### Why?

코드가 짧아지고 메모리를 절약할 수 있다.



## 개요

이벤트 발생 시 이벤트는 document 레벨까지 버블링되어 올라간다. 이로 인해 자식 요소에서 발생하는 이벤트를 부모 엘리먼트에서도 감지할 수 있다.



## 사용

이벤트 발생 시 부모에 등록된 핸들러를 거치게 되므로 요소의 특징에 따라 분기처리를 통해서 매번 이벤트를 붙여햐 하는 문제를 해결할 수 있다.



[예제] 이벤트 위임 방식 사용 전

```js
document.getElementById("file").addEventListener("click", function(e) {
  // 파일 메뉴 동작
});
document.getElementById("edit").addEventListener("click", function(e) {
  // 편집 메뉴 동작
});
document.getElementById("view").addEventListener("click", function(e) {
  // 보기 메뉴 동작
});
```



[예제] 이벤트 위임 적용

```js
document.getElementById("menu").addEventListener("click", function(e) {
  var target = e.target;
  if (target.id === "file") {
    // 파일 메뉴 동작
  } else if (target.id === "edit") {
    // 편집 메뉴 동작
  } else if (target.id === "view") {
    // 보기 메뉴 동작
  }
});
```



## 장점

* 동적 요소에 대한 이벤트 처리가 수월하다
* 이벤트 리스너 관리가 수월하다.
* 메모리 사용량이 줄어든다.
* 메모리 누수 가능성이 줄어든다.