class ReportHandler{
    static async sendReport(event){
        event.preventDefault();
        let rules = {
            'surveyId': 'required',
            'message': 'required'
        };

        let messages = {
            'message.required': 'Input your report message.'
        };
        let validator = Validator.validateForm('#form-report', rules, messages);
        if(validator.isPassed()){
            let result = await $.ajax({
                url: '/report',
                type: 'POST',
                data: validator.data
            });
        } else {
            validator.showErrors();
        }
    }
}