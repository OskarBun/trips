import 'firebase';
import VueFire from 'app/adapters/vue_adapter';

class User extends VueFire {
    constructor(url){
        super({
            data: function(){
                return {
                    username: null,
                    profile_image: null,
                    logged_in: false,
                    color: null
                }
            }
        }, url);
    }
}

export default User;
