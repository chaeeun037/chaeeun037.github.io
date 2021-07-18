# Ch42: ASYNCHRONOUS PROGRAMMING

> modern javascript deep dive
>
> 42장. 비동기 프로그래밍
>
> [Asynchronous Programming](https://chaeeun037.github.io/asynchronous-programming/)

## Why?

자바스크립트 엔진은 싱글 스레드로 동작한다. 이벤트 루프, 태스크 큐 등을 통해서 병목 현상을 방지하고 비동기적인 동작 한다.



## 동기 처리와 [비동기](https://chaeeun037.github.io/frontend/asynchronous/) 처리

## 이벤트 루프와 태스크 큐

![](https://miro.medium.com/max/1400/1*iHhUyO4DliDwa6x_cO5E3A.gif)

### 콜 스택

소스코드 평가 과정에서 생성된 실행 컨텍스트 스택이다.

### 힙

자바스크립트의 모든 값은 객체로 힙에 저장된다.

### 태스크 큐

setTimeout이나 setInterval과 같은 비동기 함수의 콜백 함수 또는 이벤트 핸들러가 일시적으로 보관되는 영역이다.

태스크 큐와는 별도로 프로미스의 후속 처리 메소드의 콜백 함수가 일시적으로 보관되는 마이크로 태스크 큐도 존재한다.

### 이벤트 루프

브라우저에 내장되어 있는 기능 중 하나로 자바스크립트의 동시성을 지원한다.

콜스택에 현재 실행중인 컨택스트가 잇는지, 태스크 큐에 대기중인 함수(콜백 함수, 이벤트 핸들러)가 있는지 반복해서 확인한다. 콜 스택이 비어있고 태스크 큐에 대기 중인 함수가 있다면 순차적으로 콜 스택으로 이동한다.

### Web API

브라우저에서 제공하는 api로 DOM API, 타이머 함수, HTTP 요청(Ajax)과 같은 비동기 처리를 포함한다.

