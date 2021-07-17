# SCALE UP & SCALE OUT

> 증가한 트래픽에 대처하는 방법이다.

## scale up

스케일 업은 서버를 고성능 서버로 변경하는 것이다. 장점은 구축과 관리가 용이하다. 단점은 성능 확장에 한계가 있다. 고성능이 필요한 곳에 사용된다.



## scale out

스케일 아웃은 서버 대수를 증가시키는 방법이다. 로드밸런싱이 사용되고 분산처리 시스템에 사용된다. 장점은 스케일 업보다 하드웨어 비용이 저렴하고 점진적인 증가가 가능하다. 단점은 설계, 구축, 관리 비용이 크다.



![스케일 아웃(Scale out)과 스케일 업(Scale up) : 네이버 블로그](data:image/png;base64,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)