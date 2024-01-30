// FirebaseのSDKをインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, connectAuthEmulator, sendPasswordResetEmail, signInWithEmailAndPassword, onAuthStateChanged, signOut, initializeAuth, browserLocalPersistence, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebaseの設定
const firebaseConfig = {
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// iOSを判定する関数
const isIos = () => {
    const userAgent = navigator.userAgent;
    return /iPad|iPhone|iPod/i.test(userAgent);
}

// Authenticationのインスタンスを取得
let auth;
if (isIos()) {
    auth = initializeAuth(app, {
        persistence: browserLocalPersistence,
    })
} else {
    auth = getAuth(app);
}
auth.languageCode = "ja"; // パスワードリセットメールやパスワードリセット画面の言語設定
// connectAuthEmulator(auth, "http://127.0.0.1:9099"); // Emulatorを起動する場合、コメントを外す

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

// ログインボタンがクリックされたときの処理
const onClickLoginWithUserName = () => {
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("passwordForUserName").value;

    // emailは画面上では利用しないが、ログインで利用するために userName + 任意のドメイン形式で保存する。
    // 「example.com」部分はアプリケーションに応じて変更する。ユーザーデータの移行は https://github.com/monaca-samples/authentication-migration の importWithUserName.jsを参照。
    const email = `${userName}@example.com`;
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

// パスワード変更ボタンがクリックされたときの処理
const onClickPasswordChange = () => {
    const newPassword = document.getElementById("newPassword").value;
    updatePassword(auth.currentUser, newPassword).then(() => {
        alert("パスワードを変更しました");
    }).catch((error) => {
        console.error(error);
    });
};

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
            <hr>
            <div>
              <h2>パスワード変更</h2>
              <input type="password" id="newPassword" placeholder="新しいパスワード" />
              <button class="button" id="passwordChangeButton">パスワード変更ボタン</button>
            </div>
        `;
    }
    loginStatus.innerHTML = html;
    if (user) {
        document.getElementById("logoutButton").addEventListener("click", onClickLogout);
        document.getElementById("passwordChangeButton").addEventListener("click", onClickPasswordChange);
    }
}

// ログアウトボタンがクリックされたときの処理
const onClickLogout = () => {
    signOut(auth).then(() => {
        alert("ログアウトしました");
    }).catch((error) => {
        console.error(error);
    });
};

export { onClickSendPasswordResetEmail, onClickLogin, onClickLoginWithUserName };
