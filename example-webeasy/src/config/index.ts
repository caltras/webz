
export default {
    port:3002,
    base_url: "",
    session:{
        enabled:true,
    },
    authentication:{
        tokenHandler:'security/token.authentication'
    },
    filter:{
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