
export default {
    port:3002,
    base_url: "",
    filter:{
        exceptions:['/hello/'],
        filters:['filters/test.filter']
    },
    view: {
        engine: 'handlebars',
        base:"view"
    },
    error: {
        engine: 'handlebars',
    }
};