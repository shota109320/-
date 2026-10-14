import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !passwordConfirm) {
      setError('必須項目を入力してください。');
      return;
    }

    if (password !== passwordConfirm) {
      setError('パスワードが一致していません。');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // FirestoreにUserドキュメントを作成
      await setDoc(doc(db, 'User', user.uid), {
        Name: name,
        Mail: email,
        Created_At: serverTimestamp(),
        VisitCount: 0
      });

      navigate('/rank');
    } catch (err) {
      console.error(err);
      setError('会員登録に失敗しました。');
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="brand">みうらや誠麺</h1>
        <p className="title">新規会員登録</p>
      </header>

      <main>
        <section className="form-frame" aria-labelledby="signup-heading">
          <h2 className="frame-heading" id="signup-heading">新規会員登録</h2>
          <div className="form-body">
            <p className="intro">会員ランク機能をご利用いただくための登録画面です。</p>

            <form onSubmit={handleSignup} noValidate>
              <div className="field">
                <label htmlFor="name">お名前</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="email">メールアドレス</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="password">パスワード</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="password-confirm">パスワード確認</label>
                <input
                  id="password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>

              <label className="password-toggle" htmlFor="show-password">
                <input
                  id="show-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span>パスワードを表示</span>
              </label>

              <button className="submit-button" type="submit">会員登録する</button>
              {error && <p className="error-message" role="alert">{error}</p>}
            </form>

            <div className="auth-links-area">
              <p>すでに会員の方はこちら</p>
              <Link className="text-link" to="/login">ログイン</Link>
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

export default Signup;
