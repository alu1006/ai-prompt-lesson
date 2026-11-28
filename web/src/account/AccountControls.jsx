export default function AccountControls({ member, localCount, onImport, importNotice }) {
  return <section className="member-controls" aria-label="帳號與收藏同步">
    {!member.configured ? <p>雲端收藏準備中，目前收藏保存在這個瀏覽器。</p>
      : !member.authReady ? <p role="status">正在確認登入狀態…</p>
      : member.user ? <>
        <p><strong>{member.user.displayName || 'CodingLu 使用者'}</strong> · {member.cloudReady ? '目前使用帳號收藏' : '正在讀取帳號收藏…'}</p>
        <div className="member-actions">
          <button type="button" disabled={member.busy} onClick={() => void member.logout()}>登出</button>
          <a href="https://codinglu.tw/account">主站會員中心</a>
          {localCount > 0 && <button type="button" disabled={member.busy || !member.cloudReady} onClick={onImport}>{member.busy ? '處理中…' : `匯入本機 ${localCount} 則收藏到此帳號`}</button>}
        </div>
        {localCount > 0 && <p className="member-hint">匯入只複製到目前帳號，保留本機原檔；重複提示詞不會新增第二份。</p>}
      </> : <>
        <p>目前使用本機收藏。登入後可收藏到帳號，跨裝置使用。</p>
        <div className="member-actions"><button type="button" disabled={member.busy} onClick={() => void member.login()}>{member.busy ? '登入中…' : '使用 Google 登入'}</button></div>
      </>}
    {member.error && <p role="alert">{member.error}</p>}
    {importNotice && <p role="status">{importNotice}</p>}
  </section>
}
