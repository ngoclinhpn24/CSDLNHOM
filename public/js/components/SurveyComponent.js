class SurveyComponent {
    static surveyIndex = `<div class="surveys-container mt-3 d-flex justify-content-between flex-wrap"></div>`;

    static surveyEditor = `
    <div class="survey-editor">
        <div class="survey-info">
            <h3>Survey Info</h3>
            <form class="form form-edit-survey" onsubmit="SurveyEditorHandler.saveSurvey(event)">
                <input type="hidden" name="id" value="">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="title">Title:</label>
                            <input type="text" name="title" id="title" class="form-control form-control-sm">
                            <small class="title-error text-danger"></small>
                        </div>
                        <div class="form-group">
                            <label for="hash-tag">Hash Tag:</label>
                            <input type="text" name="hashTag" id="hash-tag" class="form-control form-control-sm">
                            <small class="hashTag-error text-danger"></small>
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label for="description">Description:</label>
                            <textarea name="description" id="description" cols="30" rows="5" class="form-control form-control-sm"></textarea>
                            <small class="description-error text-danger"></small>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary">Submit</button>
            </form>
        </div>

        <div class="survey-questions">
            <h3>Survey Questions</h3>

            <div class="questions-container"></div>

            <button class="btn btn-success" onclick="SurveyEditorHandler.addQuestion({type: 'Single-Choice Question'});"><i class="fa fa-plus" aria-hidden="true"></i> Add Single-Choice Question</button>
            <button class="btn btn-secondary" onclick="SurveyEditorHandler.addQuestion({type: 'Multiple-Choice Question'})"><i class="fa fa-plus" aria-hidden="true"></i> Add Multiple-Choice Question</button>
            <button class="btn btn-info" onclick="SurveyEditorHandler.addQuestion({type: 'Text Question'})"><i class="fa fa-plus" aria-hidden="true"></i> Add Text Question</button>
        </div>

    </div>
    `;

    static surveyAnswerSheet = `
    <div class="survey-answer-sheet">
        <div class="survey-info">
            <div class="survey-options float-right">
                <a href="#" class="text-dark btn-show-result"><i class="fa fa-pie-chart" aria-hidden="true"></i>Result</a>
            </div>

            <h3 class="survey-title">This is survey title</h3>
            <hr>
            <div class="survey-description"></div>
            <div class="survey-details row">
                <div class="col">
                    <span class="survey-hash-tag text-success" style="padding: 0;"><i class="fa fa-hashtag" aria-hidden="true"></i> </span>
                    <br>
                    <span class="survey-vote-number text-danger"><i class="fa fa-eye" aria-hidden="true"></i> </span>
                </div>

                <div class="col">
                    <span class="survey-author text-secondary"><i class="fa fa-address-book"></i> </span>
                    <br>
                    <span class="survey-date-modified text-secondary"><i class="fa fa-calendar" aria-hidden="true"></i> </span>
                </div>
            </div>
        </div>

        <form method="POST" onsubmit="SurveyAnswerSheetHandler.saveAnswers(event)" class="survey-answer-form">
            <h3>Enter your answers: </h3>
            <div class="questions-container"></div>
            <button class="btn btn-success">Submit</button>
            <div class="answer-sheet-message"></div>
        </form>
    </div>    
    `;

    static surveyResult = `
    <div class="survey-result">

        <div class="survey-info">

            <div class="survey-options float-right">
                <a href="#" class="text-dark" data-toggle="modal" data-target="#form-report" onclick="return false;"><i class="fa fa-frown-o" aria-hidden="true"></i> Report</a>

                <form class="modal" method="POST" onsubmit="ReportHandler.sendReport(event)" id="form-report">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Report this survey</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <input type="hidden" name="surveyId" value="">
                                <textarea name="content" rows="10" class="form-control" placeholder="Enter your message"></textarea>
                                <small class="text-danger content-error"></small>
                                <small class="text-success" id="report-success"></small>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>

            <h3 class="survey-title">This is survey title</h3>
            <hr>
            <div class="survey-description"></div>
            <div class="survey-details row">
                <div class="col">
                    <span class="survey-hash-tag text-success" style="padding: 0;"><i class="fa fa-hashtag" aria-hidden="true"></i> </span>
                    <br>
                    <span class="survey-vote-number text-danger"><i class="fa fa-eye" aria-hidden="true"></i> </span>
                </div>

                <div class="col">
                    <span class="survey-author text-secondary"><i class="fa fa-address-book"></i> </span>
                    <br>
                    <span class="survey-date-modified text-secondary"><i class="fa fa-calendar" aria-hidden="true"></i> </span>
                </div>
            </div>

        </div>

        <div class="survey-statistic"></div>

    </div>
    `;

    static async showSurveys() {
        $("#main-content").html(this.surveyIndex);
        let surveys = await $.get('/survey');
        for (let survey of surveys) {
            $('.surveys-container').append(`
                <div class="survey-container">
                    <div class="survey-options text-right">
                        <a href="#" class="text-dark" onclick="SurveyComponent.showSurveyResult(${survey.id}); return false;"><i class="fa fa-pie-chart"></i> Result</a>
                    </div>
            
                    <div class="survey-title text-primary">
                        <h4><a href="#" onclick="SurveyComponent.showSurveyAnswerSheet(${survey.id}); return false;"> ${survey.title} </a></h4>
                    </div>
                    <div class="survey-hash-tag text-success"><i class="fa fa-slack"></i> ${survey.hashTag}</div>
                    <div class="survey-vote-info text-danger"><i class="fa fa-star"></i> ${survey.voteNumber} votes</div>
                    <div class="survey-author text-secondary"><i class="fa fa-address-book"></i> ${survey.ownerId} </div>
                    <div class="survey-date-modified text-secondary">
                        <i class="fa fa-calendar"></i> ${new Date(survey.dateModified).toLocaleString()}
                    </div>
                </div>`);
        }
    }

    static async showOwnSurveys(){
        $('#main-content').html(this.surveyIndex);
        let surveys = await $.get('/survey/management');
        for (let survey of surveys) {
            $('.surveys-container').append(`
                <div class="survey-container">
                    <div class="survey-options text-right">
                        <a href="#" class="text-dark" onclick="SurveyComponent.showSurveyEditor(${survey.id}); return false;"><i class="fa fa-pencil-square"></i> Editor</a>
                        &nbsp;&nbsp;
                        <a href="#" class="text-dark" onclick="SurveyComponent.showSurveyResult(${survey.id}); return false;"><i class="fa fa-pie-chart"></i> Result</a>
                    </div>
            
                    <div class="survey-title text-primary">
                        <h4><a href="#" onclick="SurveyComponent.showSurveyAnswerSheet(${survey.id}); return false;"> ${survey.title} </a></h4>
                    </div>
                    <div class="survey-hash-tag text-success"><i class="fa fa-slack"></i> ${survey.hashTag}</div>
                    <div class="survey-vote-info text-danger"><i class="fa fa-star"></i> ${survey.voteNumber} votes</div>
                    <div class="survey-date-modified text-secondary">
                        <i class="fa fa-calendar"></i> ${new Date(survey.dateModified).toLocaleString()}
                    </div>
                </div>`);
        }        
    }

    static async showSurveyEditor(surveyId = ''){
        $("#main-content").html(this.surveyEditor);

        if(surveyId){
            $('.survey-editor').append(`
                <div class="danger-zone">
                    <button class="btn btn-danger btn-sm" onclick="SurveyEditorHandler.deleteSurvey(${surveyId})"><i class="fa fa-trash-o"></i> Remove thi survey</button>
                </div>
            `);
        }

        let data = await $.get('/survey/editor/' + surveyId);

        let survey = data.survey;
        $(".form-edit-survey").find("[name='id']").val(survey.id);
        $(".form-edit-survey").find("[name='title']").val(survey.title);
        $(".form-edit-survey").find("[name='hashTag']").val(survey.hashTag);
        $(".form-edit-survey").find("[name='description']").val(survey.description);

        let questions = data.questions;
        questions.forEach(function(question){
            SurveyEditorHandler.addQuestion(question);
        });
    }

    static async showSurveyAnswerSheet(surveyId){
        if(!surveyId) return;

        $("#main-content").html(this.surveyAnswerSheet);

        $(".btn-show-result").click(function(){
            SurveyComponent.showSurveyResult(surveyId);
        });

        let data = await $.get('/survey/answer/' + surveyId);
        
        let survey = data.survey;
        if(!survey){
            $("#main-content").html('<h1>Sign in to answer this survey.</h1>');
            return;
        }

        $(".survey-info").find('.survey-title').html(survey.title);
        $(".survey-info").find('.survey-description').html(survey.description);
        $(".survey-info").find('.survey-hash-tag').append(survey.hashTag);
        $(".survey-info").find('.survey-vote-number').append(survey.voteNumber);
        $(".survey-info").find('.survey-author').append(survey.ownerId);
        $(".survey-info").find('.survey-date-modified').append(new Date(survey.dateModified).toLocaleString() );

        let questions = data.questions;
        questions.forEach(function(question){
            let questionData = question.data;
            let questionHTML = `
            <div class="question">
                <h5 class="question-content">${questionData.content}</h5>
            `;

            if(questionData.type == 'Text Question'){
                questionHTML += `<textarea name="question-${question.id}" cols="30" rows="4" class="form-control">${question.answer}</textarea>`;
            } else {
                let inputType = (questionData.type == 'Single-Choice Question') ? 'radio' : 'checkbox';
                let answer = question.answer.split(',');
                questionData.choices.forEach(function(choice, index){
                    let found = answer.findIndex(function(item){
                        return item == index;
                    });
                    let checked = (found >= 0) ? 'checked' : '';
                    questionHTML += `
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <input type="${inputType}" name="question-${question.id}" value="${index}"  ${checked}>
                            </div>
                        </div>
                        <input type="text" class="form-control bg-light" disabled value="${choice}">
                    </div>
                    `;
                });
            }

            questionHTML += '</div>';
            $('.questions-container').append(questionHTML);
        });
    }

    static async showSurveyResult(surveyId, viewArea = '#main-content'){
        if(!surveyId) return;

        $(viewArea).html(this.surveyResult);
        let data = await $.get('/survey/result/' + surveyId);
        
        let survey = data.survey;
        if(!survey){
            $("#main-content").html('<h1>Sign in to answer this survey.</h1>');
            return;
        }
        
        $(".survey-info").find('.survey-title').html(survey.title);
        $(".survey-info").find('.survey-description').html(survey.description);
        $(".survey-info").find('.survey-hash-tag').append(survey.hashTag);
        $(".survey-info").find('.survey-vote-number').append(survey.voteNumber);
        $(".survey-info").find('.survey-author').append(survey.ownerId);
        $(".survey-info").find('.survey-date-modified').append(new Date(survey.dateModified).toLocaleString() );

        $("#form-report").find("[name='surveyId']").val(survey.id);

        // show result of each question
        let questions = data.questions;
        questions.forEach(function(question){
            let questionNode = $(`
                <div class="question">
                    <h5 class="question-content">${question.content}</h5>
                </div>
            `);

            if(question.type == 'Text Question'){
                let html = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Content</th>
                            <th>Date Modified</th>
                        </tr>
                    </thead>
                    <tbody>`;

                question.answers.forEach((answer) => {
                    html += `
                        <tr>
                            <td>${answer.content}</td>
                            <td>${ new Date(answer.dateModified).toLocaleString() }</td>
                        </tr>
                    `;
                });

                html += `
                    </tbody>
                </table>`;
                $(questionNode).append(html);

            } else {
                $(questionNode).append(`<canvas id="question-${question.id}"></canvas>`);
            }

            $('.survey-statistic').append(questionNode);
        });

        questions.forEach(function(question){
            if(question.type == 'Text Question') return;
            let ctx = document.getElementById("question-"+question.id);
            let myChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: question.choices,
                    datasets: [{
                        backgroundColor: 'rgba(91, 148, 244, 0.5)',
                        borderColor: 'rgb(91, 148, 244)',
                        borderWidth: 2,
                        label: '# of votes',
                        data: question.answers
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        });
    }

    static async searchSurveys(event){
        event.preventDefault();
        let keyword = $("#form-search-surveys").find("#keyword").val().trim();
        if(keyword == ''){
            alert('Input your keyword to search');
            return;
        }

        let surveys = await $.post('/survey/search', {keyword: keyword});
        $('#main-content').html(this.surveyIndex);
        $('#main-content').prepend(`<h3>Search for <i>${keyword}</i>: ${surveys.length} results</h3>`);
        
        for (let survey of surveys) {
            $('.surveys-container').append(`
                <div class="survey-container">
                    <div class="survey-options text-right">
                        <a href="#" class="text-dark" onclick="SurveyComponent.showSurveyResult(${survey.id}); return false;"><i class="fa fa-pie-chart"></i> Result</a>
                    </div>
            
                    <div class="survey-title text-primary">
                        <h4><a href="#" onclick="SurveyComponent.showSurveyAnswerSheet(${survey.id}); return false;"> ${survey.title} </a></h4>
                    </div>
                    <div class="survey-hash-tag text-success"><i class="fa fa-slack"></i> ${survey.hashTag}</div>
                    <div class="survey-vote-info text-danger"><i class="fa fa-star"></i> ${survey.voteNumber} votes</div>
                    <div class="survey-author text-secondary"><i class="fa fa-address-book"></i> ${survey.ownerId} </div>
                    <div class="survey-date-modified text-secondary">
                        <i class="fa fa-calendar"></i> ${new Date(survey.dateModified).toLocaleString()}
                    </div>
                </div>`);
        }        

    }

    static async deleteSurvey(surveyId){
        if(!surveyId) return;

        let myConfirm = confirm('Are you sure to delete this survey?');

        if(!myConfirm) return;

        let result = await $.ajax({
            url: 'survey/delete/' + surveyId,
            type: 'DELETE'
        });

        if(result.code == 1){
            ReportComponent.showReports();
        }

        
    }
}