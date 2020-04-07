class SurveyEditorHandler{
    static addQuestion(questionType){
        
        let html = '';
        if(questionType == 'Single-Choice Question' || questionType == 'Multiple-Choice Question'){
            html = `
            <div class="question">
                <input type="hidden" class="question-type" value="${questionType}">
                <input type="hidden" class="question-id" value="">

                <div class="question-buttons float-right">
                    <button class="btn btn-success btn-sm" onclick="SurveyEditorHandler.addChoice(this)"><i class="fa fa-plus" aria-hidden="true"></i> Add choice</button>
                    <button class="btn btn-danger btn-sm" onclick="SurveyEditorHandler.deleteQuestion(this);"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>
                <div class="form-group">
                    <label>${questionType}:</label>
                    <textarea cols="30" rows="5" class="content form-control"></textarea>
                </div>
                <div class="question-choices">
                    <label>Choices: </label>

                    <div class="input-group mb-3">
                        <input type="text" class="choice form-control" placeholder="Input choice content">
                        <div class="input-group-append">
                            <button class="btn btn-danger" onclick="SurveyEditorHandler.deleteChoice(this)"><i class="fa fa-times" aria-hidden="true"></i></button>
                        </div>
                    </div>
                    
                </div>
            </div>
            `;
        } else if(questionType == 'Text Question') {
            html = `
            <div class="question">

                <input type="hidden" class="question-type" value="${questionType}">
                <input type="hidden" class="question-id" value="">

                <div class="question-buttons float-right">
                    <button class="btn btn-danger btn-sm" onclick="SurveyEditorHandler.deleteQuestion(this);"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>

                <div class="form-group">
                    <label>Text Question:</label>
                    <textarea cols="30" rows="5" class="content form-control"></textarea>
                </div>

            </div>
            `;
        }


        $(".questions-container").append(html);

    }

    static deleteQuestion(button){
        // get parent .question of button and remove 
        $(button).parents(".question").remove();
    }

    static addChoice(button){
        let html = `
        <div class="input-group mb-3">
            <input type="text" class="choice form-control" placeholder="Input choice content">
            <div class="input-group-append">
                <button class="btn btn-danger" onclick="SurveyEditorHandler.deleteChoice(this)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
        </div>
        `;

        $(button).parents(".question").find('.question-choices').append(html);
    }

    static deleteChoice(button){
        $(button).parents(".input-group").remove();
    }

    static async saveSurvey(event){
        event.preventDefault();

        let rules = {
            'title': 'required',
            'hashTag': 'required',
            'description': 'required'
        };

        let messages = {
            'title.required': 'Input survey title',
            'hashTag.required': 'Input survey hash tag',
            'description.required': 'Input survey description'
        };

        let validator = Validator.validateForm('.form-edit-survey', rules, messages);
        
        if(validator.isPassed()){
            // lấy ra câu hỏi người dùng chỉnh sửa survey questions
            let questionsData = SurveyEditorHandler.getQuestionsData();

            // gửi dữ liệu survey info & survey questions -> server
            let result = await $.ajax({
                url: '/survey/editor',
                method: 'POST',
                data: {
                    surveyInfo: validator.data,
                    surveyQuestions: questionsData
                }
            });

            if(result.code == 1){
                load('/survey');
            } else {
                console.log('error');
            }

        } else {
            // show errors
            validator.showErrors();
        }
    }

    static getQuestionsData(){

        /* 
            id
            dạng câu hỏi
            nội dung câu hỏi
            lấy ra lựa chọn (nếu câu hỏi đó thuộc dạng single choice || multiple choice)
        
        */
        let questionsData = [];

        let questions = $('.question');
        for(let question of questions){
            let questionData = {
                id: $(question).find('.question-id').val(),
                type: $(question).find('.question-type').val(),
                content: $(question).find('.content').val()
            };

            if(questionData.type != 'Text Question'){
                questionData.choices = [];
                let choices = $(question).find('.choice');
                for(let choice of choices){
                    questionData.choices.push($(choice).val());
                }
            }

            questionsData.push(questionData);

        }

        return questionsData;
    }
}
