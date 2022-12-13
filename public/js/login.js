let loginForm = document.getElementById('login-form');
let usernameInput = document.getElementById('usernameInput');
let passwordInput = document.getElementById('passwordInput');
let errorDiv = document.getElementById('error');


if(loginForm){
    errorDiv.hidden = true;
    loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if(!usernameInput.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter username';
        return false
    }
    if(!passwordInput.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter password';
        return false
    }

    usernameInput.value = usernameInput.value.toLowerCase();

    let usernameConstraints = /^[A-Za-z0-9]+$/;
    if(!usernameInput.value.match(usernameConstraints)){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Username can only contain alpha numeric values';
        return false
    }

    if(usernameInput.value.trim().length < 4) {
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Username should have more than 4 characters';
        return false
    }

    if(/\s/.test(usernameInput.value)){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Username cannot have empty spaces';
        return false
    }

    if(passwordInput.trim().length < 6){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'password can not be less than 6 characters';
        return false
    }

    let passwordConstaints = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?-]{6,}$/

    if(!passwordInput.value.match(passwordConstaints)){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'password should contain atleast an uppercase letter, a special character and a number and should be minimum 6 characters long(client side))';
        return false
    }

    });
}else{
    errorDiv.hidden = false;
    errorDiv.innerHTML = 'Unable to fetch login';
  }