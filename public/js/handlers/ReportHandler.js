class ReportHandler{
    static async sendReport(event){
        event.preventDefault();
        let rules = {
            'surveyId': 'required',
            'content': 'required'
        };

        let messages = {
            'content.required': 'Input your report message.'
        };
        let validator = Validator.validateForm('#form-report', rules, messages);
        if(validator.isPassed()){
            let result = await $.post('/report', validator.data);

            console.log(result);
        } else {
            validator.showErrors();
        }
    }
}
