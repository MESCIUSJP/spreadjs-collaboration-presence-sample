import * as GC from '@mescius/spread-sheets'
import '@mescius/spread-sheets-resources-ja';
import '@mescius/spread-sheets-collaboration-addon';
import { Client } from "@mescius/js-collaboration-client";
import * as OT from "@mescius/js-collaboration-ot-client";
import { type, bind, bindPresence } from '@mescius/spread-sheets-collaboration-client';
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import { Presence } from "@mescius/js-collaboration-presence-client";

// ライセンスの設定
//GC.Spread.Sheets.LicenseKey = 'ここにSpreadJSの共同編集機能が有効なライセンスキーを設定します';

const BrowsingMode = GC.Spread.Sheets.Collaboration.BrowsingMode;
const mockUsers = [
  { id: '0', name: "User1", color: "#0000ff", mode: 'edit' },
  { id: '1', name: "User2", color: '#008000', mode: 'edit' },
  { id: '2', name: "User3", color: '#9900cc', mode: 'edit' },
];
const getUser = (id) => {
  const user = mockUsers.find(u => u.id === id);
  return {
    ...user,
    permission: {
      mode: user.mode === 'edit' ? BrowsingMode.edit : BrowsingMode.view,
    }
  }
}

// typeを登録
OT.TypesManager.register(type);

window.onload = async () => {
  // ワークブックの生成
  const workbook = new GC.Spread.Sheets.Workbook('ss');

  // カルチャの設定
  GC.Spread.Common.CultureManager.culture('ja-jp');

  // シートの設定
  const sheet = workbook.getActiveSheet();
  sheet.zoom(1.6);

  // モックユーザー
  let userId = '';
  switch(window.frameElement.id){
    case 'iframe1':
      userId = '0';
      break;
    case 'iframe2':
      userId = '1';
      break;
    case 'iframe3':
      userId = '2';
      break;
  }
  const user = getUser(`${userId}`);

  // サーバーに接続してルームに参加し、ユーザーIDを使用してauthを追加
  const conn = new Client().connect('room1', { auth: { token: user.id } });
  const doc = new OT.SharedDoc(conn);

  // プレゼンスを作成してバインド
  const presence = new Presence(conn);
  await bindPresence(workbook, presence, user);

  // エラー監視
  doc.on('error', (err) => {
    console.error('error:', err);
  });
  await doc.fetch();

  // ドキュメントが存在しない場合は初期化
  if (!doc.type) {
    await doc.create(workbook.collaboration.toSnapshot(), type.uri, {});
    await bind(workbook, doc);
  } else {
    await bind(workbook, doc);
  }

  // ユーザー名の表示
  const userName = document.getElementById("username");
  userName.innerText = user.name;
  userName.style.backgroundColor = user.color;
}