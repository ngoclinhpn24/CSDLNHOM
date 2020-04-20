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
                        <button class="btn btn-warning btn-sm" onclick="SurveyComponent.showSurveyResult(${report.surveyId});"><i class="fa fa-eye"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="SurveyComponent.deleteSurvey(${report.surveyId});"><i class="fa fa-trash-o"></i></button>
                    </td>

                </tr>
            `;
            $('.user-reports').find('tbody').append(html);
        }
    }
}