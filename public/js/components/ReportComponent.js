class ReportComponent{
    static index = `
    <div class="p-10 bg-light">
        <table class="table user-reports">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Survey</th>
                    <th>Content</th>
                    <th>Date Modified</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            
            </tbody>
        </table>
    </div>

    <div class="modal" id="survey-preview">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Survey Preview</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body" id="survey-preview-result">
                
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>

            </div>
        </div>
    </div>

    `;

    static async showReports(){
        $("#main-content").html(this.index);
        let reports = await $.get('/report');
        for(let report of reports){
            let html = `
                <tr>
                    <td>${report.ownerId}</td>
                    <td>${report.surveyTitle}</td>
                    <td>${report.content}</td>
                    <td>${report.dateModified}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#survey-preview" onclick="SurveyComponent.showSurveyResult(${report.surveyId}, '#survey-preview-result');"><i class="fa fa-eye"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="SurveyComponent.deleteSurvey(${report.surveyId});"><i class="fa fa-trash-o"></i></button>
                    </td>

                </tr>
            `;
            $('.user-reports').find('tbody').append(html);
        }
    }
}