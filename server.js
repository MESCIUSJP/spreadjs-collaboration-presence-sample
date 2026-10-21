import express from 'express';
import http from 'http';
import { Server } from '@mescius/js-collaboration';
import * as OT from '@mescius/js-collaboration-ot';
import { type } from '@mescius/spread-sheets-collaboration';
import { presenceFeature } from '@mescius/js-collaboration-presence';

const mockUsers = [
  { id: '0', name: "User1", color: "#0000ff", mode: 'edit' },
  { id: '1', name: "User2", color: '#008000', mode: 'edit' },
  { id: '2', name: "User3", color: '#9900cc', mode: 'edit' },
];

// typeを登録
OT.TypesManager.register(type);

const app = express();
const httpServer = http.createServer(app);
const server = new Server({ httpServer });
const port = 8080;

// ライセンスの設定
//server.LicenseKey = 'localhost環境以外では、ここにSpreadJSの共同編集機能が有効なサーバー用ライセンスキーを設定します';

// OTドキュメントサービスを初期化
const documentServices = new OT.DocumentServices();
server.useFeature(OT.documentFeature(documentServices));
server.useFeature(presenceFeature());

// publicディレクトリを静的リソースとして公開
app.use(express.static('public'));

// 認証ミドルウェア
server.use("connect", async (context, next) => {
  const token = context.connection.auth?.token;
  if (!token) return await next("トークンが指定されていません");
  try {
    const user = mockUsers.find(u => u.id === token);
    if (!user) return await next("ユーザーが存在しません");
    context.connection.tags.set("user", { id: user.id, username: user.name, mode: user.mode });
    await next();
  } catch {
    await next("無効なトークンです");
  }
});

// Opの送信権限を検証
documentServices.use('submit', async (context, next) => {
  console.log('受信したメッセージ ユーザー ID:', context.connection.auth?.token);
  const userInfo = context.connection.tags.get('user');
  if (!userInfo) {
    console.error('ユーザー情報が存在しません');
    await next('ユーザー情報が存在しません');
  }
  await next();
});

// サーバーを起動
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://127.0.0.1:${port}/iframe.html`);
});