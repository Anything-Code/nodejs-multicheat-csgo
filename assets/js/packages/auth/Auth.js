export default function (Vue) {

    Vue.auth = {
        
        refreshToken () {
            axios.get('api/auth/refresh',
            { headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.getToken() } }
            ).then (
                (response) => {
                    const   token = response.data.access_token,
                            base64URL = token.split('.')[1],
                            base64 = base64URL.replace('-', '+').replace('_', '/'),
                            decodedToken = JSON.parse(window.atob(base64));
                    //console.log(decodedToken);
                    console.log('neues Token');
                    this.setToken(token, decodedToken.exp);
                }
            ).catch (
                (error) => {
                    console.log(error);
                }
            );
        },

        setToken(token, expiration) {
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expiration);
        },

        getToken () {
            let token = localStorage.getItem('token'),
                expiration = localStorage.getItem('expiration');

            if (!token || !expiration) return null;

            if ((Date.now() / 1000) > parseInt(expiration)) {
                this.destroyToken();
                return null;
            } else {
                return token;
            }
        },

        destroyToken () {
            localStorage.removeItem('token');
            localStorage.removeItem('expiration')
        },

        isAuthenticated () {
            if (this.getToken()) {
                return true;
            } else {
                return false;
            }
        },

        halfWay () {
            if ( parseInt((localStorage.getItem('expiration') - (Date.now() / 1000)) / 60) < 30 ) {
                return true;
            } else {
                return false;
            }
        }

    }

    Object.defineProperties(Vue.prototype, {
        $auth: {
            get() {
                return Vue.auth;
            }
        }
    });

}