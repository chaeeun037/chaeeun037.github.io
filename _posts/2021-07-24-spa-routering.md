---
search: true
comments: true
categories: [Frontend]
---

# SPA ROUTING

> Single page application에서 CSR을 위해서 routing을 사용한다.

### Why?

client side rendering을 위해 spa와 routing을 사용하면 새 콘텐츠가 필요할 때마다 서버에 요청할 필요가 없다. 초기 로드할 때 모든 웹사이트 콘텐츠를 로드하고 URL 경로 이름에 따라 페이지에 올바른 콘텐츠를 동적으로 표현한다.



## SPA routing 원리

### URI 구성

http: //www.expample.com:8000/search?q=test#n10

#### URI Scheme

http

#### hostname

www.example.com

#### port

8000

#### path

/search

#### query parameter

q=test

#### fragment identifier

> 앞의 문자열로 표현한 URI가 가리키는 리소스 내부에서 더 세세한 부분을 특정할 때 이용.

n10



## History 방식 vs Hash 방식

- **history (BrowserHistory)** - `history.pushState` API를 활용하여 페이지를 다시 로드하지 않고 URL을 탐색 할 수 있다.
- **hash (HashHistory)** - url 해쉬를 사용하여 전체 url을 시뮬레이트하게되며, url이 변경될 때 페이지가 다시 로드되지 않는다. url에 `#`이 붙는다.



## Browser History

`history`를 사용한 방법은 `history`라는 API를 사용하는 방법이며, 가장 보편적인 방법이다.

history API의 `pushstate`와 window 객체의 `popstate` 이벤트를 이용하는데 `history.pushState`를 통하여 새 데이터 전달을 위한 상태, 제목, url을 지정할 수 있다.

```js
window.history.pushState({ data: 'some data' },'Some history entry title', '/some-path')

window.onpopstate = () => {
  appDiv.innerHTML = routes[window.location.pathname]
}
```

`Browser History`의 url의 형태는 `site/some-path`와 같이 표현되지만 이 방법은 **서버 측 지원이 일부 필요**하다. 예를 들어 `http://domain.com/site/another-path`와 같이 존재하지 않는 경로로 접속할 경우 오류를 출력한다. 이런 문제를 해결하고 대체할 url은 서버에서 지정해야 한다.



## Hash History

보통 `hash History`는 **웹 페이지 내부에서 이동을 위할 것으로 history가 관리되지 않는다.** 하지만 서버가 없는 정적 페이지 경우에는 hashHistory만으로도 충분하다.



### hash 사용 이유

hash는 문서에서 부차적인 자원에 대한 참조를 가리키기 위해서 만들었기 때문에 서버로부터 화면이 갱신되지 않는다. 이 규칙을 이용해서 SPA에서는 hash를 이용하여 라우팅을 한다.



### hash를 변경하면 history에 쌓인다

URI가 변경되면 히스토리가 쌓이기 때문에 hash를 변경하면 history가 쌓인다. 뒤로가기, 앞으로가기가 가능하다는 뜻이다. 이를 이용하여 SPA에서 히스토리를 관리할 수 있게 된다.



### hashchange & popstate event

브라우저에서 hash가 변경될 때마다 hashchange & popstate 이벤트가 발생한다. 

hashchange는 hash가 변경되었다는 의미의 이벤트이고 popstate는 history entry가 변경되었을 경우에 발생하는 이벤트이다. 

popstate는 HTML5 스펙이기 때문에 하위 브라우저에서 동작하지 않는다. hashchange 이벤트는 ie8 이상 브라우저에서 지원한다.

[브라우저 지원현황](https://ko.wikipedia.org/wiki/HTML5)

현재 url의 hash는 `window.location.hash`를 통하여 확인 할 수 있으며, 라우팅 시스템을 구축할 경우 이 `window.location.hash`를 이용하여 라우팅을 변경할 수 있다.



[예제]

```js
var routerMap = {
  '' : function() {
    sectionEl.innerHTML = mainHtml;
  },
  'sub1' : function() {
    drawSection('sub1.json')
  },
  'sub2' : function() {
    drawSection('sub2.json')
  }
}

function otherwise() {
  sectionEl.innerHTML =
    'Not Found';
}

function router() {
  var hashValue = location.hash.replace('#', '');
  (routerMap[hashValue] || otherwise)();
}


window.addEventListener('hashchange', router);
```