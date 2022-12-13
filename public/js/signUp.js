let signUpForm = document.getElementById('registration-form');
let nameInput = document.getElementById('nameInput')
let ageInput = document.getElementById('ageInput')
let usernameInput = document.getElementById('usernameInput');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');
let errorDiv = document.getElementById('error');

if(signUpForm){
    errorDiv.hidden = true;
    signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(!nameInput.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter name';
        return false
    }
    if(!ageInput.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter age';
        return false
    }
    if(!usernameInput.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter username';
        return false
    }
    if(!emailInput.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter email';
        return false
    }
    if(!passwordInput.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter password';
        return false
    } 


    if(nameInput.value.trim().length < 3) {
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Name should have more than 3 characters';
        return false
    }

    if(isNaN(ageInput.value)){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'age should be a number';
        return false
    }

    if(ageInput.value< 9){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'age should be more than 9 years';
        return false
    }

    let ageConstraints = /^[0-9]+$/;

    if(!ageInput.value.match(ageConstraints)){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'age can only have integer values';
        return false
    }

    let emailConstraints = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/
    if(!emailInput.value.match(emailConstraints)){
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'please enter a valid email';
        return false
    } 

    event.target.submit()

});
}