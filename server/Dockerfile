# Node.js 이미지 설정
FROM node:16

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 서버 파일 복사
COPY . .

# 포트 설정
EXPOSE 8008

# 서버 실행
CMD ["node", "ListServer.js"]
