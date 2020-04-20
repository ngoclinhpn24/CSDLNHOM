class ReportHandler{
    static async sendReport(event){
        event.preventDefault();
        let rules = {
            'surveyId': 'required',
            'content': 'required'
        };
        $("#report-success").html('');
        let messages = {
            'content.required': 'Input your report message.'
        };
        let validator = Validator.validateForm('#form-report', rules, messages);
        if(validator.isPassed()){
            let result = await $.post('/report', validator.data);

            if(result.code == 1){
                $("#report-success").html(result.message);
            }
            
        } else {
            validator.showErrors();
        }
    }
}
