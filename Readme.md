# 🚀 スペースインベーダーゲーム | レトロアーケードゲーム

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **GitHub Copilot** と **GitHub Coding Agent** で開発された80年代風スペースインベーダーゲーム

## 🎮 ゲームをプレイする

**[👾 スペースインベーダーゲームを開始する](src/index.html)**

ブラウザで上記リンクをクリックするか、`src/index.html` ファイルを直接開いてゲームをお楽しみください！

## 📋 概要

懐かしの80年代アーケードゲーム「スペースインベーダー」を現代のWeb技術で完全再現！レトロなCRTモニター風エフェクトと本格的なゲームプレイが楽しめる、ブラウザ完結型のスペースインベーダーゲームです。

### 🎯 ゲーム特徴

- 👾 **クラシックなゲームプレイ** - オリジナルのルールを忠実に再現
- 🖥️ **レトロCRTエフェクト** - ブラウン管テレビ風の視覚効果
- ⚡ **レスポンシブ対応** - PC・タブレット・モバイルで動作
- 🏆 **ハイスコア保存** - ローカルストレージでスコア記録
- 🎨 **80年代風デザイン** - グリーンモノクロームとグローエフェクト
- 🎵 **リアルタイム効果音** - 弾発射や爆発などの効果音（予定）

## 🎮 ゲームの遊び方

### 基本操作
- **←→キー**: 砲台を左右に移動
- **スペースキー**: 弾を発射 / ゲーム開始・リスタート
- **Pキー**: ポーズ・再開

### ゲームルール
1. **インベーダーを全滅させよう** - 5行×11列の敵を撃破してレベルクリア
2. **バリアを活用** - 4つの防御壁で敵の攻撃から身を守る
3. **UFOを狙え** - 時々現れるUFOを撃破してボーナス得点
4. **生き残れ** - 敵が下まで降りてきたり、残機が0になるとゲームオーバー

### スコアリング
| 敵の種類 | 得点 |
|---------|------|
| 小型インベーダー | 10点 |
| 中型インベーダー | 20点 |
| 大型インベーダー | 30点 |
| UFO | 100-500点 |
| レベルクリア | 残機×100点 |

## 🛠️ 技術スタック

### フロントエンド

| 技術                                     | バージョン | 用途                         |
| ---------------------------------------- | ---------- | ---------------------------- |
| HTML5                                    | Latest     | ゲーム画面とUI構造 |
| CSS3                                     | Latest     | レトロスタイルとエフェクト |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x (CDN)  | UIコンポーネントスタイリング |
| JavaScript                               | ES6+       | ゲームエンジンとロジック |
| Canvas API                               | 2D Context | ゲーム描画とアニメーション |

### ゲームエンジン設計

- **Object-Oriented Design** - クラスベースのゲームオブジェクト管理
- **Game Loop** - requestAnimationFrame による滑らかなアニメーション
- **Collision Detection** - 高精度な当たり判定システム
- **State Management** - ゲーム状態の適切な管理

## 📁 プロジェクト構造

```
📦 スペースインベーダーゲーム/
├── 📄 README.md                   # プロジェクト概要とプレイガイド
├── 📄 LICENSE                     # MITライセンス
├── 📄 .github/
│   └── 📄 copilot-instructions.md # GitHub Copilot 設定
├── 📁 src/                        # ゲームソースコード
│   ├── 📄 index.html             # メインゲーム画面
│   ├── 📁 css/                   # スタイルシート
│   │   └── 📄 styles.css         # レトロエフェクトCSS
│   └── 📁 js/                    # JavaScript
│       └── 📄 script.js          # ゲームエンジン
└── 📁 docs/                      # ゲーム仕様書
    └── 📄 game-specification.md  # 詳細仕様とクラス設計
```

## 🚀 クイックスタート

### 前提条件

- 📌 モダンな Web ブラウザ (Chrome 90+, Firefox 88+, Safari 14+)
- 📌 インターネット接続（TailwindCSS CDN用）

### プレイ方法

#### 🎮 すぐにプレイする

1. **ゲームを開始**
   ```
   src/index.html をブラウザで開く
   ```

2. **操作方法**
   - `←→` キー: 砲台移動
   - `SPACE` キー: 弾発射・ゲーム開始
   - `P` キー: ポーズ/再開

