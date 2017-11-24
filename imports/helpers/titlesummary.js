exports.titleSummary = function (html)
{
    let limited = 32;
    let text = jQuery("<p>"+ html+"</p>"
        // .slice(openP+3, closeP)
    ).text();
    let result = text.substring(0, limited);
    if (result!== text){
        result = result+"...";
    }
    return result;
};
