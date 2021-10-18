# Accessibility

> 웹 접근성은 모두가 사용할 수 있도록 웹 사이트를 디자인, 개발하는 것을 말한다. 

### Why?

보조과학기술이 웹 페이지를 해석할 수 있도록 접근성을 갖추는 것이 필요하다.



## 표준 및 지침

### [WCAG(Web Content Accessibility Guidelines)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> 접근성을 갖춘 웹사이트를 만드는데 필요한 지침을 제공한다.

### [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/)

> JSX에서는 모든 `aria-*` HTML 어트리뷰트를 지원한다.

```react
<input
  type="text"
  aria-label={labelText}  aria-required="true"  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## [시맨틱 HTML](https://developer.mozilla.org/ko/docs/Web/HTML/Element)

> 시맨틱 HTML은 웹 애플리케이션에 있어서 접근성의 기초이다.
>
> 정보의 의미가 강조되는 HTML 엘리멘트를 웹 사이트에서 사용하면 자연스럽게 접근성이 갖추어진다. 

`<div>`와 같은 엘리먼트 사용으로 HTML의 의미가 깨질 경우 **React Fragment**를 사용해서 여러 엘리먼트를 하나로 묶어주는 것을 권장한다.

다음과 같이 짧게 줄여쓸 수 있다.

```react
function ListItem({ item }) {
  return (
    <>      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>  );
}
```

## 접근성 있는 폼

### 라벨링

스크린 리더를 사용하는 사용자를 위해 `<input>`,  `<textarea>`와 같은 HTML 폼 컨트롤을 구분하기 위해 자세한 설명이 담긴 라벨이 필요하다.

* [W3C 엘리먼트 라벨링 방법](https://www.w3.org/WAI/tutorials/forms/labels/)

### 오류 안내

* [W3C 스크린 리더 오류 문구 노출하는 방법](https://www.w3.org/WAI/tutorials/forms/notifications/)

## 포커스 컨트롤

> 모든 웹 어플리케이션은 키보드만 사용하여 모든 동작을 할 수 있어야 한다.

### 키보드 포커스와 포커스 윤곽선

### 원하는 콘텐츠로 건너뛰기

### 포커스 관리

> 키보드 포커스 흐름이 흐트러졌을 때 바로 잡을 목적으로 사용하는것이 좋다.

## 마우스와 포인터 이벤트

> 마우스와 포인터 이벤트로 노출된 모든 기능을 키보드만으로 사용할 수 있도록 보장해야한다.

`onBlur`와 `onFocus`같은 적절한 이벤트 핸들러를 사용해서 다른 곳에 포커스가 되면 팝업이 사라지게 만들 수 있다.

![](https://ko.reactjs.org/28ce2067489843caf05fe7ce22494542/blur-popover-close.gif)

## 기타 고려사항

### 언어 설정

스크린 리더 소프트웨어가 올바른 음성을 선택할 수 있도록 페이지 텍스트에 인간의 언어를 나타내야한다.

### 문서 제목 설정

`<title>`이 현재 페이지에 대한 올바른 설명을 담아야 한다.

### 색 대비

저시력 사용자들이 최대한 읽을 수 있도록 모든 글에 충분한 색 대비를 준다.

## 개발 및 테스트 도구

### 키보드

> 가장 쉬우면서 중요한 검사이다. 
>
> 웹사이트 전체가 키보드만으로 사용될 수 있는지 테스트하는 것이다.

1. 마우스의 연결을 해제하세요.
2. `Tab`과 `Shift+Tab`을 사용해 이동하세요.
3. `Enter`를 사용해 엘리먼트를 활성화하세요.
4. 메뉴와 드롭다운과 같은 일부 엘리먼트는 필요하다면 키보드 방향키를 사용해 조작합니다.

### 개발 보조 도구

### 브라우저에서 접근성 테스트

### 스크린 리더

#### FireFox의 NVDA

#### Safari의 VoiceOver

#### Internet Explorer의 JAWS

#### Google Chrome의 ChromeVox

