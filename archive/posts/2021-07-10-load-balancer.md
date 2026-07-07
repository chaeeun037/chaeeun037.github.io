---
search: true
comments: true
categories: [Backend]
---

# LOAD BALANCER

> 가상 IP를 통해서 하나의 서비스를 여러 서비스가 분산처리하는 메커니즘이다.하나의 서버에 발생하는 트래픽이 많을 경우에 부하량과 속도 저하를 해소하거나 장애가 발생했을 때 서비스가 중단되지 않고 지속하기 위해서 사용한다.

서버의 대표 ip를 virtual ip로 설정하고 들어오는 패킷들을 L4 또는 L7 스위치를 통해 분석한다. 

L4 스위치의 경우 포트를 분석하여 알맞는 서버를 찾아 보내고, L7 스위치의 경우 포트 뿐만 아니라 이메일 또는 파일 제목, url까지 분석하여 패킷을 분산처리한다. 

이때 각각의 서버에 트래픽을 균등하게 보내기 위해 Round Robin, Least Connection, Response Time, Hash 등의 기법으로 분산시킨다.

## L4 vs L7

L4 스위치는 전송계층에서 작동하는 스위치로서 ip 주소를 통해 호스트종단으로 전송하는 것 뿐만 아니라 포트번호에 맞는 서버로 패킷을 전송하여 분산처리가 가능하다는 장점이 있다. 

L7 스위치는 응용계층에서 작동하는 스위치로서 L4 스위치보다 한단계 더 높이 패킷의 url, 쿠키, payload 일부분을 읽어서 더욱 세밀한 분산 처리를 도울 수 있는 장점이 있다.

## 로드 밸런싱 전략

### Round Robin

각 서버에 session을 순차적으로 맺어주는 방식입니다. 모든 클라이언트를 동일하게 취급하고, 각 서버별 처리량을 기억하고 있어야 합니다.

### Least Connection

클라이언트와 서버별 연결된 connection 수를 고려하여 가장 적은 서버에 connection 을 맺는 방식입니다.

### Weighted Least Connections

Least Connection 방식에서 서버에 가중치를 추가한 것으로 open 된 connection 수가 같을 경우 가중치가 높은 서버에게 우선 분배하는 방식입니다.

### Response Time

서버의 응답시간에 대한 학습을 통하여 응답시간이 빠른 서버에 conneciton을 우선 분배하고 응답이 느린 서버에는 connection을 적게 분배하는 방식입니다.

### Hash

Hash 알고리즘을 적용하여 특정 서버에 connection을 연결한 클라이언트는 다음 연결에도 같은 서버에 connection을 맺는 방식입니다. 한번 성립된 session을 유지할 수 있는 장점이 있습니다.

