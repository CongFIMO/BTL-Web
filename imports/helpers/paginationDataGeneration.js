exports.paginationDataGeneration = function (moreMode, currentPage, numberOfPage)
{
    var pages=[];
    if (moreMode) {
        if (currentPage === 1) {
            return {
                first: {'number': 1, class: 'current-page'},
                preCurrent: {'number': 2, class: ''},
                current: {'number': 3, class: ''},
                postCurrent: {'number': 4, class: ''},
                last: {'number': numberOfPage, class: ''},
                hasPre: false,
                hasPost: true
            }
        }
        else if (currentPage === numberOfPage) {
            return {
                first: {'number': 1, class: ''},
                preCurrent: {'number': numberOfPage - 3, class: ''},
                current: {'number': numberOfPage - 2, class: ''},
                postCurrent: {'number': numberOfPage - 1, class: ''},
                last: {'number': numberOfPage, class: 'current-page'},
                hasPre: true,
                hasPost: false
            }
        }
        else if (currentPage === 2 || currentPage === 3) {
            return {
                first: {'number': 1, class: ''},
                preCurrent: {'number': 2, class: currentPage === 2 ? 'current-page' : ""},
                current: {'number': 3, class: currentPage === 3 ? 'current-page' : ""},
                postCurrent: {'number': 4, class: ''},
                last: {'number': numberOfPage, class: ''},
                hasPre: false,
                hasPost: true
            }
        }
        else if (currentPage === numberOfPage - 1 || currentPage === numberOfPage - 2) {
            return {
                first: {'number': 1, class: ''},
                preCurrent: {'number': numberOfPage - 3, class: ''},
                current: {
                    'number': numberOfPage - 2,
                    class: currentPage === numberOfPage - 2 ? 'current-page' : ""
                },
                postCurrent: {
                    'number': numberOfPage - 1,
                    class: currentPage === numberOfPage - 1 ? 'current-page' : ""
                },
                last: {'number': numberOfPage, class: ''},
                hasPre: true,
                hasPost: false
            }
        }

        return {
            first: {'number': 1, class: ''},
            preCurrent: {'number': currentPage - 1, class: ''},
            current: {'number': currentPage, class: 'current-page'},
            postCurrent: {'number': currentPage + 1, class: ''},
            last: {'number': numberOfPage, class: ''},
            hasPre: ((currentPage - 1) === 1) ? false : true,
            hasPost: ((currentPage + 1) === numberOfPage) ? false : true
        }
    }
    else {
        for (let i = 1; i <= numberOfPage; i++) {
            pages.push({'number': i, class: currentPage === i ? 'current-page' : ''});
        }
        return pages;
    }
};

