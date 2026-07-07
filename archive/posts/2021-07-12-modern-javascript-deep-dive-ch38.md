---
search: true
comments: true
categories: [Javascript ModernJavascriptDeepDive]
---

# ch38: BROWSER RENDERING

> modern javascript deep dive
>
> 38장. 브라우저 렌더링

## why?

웹에서 사용되는 자바스크립트는 브라우저 위에서 실행되므로 브라우저 환경을 고려하면 더욱 효율적인 프로그래밍이 가능하다. 이를 위해 브라우저가 HTML, CSS, 자바스크립트로 작성된 텍스트 문서를 어떻게 파싱하여 브라우저에 렌더링하는지 알아야 한다.

[브라우저 렌더링 과정](https://chaeeun037.github.io/browser-rendering/)

(캡처 1)

## 요청과 응답

브라우저의 핵심 기능은 필요한 리소스를 서버에 요청하고, 서버로부터 응답을 받아 브라우저에 렌더링 하는 것이다.

요청을 전송하기 위한 URI는 다음과 같다.

(캡처 2)

일반적으로 서버는 루트 요청에 대해 index.html을 응답하도록 기본 설정 되어있다. 이렇듯 정적인 데이터는 url을 통해 요청할 수 있다.

## HTTP 1.1 & HTTP 2.0

> HTTP는 웹에서 브라우저가 서버와 통신하기 위한 프로토콜이다. 
>
> 팀 버너스리가 고안했다. 

#### HTTP/1.1

기본적으로 커넥션 당 하나의 요청과 응답만 처리한다. 따라서 리소스의 동시 전송이 불가능하다. 요청할 리소스 개수에 비례하여 응답 시간이 증가하는 단점이 있다.

#### [HTTP/2.0](https://developers.google.com/web/fundamentals/performance/http2?hl=ko)

커넥션당 다중 요청, 응답이 가능하므로 HTTP/1.1에 비해 페이지 로드 속도가 약 50%정도 빠르다.

## HTML 파싱과 DOM 생성

#### why?

브라우저의 요청에 의해 서버가 응답한 HTML 문서는 문자열로 이루어진 순수한 텍스트이므로 렌더링하기 위해서 브라우저가 이해할 수 있는 자료구조로 파싱해서 메모리에 저장한다.

#### 과정

서버에서 브라우저로 바이트 형태로 응답을 보낸다.

브라우저에서 바이트 -> 문자 -> 토큰 -> 노드 -> DOM 과정을 거쳐서 렌더링하게 된다.

## CSS 파싱과 CSSOM 생성

HTML 파싱과 동일한 과정을 거친다. <link>를 만나 CSS 파일을 다운받고 파싱하는 동안에도 DOM 생성을 일시중단한다.

## 렌더 트리 생성

DOM과 CSSOM을 렌더 트리로 결합한다. 렌더 트리는 렌더링을 위한 트리의 자료구조이다. 따라서 브라우저 화면에 렌더링되지 않는 노드(meta, script, css display none 등)는 포함하지 않는다.

완성된 렌더 트리는 각 HTML 요소의 레이아웃을 계산하는데 사용되며, 브라우저 화면에 픽셀을 렌더링하는 페인팅 처리에 입력된다.

### 반복

레이아웃 계산과 페인팅은 반복적으로 실행될 수 있다.

* 자바스크립트에 의한 노드 추가 또는 삭제
* 브라우저 창의 리사이징에 의한 뷰포트 크기 변경
* HTML 요소의 레이아웃에 변경을 발생시키는 스타일 변경
  * width/height, margin, padding, border, display, position, top/right/bottom/left

성능에 악영향을 주는 작업이므로 가급적으로 리렌더링이 빈번하게 발생하지 않도록 주의해야 한다.

## 자바스크립트 파싱과 실행

자바스크립트 코드에서 DOM API를 사용하여 이미 생성된 DOM을 동적으로 조작할 수 있다.

script 태그를 만나면 렌더링 엔진은 DOM 생성을 일시 중단하고 자바스크립트 엔진에 제어권을 넘겨 코드를 파싱한다.

#### 자바스크립트 엔진

* V8 (구글 크롬, Node.js)
* SpiderMonkey (파이어폭스)
* JavaScriptCore (사파리)

(캡쳐 3)

## [리플로우와 리페인트](https://chaeeun037.github.io/repaint-reflow/)

자바스크립트 코드가 DOM이나 CSSOM을 변경하는 DOM API를 사용할 경우 변경된다. 변경된 DOM, CSSOM은 다시 렌더 트리로 결합되고, 레이아웃과 페인트 과정을 거쳐서 브라우저의 화면에 다시 렌더링한다.



## 자바스크립트 파싱에 의한 HTML 파싱 중단

렌더링 엔진과 자바스크립트 엔진은 직렬적으로 파싱을 수행한다. 

따라서 script 태그의 위치에 따라 HTML 파싱이 블로킹되어 DOM 생성이 지연될 수 있다.

이 문제를 회피하기 위해서 body 요소의 가장 아래에 script를 위치시키는 것도 좋은 아이디어이다.



## script 태그의 [async/defer](https://chaeeun037.github.io/defer-async/) 어트리뷰트

