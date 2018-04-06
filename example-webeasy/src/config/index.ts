
export default {
    port:3002,
    base_url: "",
    authentication:{
        tokenHandler:'security/token.authentication'
    },
    filter:{
        filters:['filters/test.filter'],
        security:{
            exceptions: ['/hello']
        }
    },
    view: {
        engine: 'handlebars',
        base:"view"
    },
    error: {
        engine: 'handlebars',
    }
};