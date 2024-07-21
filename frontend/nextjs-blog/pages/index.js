import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signUp, login } from '../utils/api';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await signUp(username);
      alert('User registered successfully!');
    }
    catch (error) {
      alert('Error signing up. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(username);
      if (response) {
        alert('Login successful!');
        router.push({
          pathname: '/chat',
          query: { username }
        }); // Redirect to chat page with username
      } else {
        alert('Invalid username.');
      }
    } catch (error) {
      alert('Error logging in. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title1}>
          Strapi Chat app
        </h1>
        <div className={styles.baseCard}>
          <div>Username: <input value={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignUp}>Sign up</button>
          </div>
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
