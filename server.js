import express from 'express';
import http from 'http';
import { Server } from '@mescius/js-collaboration';
import * as OT from '@mescius/js-collaboration-ot';
import { type } from '@mescius/spread-sheets-collaboration';
import { presenceFeature } from '@mescius/js-collaboration-presence';

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

// サーバーを起動
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://127.0.0.1:${port}/iframe.html`);
});