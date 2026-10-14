import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Rank.css';

// ランク判定ロジック
const getRankInfo = (visitCount) => {
  if (visitCount >= 30) {
    return { name: 'プラチナ会員', mark: '金', class: 'platinum', nextThreshold: null, isMax: true };
  } else if (visitCount >= 10) {
    return { name: 'ゴールド会員', mark: '金', class: 'gold', nextThreshold: 30, nextName: 'プラチナランク', isMax: false };
  } else if (visitCount >= 3) {
    return { name: 'シルバー会員', mark: '銀', class: 'silver', nextThreshold: 10, nextName: 'ゴールドランク', isMax: false };
  } else {
    return { name: 'ブロンズ会員', mark: '銅', class: 'bronze', nextThreshold: 3, nextName: 'シルバーランク', isMax: false };
  }
};

function Rank() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // FirestoreからUser情報を取得
        const docRef = doc(db, 'User', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="page" style={{ color: 'white', textAlign: 'center', padding: '50px' }}>読み込み中...</div>;
  }

  // ログインしていない場合はエントリー画面を表示
  if (!user) {
    return (
      <div className="page">
        <header className="topbar">
          <h1 className="brand">みうらや誠麺</h1>
          <p className="title">会員ランク</p>
        </header>
        <main>
          <section className="member-entry">
            <h2>みうらや誠麺 会員サービス</h2>
            <p>ご来店回数に応じてランクアップ<br />会員ランクに応じた特典をご用意</p>
            <div className="entry-points">
              <Link className="entry-button" to="/login">ログイン</Link>
              <div>
                <p>初めての方はこちら</p>
                <Link className="entry-button secondary" to="/signup">新規会員登録</Link>
              </div>
            </div>
          </section>
          <div className="home-wrap">
            <a className="home-button" href="/">トップページへ戻る</a>
          </div>
        </main>
      </div>
    );
  }

  // ログインしている場合はランク情報を表示
  const visitCount = userData?.VisitCount || 0;
  const rank = getRankInfo(visitCount);
  const progressPercent = rank.isMax ? 100 : Math.min(100, Math.floor((visitCount / rank.nextThreshold) * 100));

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="brand">みうらや誠麺</h1>
        <p className="title">会員ランク</p>
      </header>

      <main>
        <div id="member-content">
          <section className="section">
            <h2 className="section-heading">現在のランク</h2>
            <div className="section-body">
              <div className={`rank-plank ${rank.class}`}>
                <span className="rank-mark">{rank.mark}</span>
                <span className="rank-label">現在のランク</span>
                <strong className="rank-name">{rank.name}</strong>
              </div>

              <div className="stats">
                <div className="stat">
                  <span className="stat-label">来店回数</span>
                  <strong className="stat-value">{visitCount}回</strong>
                </div>
                <div className="stat">
                  <span className="stat-label">次のランクまで</span>
                  <strong className="stat-value">
                    {rank.isMax ? '最高ランク' : `あと${rank.nextThreshold - visitCount}回`}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {!rank.isMax && (
            <section className="section">
              <h2 className="section-heading">次のランクまで</h2>
              <div className="section-body">
                <div className="progress-copy">
                  <span>{rank.nextName}まであと{rank.nextThreshold - visitCount}回</span>
                  <strong>{visitCount} / {rank.nextThreshold}</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="progress-number">現在 {visitCount}回 / 必要 {rank.nextThreshold}回</p>
              </div>
            </section>
          )}

          <section className="section">
            <h2 className="section-heading">来店履歴</h2>
            <div className="section-body">
              <div className="history">
                {/* ハードコードされた履歴 */}
                <div className="history-item"><span>2026/08/20</span><span>来店</span></div>
                <div className="history-item"><span>2026/08/15</span><span>来店</span></div>
                <div className="history-item"><span>2026/08/03</span><span>来店</span></div>
              </div>
            </div>
          </section>
        </div>

        <div className="logout-wrap">
          <button className="logout-button" onClick={handleLogout} type="button">ログアウト</button>
        </div>

        <div className="home-wrap">
          <a className="home-button" href="/">トップページへ戻る</a>
        </div>
      </main>
    </div>
  );
}

export default Rank;
