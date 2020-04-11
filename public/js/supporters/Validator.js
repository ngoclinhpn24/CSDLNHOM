class Validator {

    data = null;
    errors = [];

    static make(data, rules, messages) {
        let validator = new Validator();
        validator.data = data;
        validator.errors = [];

        for (let fieldName in rules) {
            let fieldValue = validator.data[fieldName];
            if (fieldValue == undefined) fieldValue = '';
            let rule = rules[fieldName].split('|');
            for (let requirement of rule) {
                let isPassed = true;

                if (requirement == 'required') {
                    if (Array.isArray(fieldValue) && fieldValue.length == 0) isPassed = false;
                    if (typeof fieldValue == 'string' && fieldValue.trim() == '') isPassed = false;

                } else if (requirement == 'email') {
                    isPassed = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.test(fieldValue);

                } else if (requirement == 'numeric') {
                    isPassed = !isNaN(fieldValue);

                } else if (/min:([0-9]+)/.test(requirement)) {
                    let minValue = /min:([0-9]+)/.exec(requirement)[1];
                    if (fieldValue < minValue) isPassed = false;

                } else if (/max:([0-9]+)/.test(requirement)) {
                    let maxValue = /max:([0-9]+)/.exec(requirement)[1];
                    if (fieldValue > maxValue) isPassed = false;

                } else if (/minLength:([0-9]+)/.test(requirement)) {
                    let minLength = /minLength:([0-9]+)/.exec(requirement)[1];
                    if (fieldValue.length < minLength) isPassed = false;

                } else if (/maxLength:([0-9]+)/.test(requirement)) {
                    let maxLength = /maxLength:([0-9]+)/.exec(requirement)[1];
                    if (fieldValue.length > maxLength) isPassed = false;
                } else if (/same:([a-zA-Z0-9]+)/.test(requirement)) {
                    let sameField = /same:([a-zA-Z0-9]+)/.exec(requirement)[1];
                    if (fieldValue != validator.data[sameField]) isPassed = false;
                }

                if (!isPassed) {
                    let message = messages[`${fieldName}.${requirement}`];
                    if (!message) message = `${fieldName} is invalid`;

                    validator.errors.push({
                        name: fieldName,
                        message: message
                    });
                    break;
                }

            }
        }

        return validator;
    }

    static validateForm(formSelector, rules = {}, messages = {}) {

        // get form data
        let form = $(formSelector).get(0);
        let rawData = new FormData(form);
        let data = {};
        for (let key of rawData.keys()) {
            if (data[key] != undefined) {
                if (Array.isArray(data[key])) continue;
                data[key] = rawData.getAll(key);
            } else {
                data[key] = rawData.get(key);
            }
        }

        // validate data
        let validator = Validator.make(data, rules, messages);
        validator.formSelector = formSelector;
        
        // clear all old messages
        $(formSelector).find('small.text-danger').each(function (index) {
            $(this).html('');
        });

        return validator;
    }

    showErrors() {
        // set new message
        for (let error of this.errors) {
            $(this.formSelector).find(`.${error.name}-error`).html(error.message);
        }
    }

    isPassed() {
        return (this.errors.length == 0);
    }

}



/*
data
{
name: 'a',
password: 'abcd',
favorites: ['b', 'd'];
}

rules
{
name: 'required',
email: 'required|email',
password: 'required|minLength:6',
confirmPassword: 'required|same:password'
}

messages
{
'name.required': 'Input your name',
'email.required': 'Input your email',
'email.email': 'Format email error',
'password.required': 'Input your password',
'password.minLength': 'Your password must be at least 6 characters',
'password.minLength': 'Your password must be at most 10 characters',
'confirmPassword.required': 'Input your password confirmation',
'confirmPassword.same': 'Password confirmation is not match'
}
*/

