---
search: true
comments: true
categories: [Web]
---


# WEB SOCKET

### Why?

HTTP의 요청 같은 경우는 Client에서만 request 요청을 보낼 수 있고, Server가 먼저 respond(데어터)를 보낼 수 없는 구조이다.

이와 달리, Socket 통신은 각각의 Port를 통해 연결을 성립해서 실시간으로 양방향 통신이 가능하다.



실시간 상호작용

Long Polling

클라이언트에서 요청을 보내고 서버에서는 이벤트가 발생했을 때 응답을 내려주고, 클라이언트가 응답을 받았을 때 다시 다음 응답을 기다리는 요청을 보내는 방식!

단점

부하가 크다.

Stream



Socket.io

> 모든 브라우저에서 소켓 통신이 가능하게 커버해준다.

