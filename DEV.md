# ATTACK LIST / GOAL 開発ガイド（複数デバイス対応）

会社PC・Mac・iPhone、どこからでも開発するためのメモ。
**GitHubリポジトリが唯一の正**なので、「作業前に取得（pull）→ 編集 → 反映（push）」を各デバイスで回すだけ。

- 公開URL: https://hktymc18.github.io/hotlist/ （ATTACK LIST）
- GOAL: https://hktymc18.github.io/hotlist/goal.html （目標設定シート）
- リポジトリ: https://github.com/hktymc18/hotlist.git （**public**）
- Firebaseプロジェクト: `hotlist-21865`（APIキーはクライアント公開前提・秘密ではない）

---

## 1. 構成（何を触るか）

| ファイル | 役割 |
|---|---|
| `index.html` | **ATTACK LIST 本体**（単一HTML。HTML/CSS/JSぜんぶ入り） |
| `goal.html` | **GOAL SETTING 本体**（目標設定シート・単一HTML） |
| `manifest.json` / `manifest-goal.json` | PWA設定（各アプリ用） |
| `icon-*.png` / `icon.svg` | アイコン |

- **ビルド不要・npm不要**。ただの静的ファイル。
- Firebaseは **モダンSDK（v10.12.0 / ES modules・`import`）** を使用。
  → **モダンJSでOK**（`const`/`let`/アロー関数OK。groove-mapのようなES5制約は無し）。
- **Service Workerは無し** → groove-mapのようなキャッシュ用バージョン番号の更新は不要。
- `main` ブランチに push すると **GitHub Pagesが自動でデプロイ**（1〜3分で反映）。

---

## 2. デバイス別の始め方

### 🥇 Claude Code on the web（ブラウザだけ・会社PC / iPhone 共通・おすすめ）
1. ブラウザで **https://claude.ai/code** を開く
2. いつものAnthropicアカウントでログイン
3. GitHubを連携し、リポジトリ `hktymc18/hotlist` を開く
4. プロンプトで指示 → クラウド上で編集 → そのままpush → 自動デプロイ
- **インストール禁止の会社PCでもOK**。iPhoneのSafariからも使える。

### 🖥 会社PC / Mac（ローカルでガッツリ）
```bash
# 初回だけ
git clone https://github.com/hktymc18/hotlist.git
cd hotlist

# 毎回の流れ
git pull                        # ← 必ず最初に最新取得
# index.html / goal.html を編集（VS Code など）
git add index.html goal.html
git commit -m "変更内容"
git push                        # ← push で本番反映
```
- エディタは **VS Code** 推奨。Macと同じAI開発をしたければ **Claude Code（Win/Mac版）** も入れる。

### 📱 iPhone（アプリで手元修正）
- **Working Copy**（iOS用Gitアプリ）でクローン → 内蔵エディタで編集 → commit → push
- 小さな修正やPR確認だけなら **GitHubアプリ** でも可。

---

## 3. ローカルで見た目を確認（任意）
単一HTMLなので、ローカルサーバで開くだけ:
```bash
cd hotlist
python3 -m http.server 8000
# → http://localhost:8000          (ATTACK LIST)
# → http://localhost:8000/goal.html (GOAL)
```
（Firebaseは本番プロジェクトに接続されるので、ログイン等も動く）

---

## 4. 守ること（ハマりどころ）

- ✅ **作業前に必ず `git pull`**。複数端末で編集するので、古い状態から上書きするのが一番の事故。
- ✅ 基本は「**1端末で編集→push→他端末でpull**」。同時編集は競合のもと。
- ✅ `index.html` と `goal.html` は**別アプリ**。片方を直しても、もう片方には反映されない（共通ロジックは各ファイルに存在）。
- ✅ push権限（＝デプロイ）は各端末で**初回だけGitHub認証**（ブラウザ系はOAuth、ローカルGitは Personal Access Token か SSH鍵）。
- ✅ Firebase APIキーはコードに入っていてOK（公開前提）。GitHubのシークレット警告は「クライアント利用」で無視可。セキュリティは Firestoreルール＋認証で担保。
- ✅ ATTACK LIST と GROOVE MAP は**同じFirebaseプロジェクト**（`hotlist-21865`）。認証（ログイン）は共通、データは別コレクション。

---

## 5. デプロイ確認
push後、数分で反映。ライブを開いて動作確認:
```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://hktymc18.github.io/hotlist/?cb=$RANDOM"
```
Service Workerが無いので、通常はブラウザの再読み込み（またはスーパーリロード）で最新になる。
