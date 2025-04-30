const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;
}

const LoginWindow = (props) => {
    return (
        <div className="loginContainer">
            <img className="formLogo" src="/assets/img/logo.png" alt="logo placeholder" />

            <form
                id="loginForm"
                name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="loginForm"
            >
                <input id="user" type="text" name="username" placeholder="username" />
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input className="formSubmit" type="submit" value="sign in" />
            </form>
        </div>
    );
};

const SignupWindow = (props) => {
    return (
        <div className="signupContainer">
            <img className="formLogo" src="/assets/img/logo.png" alt="logo placeholder" />

            <form id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
                className="signupForm"
            >
                <input id="user" type="text" name="username" placeholder="username" />

                <input id="pass" type="password" name="pass" placeholder="password" />

                <input id="pass2" type="password" name="pass2" placeholder="retype password" />

                <input className="formSubmit" type="submit" value="sign up" />
            </form>
        </div>
    );
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });

    root.render(<LoginWindow />);
};

window.onload = init;