#### 🛠️ 開発・カスタマイズ

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/tokawa-ms/20250716-demo-001.git
   cd 20250716-demo-001
   ```

2. **ローカルでの実行**
   ```bash
   # ブラウザでsrc/index.htmlを開く
   open src/index.html
   # または
   python -m http.server 8000  # ローカルサーバー起動
   ```

3. **コードの編集**
   - `src/js/script.js`: ゲームロジック
   - `src/css/styles.css`: 視覚エフェクト
   - `src/index.html`: UI レイアウト

## 🎯 ゲーム仕様

### ゲームオブジェクト

#### 👾 インベーダー
- **配置**: 5行×11列の隊列（合計55体）
- **種類**: 小型（10点）、中型（20点）、大型（30点）
- **動作**: 左右移動、端到達時に下降、弾発射

#### 🛡️ バリア
- **数量**: 4基
- **仕様**: 6×4ブロック構造、弾が当たると周辺破損
- **特徴**: 中央下部に初期設定で穴

#### 🚀 プレイヤー
- **操作**: 左右移動、弾発射
- **制約**: 同時に1発のみ発射可能
- **残機**: 初期3機

#### 🛸 UFO
- **出現**: 20秒間隔でランダム
- **得点**: 100-500点のランダムボーナス
- **動作**: 画面上部を左から右へ横切る

### 🏆 スコアリングシステム
- ハイスコアの永続保存
- レベルクリアボーナス
- UFO撃破時の特別ボーナス表示

### 🎨 視覚エフェクト
- **CRTエフェクト**: ブラウン管テレビ風走査線
- **グローエフェクト**: テキストと境界線の発光
- **フラッシュエフェクト**: 被弾時の画面赤フラッシュ
- **パーティクル**: 爆発時の破片アニメーション

## 📱 対応デバイス・ブラウザ

このゲームは以下の環境で動作確認済みです：

### 📊 画面サイズ対応
- 📱 **モバイル**: 320px〜768px
- 📊 **タブレット**: 768px〜1024px  
- 💻 **デスクトップ**: 1024px 以上

### 🌐 ブラウザ対応
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### ⚠️ 注意事項
- JavaScript有効環境が必要
- Canvas API対応ブラウザ
- キーボード操作（モバイルは今後対応予定）

## 🔧 カスタマイズ・拡張

### ゲーム設定の調整

ゲームバランスや難易度は `src/js/script.js` で簡単に調整できます：

```javascript
// インベーダーの移動速度
this.invaderMoveInterval = 1000; // ミリ秒

// プレイヤーの移動速度  
this.speed = 5; // ピクセル/フレーム

// 弾の発射間隔
const shootInterval = 2000 - this.level * 100; // レベル連動

// UFOの出現間隔
this.ufoTimer >= 20000; // 20秒
```

### 視覚効果のカスタマイズ

CRTエフェクトやグローは `src/css/styles.css` で調整：

```css
/* CRTエフェクトの強度 */
.crt-effect {
    opacity: 0.3; /* 0-1で調整 */
}

/* グローエフェクトの色 */
.glow {
    text-shadow: 0 0 20px currentColor; /* 発光強度 */
}
```

### 新機能の追加例
- 音効果の実装
- パワーアップアイテム
- 複数ステージ
- 協力プレイモード

## 🤝 コントリビューション

ゲームの改善や新機能の追加を歓迎します！

### 貢献方法
1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`) 
5. Pull Request を作成

### 改善アイデア
- 🎵 音効果・BGMの実装
- 📱 モバイル対応（タッチ操作）
- 🏅 実績・トロフィーシステム
- 🌐 オンラインランキング
- 🎮 ゲームパッド対応
- 🎨 追加のビジュアルエフェクト

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🆘 サポート・技術情報

- 📖 **詳細仕様**: [ゲーム仕様書](docs/game-specification.md)
- 💬 **GitHub Discussions**: プロジェクトに関する議論
- 🐛 **Issue 報告**: [Issues](https://github.com/tokawa-ms/20250716-demo-001/issues)
- 🎓 **GitHub Copilot**: [公式ドキュメント](https://docs.github.com/en/copilot)

## 📊 開発統計

![GitHub stars](https://img.shields.io/github/stars/tokawa-ms/20250716-demo-001?style=social)
![GitHub forks](https://img.shields.io/github/forks/tokawa-ms/20250716-demo-001?style=social)
![GitHub issues](https://img.shields.io/github/issues/tokawa-ms/20250716-demo-001)

---

<div align="center">
  <strong>👾 レトロゲームの魅力を現代に！ 🚀</strong><br>
  Made with ❤️ and GitHub Copilot<br><br>
  <strong>🎮 [今すぐプレイする](src/index.html) 🎮</strong>
</div>
