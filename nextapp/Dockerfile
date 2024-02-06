# Node.js lts image
FROM node:lts

# ワーキングディレクトリを指定
WORKDIR /usr/src/app

# 同一ディレクトリ内のファイルを全てコピー
COPY . .

# パッケージをインストール
RUN npm install
#本番環境
RUN npm run build

# 3000番ポートでリッスン
EXPOSE 3000

# React の起動
#開発環境時
# CMD ["npm", "run", "dev"]
#本番環境
CMD [ "npm", "run", "start" ] 