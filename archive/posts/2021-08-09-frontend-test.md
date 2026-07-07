---
search: true
comments: true
categories: [Frontend]
---

# FRONTEND TEST

[참고 영상](https://www.youtube.com/watch?v=pkYUcKWOqPs&list=PLgXGHBqgT2TvpJ_p9L_yZKPifgdBOzdVH&index=12)

## Why?

발생 가능한 결함을 예방하고 서비스가 요구사항을 충족하는지 검증한다.

개발 과정에서 생기는 변경사항들로 인해서 새로운 결함이 유입되지 않았는지 확인 가능하다.



## 테스팅 트로피

> Kent.C.Dodds

<img src="https://blog.kakaocdn.net/dn/dmhUHQ/btqEcS4VvRS/xr3rL9zddq4mEBKsBDuu40/img.png" width="400px">

### Static 테스트

>  정적 테스트는 코드를 실행하지 않고 테스트한다.

구문 오류, 나쁜 코드, 스타일 등 검증할 수 있다.

ex) ESlint, Typescript



### Unit 테스트

> 단위 테스트는 작은 단위를 떼어내서 분리된 환경에서 테스트한다.

복잡한 알고리즘이 제대로 동작하는지 확인한다.

moking이 필요하다.

작성 비용이 낮고, 실행 속도가 빠르다.

ex) Jest



### Integration 테스트

> 통합 테스트는 어플리케이션의 여러 부분들이 통합되어 제대로 상호작용 하는지 테스트한다.

주로 단위 테스트보다 큰 범위의 테스트를 의미한다. (페이지)

앱의 모든 기능이 제대로 동작한다는 확신을 줄 수 있다.

ex) Jest, RTL, Enzyme



## E2E 테스트

> End to End 테스트는 실제 사용자가 사용하는 것과 같은 조건에서 전체 시스템을 테스트

API 서버, DB 등 외부 서비스들을 모두 사용하여 통합된 시스템을 테스트한다.

비용이 많이 들고, 속도가 느리다.

ex) Cypress, Selenium



## Write tests. Not too many. Mostly integration.

통합 테스트가 가장 비중이 높다. 테스트 커버리지가 70% 이상이면 불필요한 테스트로 인해 효과가 반감된다. 통합 테스트가 테스트 속도, 비용이 가장 균형이 맞다.

단위 테스트를 잘해도 통합 테스트때 동작하지 않는다면 단위테스트의 이득이 사라지기 때문에 통합 테스트의 중요성을 강조한다.

따라서 제한된 리소스로 테스팅 효율을 높이기 위해서는 통합 테스트 위주로 작성하는 것이 좋다.



## 프론트엔드 테스팅 대상

### 사용자 이벤트 처리

* javascript API 사용
* 라이브러리 사용

```js
// node.js 환경 - testing-library
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

fireEvent.change(); // userEvent보다 low한 메소드
fireEvent.click();

userEvent.type();	// 내부적으로 fireEvent 호출
userEvent.click()
```

```js
// 브라우저 - cypress
cy
	.get()
	.type();
```

* E2E 도구 사용

### API 서버 통신

* 실제 API 서버 사용
* 통신 모듈을 Moking 하거나 API 서버를 Moking

```js
jest.spyOn(window, 'fetch');

window.fetch.mockImplementation({
	json: async () => '';
})
```

### 시각적 요소

* 스냅샷 테스트

HTML 구조가 의도한대로 나타나는지 테스트

```js
import { render } from '@testing-library/react';

const value = 21;

test('', () = > {
	const element = render(<div>{value}</div>);
	expect(element).toMatchSnapshot();
});
```



Jest, StoryBook

* 시각적 회귀 테스트

StoryBook



## 테스팅 환경

### Browser

* 네트워크 IO. 렌더링 엔진 활용 가능
* 테스트 코드를 다양한 운영체제, 브라우저 사용 가능, 호환성 체크 가능
* Node.js에 비해 무거워서 초기 구동 속도가 늦다
* 브라우저를 사용하기 위해 별도로 설치가 필요하다. Headless 브라우저로 사용하는 것을 권장

Karma, Selenium, Cypress

### Node.js

* 설치 및 실행이 간단하고 속도가 빠르다.
* 모듈 단위로 테스트 가능하다.
* DOM, BOM API가 없기 때문에 가상으로 jsdom을 사용하지만 브라우저 동작을 100% 구현하지는 못한다.

```js
import { JSDOM } from 'jsdom';

const dom = new JSDOM();

global.document = dom.window.document;
global.window = dom.window
```

* Jest, Mocha



## TOAST UI 가이드

1. 크로스 브라우징 테스트가 반드시 필요한 경우 브라우저 환경을 사용한다.
2. 브라우저의 실제 동작에 대한 테스트가 필요한 경우 브라우저 환경을 사용한다.
3. 그 외의 경우 Node.js 환경을 사용한다.



## 추가 고려 사항

### 어플리케이션 종류

* 비주얼 요소가 중요한가? (차트 등)
* 모든 브라우저에서 테스트해야하는가? (editor 등)

### 어플리케이션 규모 및 복잡성

* 간단한 라이브러리
* 복잡한 라이브러리
* 복잡한 웹 서비스

### 팀 구성

* 별도의 QA 팀이 있는가
* server-client 모두 통제할 수 있는가