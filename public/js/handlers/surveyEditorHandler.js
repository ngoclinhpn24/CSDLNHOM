class SurveyEditorHandler{
    static addQuestion(questionType){
        
        let html = '';
        if(questionType == 'Single-Choice Question' || questionType == 'Multiple-Choice Question'){
            html = `
            <div class="question">
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
}