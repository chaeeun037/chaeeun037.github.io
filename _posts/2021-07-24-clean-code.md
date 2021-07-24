# CLEAN CODE

### Why?

수월한 협업을 위해 모든 팀원이 이해하기 쉽게 작성해야한다. 가독성이 좋지 않은 코드는 수정하기 위해 해석하는 시간과 수정하는 비율이 10:1정도로 비효율적이다.

![](https://image.samsungsds.com/kr/story/__icsFiles/afieldfile/2019/08/27/43_a.png)



## 참고할 포스팅

[[JavaScript] Clean Code - 가독성 높이기](https://velog.io/@seob/JavaScript-Clean-Code-%EA%B0%80%EB%8F%85%EC%84%B1-%EB%86%92%EC%9D%B4%EA%B8%B0)

[clean-code-javascript-ko](https://github.com/qkraudghgh/clean-code-javascript-ko#%EC%97%90%EB%9F%AC-%EC%B2%98%EB%A6%ACerror-handling)



## Check LIST

### 로직 쪼개기

>  모듈, 함수 등



### 매직 넘버/리터럴 회피

> 파일, 상단에 변수 선언 등

무엇을 의미하는지 확신할 수 없다. 역할을 알려주는 이름으로 선언해서 사용하자.



### 자주 사용하는 메소드, 변수 이름 줄이기

[예시]

```js
const $ = document.querySelector.bind(document.body);
const $$ = document.querySelectorAll.bind(document.body);


const element = $('#...');
```



### 스코프 좁히기

> 전역변수 보다는 인자 등



### 최대한 const 사용 

> 바뀌는 경우에만 let