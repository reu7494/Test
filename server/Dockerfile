# Node.js 베이스 이미지 사용
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 서버 코드 복사
COPY . .

# 서버 실행
EXPOSE 8008
CMD ["npm", "start"]
