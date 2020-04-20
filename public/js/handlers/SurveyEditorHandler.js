class SurveyEditorHandler {

    static addQuestion(data = {}) {
        let id = data.id || '';
        let type = data.type || 'Text Question';
        let content = data.content || '';

        let question = null;
        if (type == 'Single-Choice Question' || type == 'Multiple-Choice Question') {
            let choices = data.choices || [''];
            question = $(`
                <div class="question">
                    <input type="hidden" class="question-type" value="${type}">
                    <input type="hidden" class="question-id" value="${id}">

                    <div class="question-buttons float-right">
                        <button class="btn btn-success btn-sm" onclick="SurveyEditorHandler.addChoice(this)"><i class="fa fa-plus" aria-hidden="true"></i> Add choice</button>
                        <button class="btn btn-danger btn-sm" onclick="SurveyEditorHandler.deleteQuestion(this);"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </div>
                    <div class="form-group">
                        <label>${type}:</label>
                        <textarea cols="30" rows="5" class="content form-control">${content}</textarea>
                    </div>
                    <div class="question-choices">
                        <label>Choices: </label>
                    </div>
                </div>
             `);

            for (let choice of choices) {
                $(question).find('.question-choices').append(`
                    <div class="input-group mb-3">
                        <input type="text" class="choice form-control" placeholder="Input choice content" value="${choice}">
                        <div class="input-group-append">
                            <button class="btn btn-danger" onclick="SurveyEditorHandler.deleteChoice(this)"><i class="fa fa-times" aria-hidden="true"></i></button>
                        </div>
                    </div>
                `);
            }

        } else if (type == 'Text Question') {
            question = $(`
                <div class="question">
                    <input type="hidden" class="question-type" value="Text Question">
                    <input type="hidden" class="question-id" value="${id}">
                    <div class="question-buttons float-right">
                        <button class="btn btn-danger btn-sm" onclick="SurveyEditorHandler.deleteQuestion(this);"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </div>
                    <div class="form-group">
                        <label>Text Question:</label>
                        <textarea cols="30" rows="5" class="content form-control">${content}</textarea>
                    </div>
                </div>        
            `);
        }

        $(".questions-container").append(question);

    }

    static deleteQuestion(button) {
        // get parent .question of button and remove 
        let confirmDelete = confirm("Are you sure to delete this question?");
        if(confirmDelete){
            let questionId = $(button).parents('.question').find('.question-id').val();
            if(questionId){
                $.ajax({
                    url: '/question/delete/' + questionId,
                    type: 'GET',
                });
            }
            $(button).parents(".question").remove();
        }
    }

    static addChoice(button) {
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

    static deleteChoice(button) {
        $(button).parents(".input-group").remove();
    }

    static async saveSurvey(event) {
        event.preventDefault();

        let rules = {
            'id': 'nullable',
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

        if (validator.isPassed()) {
            // lấy ra câu hỏi người dùng chỉnh sửa survey questions
            let questionsData = SurveyEditorHandler.getQuestionsData();
            // gửi dữ liệu survey info & survey questions -> server
            let result = await $.post('/survey/editor', {
                surveyInfo: validator.data,
                surveyQuestions: questionsData
            });

            if (result.code == 1) {
                SurveyComponent.showOwnSurveys();
            } else {
                alert(result.message);
            }

        } else {
            // show errors
            validator.showErrors();
        }
    }

    static getQuestionsData() {

        /* 
            id
            dạng câu hỏi
            nội dung câu hỏi
            lấy ra lựa chọn (nếu câu hỏi đó thuộc dạng single choice || multiple choice)
        
        */
        let questionsData = [];

        let questions = $('.question');
        for (let question of questions) {
            let questionData = {
                id: $(question).find('.question-id').val(),
                type: $(question).find('.question-type').val(),
                content: $(question).find('.content').val()
            };

            if (questionData.type != 'Text Question') {
                questionData.choices = [];
                let choices = $(question).find('.choice');
                for (let choice of choices) {
                    questionData.choices.push($(choice).val());
                }
            }

            questionsData.push(questionData);

        }

        return questionsData;
    }
}



// static addChoiceQuestion(type, jsonData = {}) {
//     let data = JSON.parse(jsonData);
//     let id = data.id || '';
//     let content = data.content || '';
//     let choices = data.choices || [''];

//     let question = $(`
//         <div class="question">
//             <input type="hidden" class="question-type" value="${type}">
//             <input type="hidden" class="question-id" value="${id}">

//             <div class="question-buttons float-right">
//                 <button class="btn btn-success btn-sm" onclick="SurveyEditorHandler.addChoice(this)"><i class="fa fa-plus" aria-hidden="true"></i> Add choice</button>
//                 <button class="btn btn-danger btn-sm" onclick="SurveyEditorHandler.deleteQuestion(this);"><i class="fa fa-trash" aria-hidden="true"></i></button>
//             </div>
//             <div class="form-group">
//                 <label>${type}:</label>
//                 <textarea cols="30" rows="5" class="content form-control">${content}</textarea>
//             </div>
//             <div class="question-choices">
//                 <label>Choices: </label>
//             </div>
//         </div>
//     `);

//     for (let choice of choices) {
//         $(question).find('.question-choices').append(`
//             <div class="input-group mb-3">
//                 <input type="text" class="choice form-control" placeholder="Input choice content" value="${choice}">
//                 <div class="input-group-append">
//                     <button class="btn btn-danger" onclick="SurveyEditorHandler.deleteChoice(this)"><i class="fa fa-times" aria-hidden="true"></i></button>
//                 </div>
//             </div>
//         `);
//     }

//     $(".questions-container").append(html);

// }



// static addTextQuestion(jsonData = {}) {


//     let question = $(`
//         <div class="question">
//             <input type="hidden" class="question-type" value="Text Question">
//             <input type="hidden" class="question-id" value="${id}">
//             <div class="question-buttons float-right">
//                 <button class="btn btn-danger btn-sm" onclick="SurveyEditorHandler.deleteQuestion(this);"><i class="fa fa-trash" aria-hidden="true"></i></button>
//             </div>
//             <div class="form-group">
//                 <label>Text Question:</label>
//                 <textarea cols="30" rows="5" class="content form-control">${content}</textarea>
//             </div>
//         </div>        
//     `);

// }
