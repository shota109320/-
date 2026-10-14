import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/rank');
    } catch (err) {
      console.error(err);
      setError('メールアドレスまたはパスワードが違います');
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="brand">みうらや誠麺</h1>
        <p className="title">会員ログイン</p>
      </header>

      <main>
        <section className="form-frame" aria-labelledby="login-heading">
          <h2 className="frame-heading" id="login-heading">会員ログイン</h2>
          <div className="form-body">
            <p className="intro">会員ランクをご確認いただくためのログイン画面です。</p>

            <form onSubmit={handleLogin} noValidate>
              <div className="field">
                <label htmlFor="email">メールアドレス</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="password">パスワード</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <button className="submit-button" type="submit">ログイン</button>
              {error && <p className="error-message" role="alert">{error}</p>}
            </form>

            <div className="auth-links-area">
              <p>初めての方はこちら</p>
              <Link className="link-button" to="/signup">新規会員登録</Link>
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

export default Login;
