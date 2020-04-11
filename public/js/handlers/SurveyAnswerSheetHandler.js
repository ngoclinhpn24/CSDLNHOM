class SurveyAnswerSheetHandler {
    static async saveAnswers(event){
        event.preventDefault();
        let surveyId = $('.survey-answer-form').find('.survey-id').val();
        let validator = Validator.validateForm('.survey-answer-form');
        let result = await $.ajax({
            url: 'survey/answer/' + surveyId,
            type: 'POST',
            data: validator.data
        });

        if(result.code == 1){
            $(".answer-sheet-message").html(`<div class="alert alert-success mt-3">${result.message}</div>`);
        } else {
            $(".answer-sheet-message").html(`<div class="alert alert-danger mt-3">${result.message}</div>`);
        }

        $(".answer-sheet-message").find('.alert').fadeOut(3000, function(){
            $(this).remove();
        });
    }
}