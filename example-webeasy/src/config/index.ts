
export default {
    base_url: "",
    port: 3002,
    session: {
        enabled:true,
    },
    authentication: {
        tokenHandler:'security/token.authentication'
    },
    filter: {
        enabled:true,
        filters:[],
        security:{
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