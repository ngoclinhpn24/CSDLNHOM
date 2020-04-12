async function load(url, viewArea = '#main-content', mode = 'cover'){
    let loadingAnimation = $(`<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>`);
    $(viewArea).append(loadingAnimation);

    let response = await $.ajax({url: url,method: 'GET'});
    switch(mode){
        case 'cover':
            $(viewArea).html(response);
        break;
        case 'append':
            $(viewArea).append(response);

        break;

        case 'prepend':
            $(viewArea).prepend(response);
        break;
    }

    $(loadingAnimation).remove();
}

window.onload = function(){
    SurveyComponent.showSurveys();
}

