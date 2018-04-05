
export default {
    port:3002,
    base_url: "",
    authentication:{
        tokenHandler:'security/token.authentication'
    },
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