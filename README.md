# 강원특별자치도 운수종사자 일상점검 — Railway 통합본

## 한 주소에서 전부 사용
- `/` 또는 `/app` → 기사용 일상점검 앱(PWA)
- `/admin` → 관리자
- `/import` → 회원명부 등록
- `/health` → Railway 상태 확인

## 기사용 앱 설치
### Android Chrome
1. Railway 주소 `/` 접속
2. 우측 상단 ⋮
3. `앱 설치` 또는 `홈 화면에 추가`
4. `일상점검` 아이콘 실행

### iPhone Safari
1. Railway 주소 `/` 접속
2. 공유 버튼
3. `홈 화면에 추가`
4. `추가`

## Railway 새 프로젝트
```powershell
npm i -g @railway/cli
railway login
railway init
railway up
railway domain
```

## 기존 Railway 프로젝트에 연결
```powershell
railway login
railway link
railway up
```

## GitHub
```powershell
git init
git add .
git commit -m "Railway 통합 일상점검 배포"
gh auth login
gh repo create gangwon-daily-check --private --source=. --remote=origin --push
```

데이터와 인증은 기존 Supabase를 그대로 사용합니다. 프런트엔드에는 service-role 키가 포함되어 있지 않습니다.
