((messageModule)=>{
    var LoginComponent = ()=>{
        var self = this;
        self.btnSignup = document.getElementsByClassName('btn-signup')[0];
        self.btnCancel = document.getElementsByClassName('btn-cancel')[0];
        self.flipper = document.getElementsByClassName('flip-container')[0];
        self.loginForm = document.getElementById('loginForm');
        self.signupForm = document.getElementById('signupForm');
        self.passwordRole = /.+/;

        addEvents = ()=>{
            self.loginForm.addEventListener('submit',(e)=>{
                if(!self.beforeSubmitLogin(self.loginForm)){
                    e.preventDefault();
                }
            },false);
            self.signupForm.addEventListener('submit',(e)=>{
                if(!self.beforeSubmitSignup(self.signupForm)){
                    e.preventDefault();
                }
            },false);
            self.btnSignup.onclick= (event)=>{
                self.flipper.classList.toggle('hover');
            };
            self.btnCancel.onclick= (event)=>{
                self.signupForm.reset();
                self.flipper.classList.toggle('hover');
            };
        }
        beforeSubmitLogin = (form)=>{
            var isValid = true;
            if(!form.elements.user.value){
                isValid = false;
                messageModule.messageComponent.error('User is required!');
            }
            if(!self.passwordRole.test(form.elements.password.value)){
                isValid = false;
                messageModule.messageComponent.error('The password is invalid!');
            }
            if(isValid){
                messageModule.messageComponent.info('Let\'s Go!');
            }
            return isValid;
        }
        beforeSubmitSignup = (form)=>{
            var isValid = true;
            if(!form.elements.user.value){
                isValid = false;
                messageModule.messageComponent.error('User is required!');
            }
            if(!form.elements.name.value){
                isValid = false;
                messageModule.messageComponent.error('Name is required!');
            }
            if(!self.confirmPassword(form.elements.password.value,form.elements.conf_password.value)){
                isValid = false;
                messageModule.messageComponent.error('The password is different to confirmation!');
            }
            if(!self.passwordRole.test(form.elements.password.value)){
                isValid = false;
                messageModule.messageComponent.error('The password is invalid!');
            }
            if(isValid){
                messageModule.messageComponent.info('Let\'s Go!');
            }
            return isValid;
        }
        
        confirmPassword = (password, confirmation)=>{
            return password === confirmation;
        }
        return self;
    }
    var LoginModule = (loginComponent)=>{
        onInit = ()=>{
            loginComponent.addEvents();
            return this;
        } 
        return this;
    };
    LoginModule(LoginComponent()).onInit();
})(window.MessageModule);