// =====================================================================
// 個人情報保護方針・利用規約の同意画面（ATTACK LIST / GOAL SETTING 共通）
// NAVIGATOR（groove-map の app.js の showPrivacyGate）と同じ内容・同じ版。
// 同意の記録は3アプリ共通の users/{uid}.privacy = { ver, at }（どれか1つで同意すれば他でも出ない）。
// 方針・規約の本文は groove-map の /privacy/・/terms/（同じ hktymc18.github.io）を表示する。
// ※ 版（VER）を上げる時は groove-map の PRIVACY_VER と必ずそろえる
// =====================================================================
(function () {
  var VER = '2026-10';
  var DOC = '../groove-map/';
  var SUM = [
    ['取得する情報', '方針 第3条', '氏名、屋号、所属ユニオン、活動地域、UPルビー、UPBD及びメールアドレスのほか、ユーザーが登録する組織図・予定・目標・連絡先の情報、最終ログイン日時並びに受付システムの出欠の記録等を取得します。'],
    ['利用目的', '方針 第4条', '本サービスの提供及び運営、利用承認、問合せへの対応、不正利用の防止並びに本サービスの改善に限り利用し、広告の配信、販売その他の目的には一切利用しません。'],
    ['閲覧の範囲', '方針 第7条', '登録情報を閲覧できるのは、本人及び本人が共有機能により明示的に許可した者に限られます。所属ユニオンの管理者は、利用承認に必要な登録情報に限り閲覧します。'],
    ['外国にあるサーバーへの保存', '方針 第8条', 'データは Google LLC（アメリカ合衆国）が提供する Firebase に保存され、日本国外に所在するサーバーに保存される場合があります。'],
    ['登録対象者の情報に関する責任', '方針 第10条・規約 第5条', '他者の情報は、ユーザー自身が適法に知り得たものに限り登録できます。その取得、管理、利用及び提供に関する一切の法的責任はユーザーが負い、登録対象者からの削除等の申出には、ユーザーが速やかに対応しなければなりません。'],
    ['禁止事項及び利用の停止', '規約 第7条・第8条・第11条', '登録した情報を本人の同意なく公開又は拡散する行為、なりすまし、不正アクセス等を禁止します。違反した場合、事前の通知なく利用を停止し、生じた損害の賠償を求めることがあります。'],
    ['保証の否認', '規約 第10条', 'シミュレーション、目標及び収入の目安その他の数値は参考値にすぎず、将来の成果又は収入を保証するものではありません。'],
    ['開示等の請求及び退会', '方針 第11条・第12条', 'NAVIGATOR の「設定」→「バグ・要望」から、又は所属ユニオンのリーダーを通じて申し出ることができます。退会の申出があった場合、アカウント及び登録情報を速やかに削除します。']
  ];
  var CHK = ['個人情報保護方針の全条項を読み、その内容に同意します', '利用規約の全条項を読み、その内容に同意します', '登録する他者の個人情報について、自らが一切の責任を負うことを確認しました'];
  var ICON_SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // 画面が暗いか（全文ページの明暗を合わせる）
  function isDark() {
    try {
      var m = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
      if (m) return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) < 128;
    } catch (e) {}
    return false;
  }
  function css() {
    if (document.getElementById('ncCss')) return;
    var s = document.createElement('style'); s.id = 'ncCss';
    s.textContent = ''
      + '#ncGate{--ncA:var(--primary,#2CE5B8);--ncT:var(--text,#1a1f2b);--ncM:var(--text-muted,#7a8296);--ncS:var(--surface,#fff);--ncB:var(--border,#e2e6ef);'
      + 'position:fixed;inset:0;z-index:100000;background:var(--bg,#f5f6f9);color:var(--ncT);display:flex;align-items:center;justify-content:center;overflow:auto;'
      + 'padding:calc(env(safe-area-inset-top) + 18px) 18px calc(env(safe-area-inset-bottom) + 18px);font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Noto Sans JP",sans-serif;text-align:left}'
      + '#ncGate *{box-sizing:border-box}'
      + '#ncGate .nc-box{width:100%;max-width:460px;margin:auto}'
      + '#ncGate .nc-k{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:800;letter-spacing:.24em;color:var(--ncA)}'
      + '#ncGate .nc-k svg{width:15px;height:15px}'
      + '#ncGate h2{font-size:19px;font-weight:700;line-height:1.45;margin:10px 0 4px;color:var(--ncT)}'
      + '#ncGate .nc-meta{font-size:11px;color:var(--ncM);letter-spacing:.04em;margin-bottom:12px}'
      + '#ncGate .nc-lead{font-size:12.5px;color:var(--ncM);line-height:1.75;margin:0 0 12px;text-align:left}'
      + '#ncGate .nc-lead b{color:var(--ncT)}'
      + '#ncGate .nc-sum{border-radius:12px;background:var(--ncS);border:1px solid var(--ncB);max-height:min(38vh,330px);overflow:auto;-webkit-overflow-scrolling:touch}'
      + '#ncGate .nc-sh{position:sticky;top:0;background:var(--ncS);padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--ncM);border-bottom:1px solid var(--ncB)}'
      + '#ncGate .nc-it{padding:10px 12px;border-bottom:1px solid var(--ncB)}'
      + '#ncGate .nc-it:last-child{border-bottom:none}'
      + '#ncGate .nc-t{display:flex;align-items:baseline;gap:8px;font-size:13px;font-weight:700;color:var(--ncT);margin-bottom:3px}'
      + '#ncGate .nc-t i{font-style:normal;font-size:11px;font-weight:700;color:var(--ncA);min-width:16px}'
      + '#ncGate .nc-t em{margin-left:auto;font-style:normal;font-size:10px;font-weight:700;color:var(--ncM);border:1px solid var(--ncB);border-radius:6px;padding:2px 6px;white-space:nowrap}'
      + '#ncGate .nc-d{font-size:12px;color:var(--ncM);line-height:1.7;text-align:left;padding-left:24px}'
      + '#ncGate .nc-links{display:flex;gap:8px;margin:12px 0}'
      + '#ncGate .nc-links span{flex:1;text-align:center;padding:10px 4px;border-radius:10px;border:1px solid var(--ncB);font-size:11.5px;font-weight:700;color:var(--ncT);cursor:pointer;white-space:nowrap}'
      + '#ncGate .nc-chks{border-top:1px solid var(--ncB);padding-top:10px;margin-bottom:12px}'
      + '#ncGate label{display:flex;gap:10px;align-items:flex-start;font-size:12.5px;color:var(--ncT);line-height:1.6;cursor:pointer;padding:6px 0;margin:0}'
      + '#ncGate label input{width:19px;height:19px;margin:1px 0 0;accent-color:var(--ncA);flex-shrink:0}'
      + '#ncGate .nc-go{width:100%;padding:14px;border-radius:12px;border:none;background:var(--ncA);color:var(--on-accent,#111);font-size:15px;font-weight:700;cursor:pointer;transition:opacity .15s}'
      + '#ncGate .nc-go:disabled{opacity:.3;cursor:default}'
      + '#ncGate .nc-no{display:block;text-align:center;margin-top:12px;font-size:12.5px;color:var(--ncM);cursor:pointer;text-decoration:underline}'
      + '#ncGate .nc-ft{margin-top:14px;font-size:10.5px;color:var(--ncM);opacity:.75;line-height:1.6;text-align:center}'
      + '#ncDoc{position:fixed;inset:0;z-index:100001;background:var(--bg,#f5f6f9);display:flex;flex-direction:column}'
      + '#ncDoc .nc-dh{display:flex;align-items:center;gap:10px;padding:calc(env(safe-area-inset-top) + 10px) 14px 10px;border-bottom:1px solid var(--border,#e2e6ef);font-weight:700;font-size:15px;color:var(--text,#1a1f2b)}'
      + '#ncDoc .nc-dh span{margin-left:auto;padding:7px 14px;border-radius:10px;background:var(--surface,#fff);border:1px solid var(--border,#e2e6ef);font-size:13px;cursor:pointer}'
      + '#ncDoc iframe{flex:1;border:none;width:100%}'
      + '@media (min-width:900px){#ncGate{background:rgba(5,8,14,.6);backdrop-filter:blur(6px)}#ncGate .nc-box{max-width:560px;background:var(--bg,#f5f6f9);border:1px solid var(--ncB);border-radius:20px;padding:28px 30px 20px;box-shadow:0 20px 60px rgba(0,0,0,.25)}#ncGate .nc-sum{max-height:300px}'
      + '#ncDoc{inset:5vh 50% 5vh auto;width:min(760px,92vw);transform:translateX(50%);border-radius:18px;border:1px solid var(--border,#e2e6ef);overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.25)}}';
    document.head.appendChild(s);
  }
  function openDoc(kind) {
    closeDoc(); css();
    var d = document.createElement('div'); d.id = 'ncDoc';
    d.innerHTML = '<div class="nc-dh">' + (kind === 'terms' ? '利用規約' : '個人情報保護方針') + '<span data-nc="close">閉じる</span></div>'
      + '<iframe src="' + DOC + (kind === 'terms' ? 'terms' : 'privacy') + '/?t=' + (isDark() ? 'dark' : 'light') + '" title="全文"></iframe>';
    d.querySelector('[data-nc="close"]').onclick = closeDoc;
    document.body.appendChild(d);
  }
  function closeDoc() { var d = document.getElementById('ncDoc'); if (d && d.parentNode) d.parentNode.removeChild(d); }
  function close() { closeDoc(); var g = document.getElementById('ncGate'); if (g && g.parentNode) g.parentNode.removeChild(g); }
  // 同意が必要か（プロフィールのデータを渡す）
  function need(data) { var p = data && data.privacy; return !(p && p.ver === VER); }
  // 同意の記録（プロフィールに入れる値）
  function record() { return { ver: VER, at: new Date().toISOString() }; }
  // 同意画面を出す。opt = { app:'ATTACK LIST', data:プロフィール, save:function(rec){Promise}, onOk:function(){}, onLogout:function(){} }
  function show(opt) {
    close(); css();
    var upd = !!(opt.data && opt.data.privacy && opt.data.privacy.ver);
    var g = document.createElement('div'); g.id = 'ncGate';
    g.innerHTML = '<div class="nc-box">'
      + '<div class="nc-k">' + ICON_SHIELD + esc(opt.app || 'NAVIGATOR') + '</div>'
      + '<h2>' + (upd ? '個人情報保護方針及び利用規約の改定について' : '個人情報保護方針及び利用規約への同意') + '</h2>'
      + '<div class="nc-meta">第1版（' + VER + '）／ 2026年10月1日施行 ／ 運営：PROMOTE</div>'
      + '<p class="nc-lead">' + (upd
          ? '当団体は、個人情報保護方針及び利用規約を改定しました。<b>改定後の全条項に同意いただかない限り、本サービスを引き続きご利用いただくことはできません。</b>'
          : '本サービス（NAVIGATOR・ATTACK LIST・GOAL SETTING）のご利用にあたっては、PROMOTE（以下「当団体」）が定める個人情報保護方針及び利用規約の全条項に同意いただく必要があります。<b>同意いただけない場合、本サービスはご利用いただけません。</b>')
        + '下記の主要条項の要旨を確認のうえ、必ず全文をお読みください。</p>'
      + '<div class="nc-sum"><div class="nc-sh">主要条項の要旨</div>'
      + SUM.map(function (x, i) { return '<div class="nc-it"><div class="nc-t"><i>' + (i + 1) + '</i>' + x[0] + '<em>' + x[1] + '</em></div><div class="nc-d">' + x[2] + '</div></div>'; }).join('')
      + '</div>'
      + '<div class="nc-links"><span data-nc="privacy">個人情報保護方針（全文）</span><span data-nc="terms">利用規約（全文）</span></div>'
      + '<div class="nc-chks">' + CHK.map(function (t) { return '<label><input type="checkbox">' + t + '</label>'; }).join('') + '</div>'
      + '<button class="nc-go" disabled>同意して利用を開始する</button>'
      + '<span class="nc-no">同意しない（ログアウト）</span>'
      + '<div class="nc-ft">同意の日時及び同意した版は記録され、当団体が保管します。</div>'
      + '</div>';
    document.body.appendChild(g);
    var go = g.querySelector('.nc-go'), cs = g.querySelectorAll('.nc-chks input');
    var sync = function () { var all = true; for (var i = 0; i < cs.length; i++) if (!cs[i].checked) all = false; go.disabled = !all; };
    for (var i = 0; i < cs.length; i++) cs[i].onchange = sync;
    g.querySelector('[data-nc="privacy"]').onclick = function () { openDoc('privacy'); };
    g.querySelector('[data-nc="terms"]').onclick = function () { openDoc('terms'); };
    g.querySelector('.nc-no').onclick = function () { close(); if (opt.onLogout) opt.onLogout(); };
    go.onclick = function () {
      if (go.disabled) return;
      go.disabled = true; go.textContent = '...';
      var rec = record();
      Promise.resolve(opt.save(rec)).then(function () {
        if (opt.data) opt.data.privacy = rec;
        close();
        if (opt.onOk) opt.onOk();
      }).catch(function (e) {
        go.disabled = false; go.textContent = '同意して利用を開始する';
        alert('保存できませんでした。電波の良い所でもう一度お試しください');
        try { console.error(e); } catch (e2) {}
      });
    };
  }
  window.NavConsent = { VER: VER, need: need, record: record, show: show, openDoc: openDoc, close: close };
})();
