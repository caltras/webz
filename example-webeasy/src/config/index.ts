
export default {
    port:3002,
    base_url: "",
    filters:[
        'filters/test.filter'
    ],
    view: {
        engine: 'handlebars',
        base:"view"
    },
    error: {
        engine: 'handlebars',
        //"404": '../node_modules/webeasy/view/error/404.page.html'
    }
};