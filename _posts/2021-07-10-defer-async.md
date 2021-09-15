---
search: true
comments: true
categories: [Frontend]
---

# ASYNC & DEFER

> async와 defer은 script 다운로드 시 페이지 렌더링을 막지 않는다. script를 HTML에 포함하는 방법은 다음과 같다.
>
> 1) head에 작성하는 경우 2) body에 작성하는 경우
>
> 결론: defer가 최선이다.



![](https://i.stack.imgur.com/OovG7.png)



## <head>에 작성하는 경우

> async, defer은 script 태그에 쓰이는 속성으로 script의 실행 시점을 지정해줌으로써 브라우저 렌더링 시간을 줄이거나 오류를 줄일 수 있다.

### script

script가 load되고 실행이 끝날 때까지 HTML parsing이 멈춘다.

#### 단점

페이지 위쪽에 용량이 큰 script가 있는 경우 아래쪽 페이지 로딩이 지연된다.

---

### async

script를 다운로드 할 때에도 HTML parsing이 멈추지 않는다. 먼저 다운로드된 스크립트가 먼저 실행된다.

방문자 수 카운터나 광고 관련 스크립트같이 독립적이거나 실행 순서가 중요하지 않은 경우에 적용한다.

#### 장점

속성을 사용하지 않을 경우에 비해서 효율적이다.

#### 단점

script를 다운로드 할 때 HTML parsing을 멈추고, DOM tree가 완성되기 전에 js가 실행되어 생성되지 않은 요소를 핸들링하여 오류가 생길 수 있다.

---

### defer

HTML parsing이 끝나고 나서 문서에 추가된 순서대로 script를 실행한다. 

DOM 전체가 필요한 스크립트나 실행 순서가 중요한 경우에 적용한다.

#### 장점

script 다운로드가 HTML parsing과 병렬적으로 진행되기 때문에 시간이 절약되고 끝난 후 순서대로 js파일을 실행하기 때문에 원하는 순서대로 스크립트를 실행할 수 있다.

#### 단점

사용자가 그래픽 관련 컴포넌트들이 준비되지 않은 상태에서 화면을 보게 될 수 있다. 따라서 기능 사용 불가 처리를 해줘야 한다. 



## <body> 맨 뒤에 작성하는 경우

> HTML parsing이 끝난 후에 script 파일을 읽고 실행한다.

#### 장점

script 파일이 먼저 로드되어 발생하는 문제점이 생기지 않고 브라우저에 출력되는 HTML 파일을 script load 없이 먼저 볼 수 있다.

#### 단점

HTML 문서 자체가 아주 큰 경우에는 script 파일의 의존도가 높아지면 js가 포함된 의미있는 컨텐츠를 보기 위해서 굉장히 오랜 시간 기다려야 한다.



## DOMContentLoaded

> **`DOMContentLoaded`** 이벤트는 초기 HTML 문서를 완전히 불러오고 분석했을 때 발생한다. 스타일 시트, 이미지, 하위 프레임의 로딩은 기다리지 않는다.

DOM tree가 완성되기 전에 js코드가 DOM을 조작하는 것을 방지한다.

[예시]

````js
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});
````

