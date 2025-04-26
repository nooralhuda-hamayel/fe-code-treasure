function Config() {
    console.log(process.env.NODE_ENV)
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                port: 3000,
                be_server: 'http://localhost:5000'
            };
        case 'production':
            return {
                port: 443,
                be_server: 'https://be-code-treasure.onrender.com'
            };
        default:
            return {};
    }
};

export default Config();