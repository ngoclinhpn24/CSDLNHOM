class AuthHandler {
    static async signIn(event) {
        event.preventDefault();
        let rules = {
            email: 'required',
            password: 'required'
        };

        let messages = {
            'email.required': 'Input your email',
            'password.required': 'Input your password'
        };
        let validator = Validator.validateForm('.form-sign-in', rules, messages);

        if(validator.isPassed()){
            let result = await $.ajax({
                url: 'user/sign_in',
                method: 'POST',
                data: validator.data
            });

            if(result.code == 1){
                window.location = '/';
            } else {
                $('.form-sign-in').find('.sign-in-error').html(result.message);
            }
        } else {
            validator.showErrors();
        }
    
    }
    
    static async signUp(event) {
        event.preventDefault();
    
        let rules = {
            'name': 'required',
            'email': 'required',
            'password': 'required|minLength:5',
            'confirmPassword': 'required|same:password'
        };

        let messages = {
            'name.required': 'Input your name',
            'email.required': 'Input your email',
            'email.email': 'Email format is incorrect',
            'password.required': 'Input your password',
            'password.minLength:5': 'Your password must be at least 5 characters',
            'confirmPassword.required': 'Input password confirmation',
            'confirmPassword.same:password': 'Your password confirmation is not match'
        };

        let validator = Validator.validateForm('.form-sign-up', rules, messages);
        if(validator.isPassed()){
            let result = await $.ajax({
                url: 'user/sign_up',
                method: 'POST',
                data: validator.data
            });

            if(result.code == 1){
                $('.form-sign-up').find('.sign-up-success').html(result.message);
            } else {
                $('.form-sign-up').find('.sign-up-error').html(result.message);
            }
        } else {
            validator.showErrors();
        }
    }

}    

