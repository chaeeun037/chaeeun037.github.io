---
search: true
comments: true
categories: [Frontend]
---


# BROWSER RENDERING

> 브라우저 렌더링 관점에서 https://example.com 접속 후 화면에 보이기까지의 과정을 표현해보자.



1. 주소 창에 도메인 입력한다.
2. DNS 서버를 통해 ip 주소를 찾고, 웹 페이지를 요청하여 웹 어플리케이션 데이터를 받아온다.
3. HTML load와 parsing을 진행하면서 DOM tree를 구축한다.
4. CSS 파일을 만날 시에는 CSS load와 parsing을 진행해서 CSSOM tree를 구축한다.
5. script를 만날 시에는 제어권을 rendering engine에서 javascript engine으로 넘기고(html 파싱 멈춤), script 파일을 load하여 *syntax tree를 구축하고, 과정이 끝나면 다시 rendering engine으로 제어권을 넘겨주고 DOM tree 구축을 진행한다.
6. script를 통해 html, css가 바뀌면 repaint와 reflow를 진행한다.
7. HTML과 CSS parsing이 완료되면 두 가지를 결합하여 최종적으로 render(ing) tree를 생성하고 사용자에게 뷰를 전달한다.

![](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/render-tree-construction.png?hl=ko)



> *: javascript engine이 script 파일을 AST(Abstract Syntax Tree)로 변환하여 이를 기반으로 인터프리터가 바이트 코드를 생성한다.
>
> 출처 https://blog.naver.com/dlaxodud2388/222260114774