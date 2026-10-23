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

const mockUsers = [
  { id: '0', name: "User1", color: "#0000ff"},
  { id: '1', name: "User2", color: '#008000'},
  { id: '2', name: "User3", color: '#9900cc'},
];

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

  // モックユーザー（iframe1〜3 に User1〜3 を割り当て）
  const index = ['iframe1', 'iframe2', 'iframe3'].indexOf(window.frameElement.id);
  const user = mockUsers[index];

  // サーバーに接続してルームに参加
  const conn = new Client().connect('room1');
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