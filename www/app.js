// FirebaseのSDKをインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, connectAuthEmulator, sendPasswordResetEmail, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebaseの設定
const firebaseConfig = {

};

// Firebaseの初期化
initializeApp(firebaseConfig);

// Authenticationのインスタンスを取得
const auth = getAuth();
auth.languageCode = 'ja'; // パスワードリセットメールやパスワードリセット画面の言語設定
// connectAuthEmulator(auth, "http://127.0.0.1:9099"); // Emulatorを起動する場合、コメントを外す

// ログイン状態が変わった時に実行される処理
onAuthStateChanged(auth, (user) => {
    renderLoginStatus(user);
});

// ログイン状態を画面に反映させる関数
const renderLoginStatus = (user) => {
    const loginStatus = document.getElementById("loginStatus");
    let html = `<p>未ログイン</p>`;
    if (user) {
        html = `
            <p>ログイン中</p>
            <p>ユーザー名：${user.displayName}</p>
            <p>メールアドレス：${user.email}</p>
            <p>ユーザーID：${user.uid}</p>
            <button class="button" id="logoutButton">ログアウト</button>
        `;
    }
    loginStatus.innerHTML = html;
    document.getElementById('logoutButton').addEventListener('click', onClickLogout);
}

// パスワード再設定メールを送信ボタンがクリックされたときの処理
const onClickSendPasswordResetEmail = () => {
    const email = document.getElementById("emailForPasswordReset").value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("パスワードリセットメールを送信しました");
        })
        .catch((error) => {
            alert("パスワードリセットメールを送信に失敗しました");
            console.error(error);
        });
};

// ログインボタンがクリックされたときの処理
const onClickLogin = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // ログイン成功
            alert("ログインしました");
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            alert("ログインエラーです");
            console.error(error);
        });
};

// ログアウトボタンがクリックされたときの処理
const onClickLogout = () => {
    signOut(auth).then(() => {
        alert("ログアウトしました");
    }).catch((error) => {
        console.error(error);
    });
};

export { onClickSendPasswordResetEmail, onClickLogin };
