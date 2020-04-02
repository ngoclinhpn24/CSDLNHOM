async function signIn(event) {
    event.preventDefault();

    let signInData = $('.form-sign-in').serializeArray();

    let message = '';
    for (let field of signInData) {
        if (!field.value.trim()) {
            message += `${field.name} is invalid! \n`.toUpperCase();
        }
    }

    if (message) {
        alert(message);
    } else {

        // send request & receive response
        let result = await $.ajax({
            url: 'user/sign_in',
            method: 'POST',
            data: signInData
        });

        // check result
        if(result.length > 0){
            alert('Sign In Successfully');
        } else {
            alert('Your email or password is incorrect');
        }
    }

}

async function signUp(event) {
    event.preventDefault();

    let signUpData = $('.form-sign-up').serializeArray();

    let message = '';
    // check is field empty
    for (let field of signUpData) {
        if (!field.value.trim()) {
            message += `${field.name} is invalid! \n`.toUpperCase();
        }
    }

    // check password & confirmPassword
    if(signUpData[2].value != signUpData[3].value){
        message = 'PASSWORD CONFIRMATION IS NOT MATCH!';
    }

    if (message) {
        alert(message);
    } else {
        
        // send request & receive response
        let result = await $.ajax({
            url: 'user/sign_up',
            method: 'POST',
            data: signUpData
        });

        // check result
        alert(result);

    }

}

