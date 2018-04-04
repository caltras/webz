(()=>{
    var LoginModule = ()=>{
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
                self.flipper.classList.toggle('hover');
            };
        }
        beforeSubmitLogin = (form)=>{
            return form.elements.user.value 
                    && form.elements.password.value 
                    && self.passwordRole.test(form.elements.password.value);
        }
        beforeSubmitSignup = (form)=>{
            return form.elements.user.value 
                    && form.elements.name.value
                    && self.confirmPassword(form.elements.password.value,form.elements.conf_password.value) 
                    && self.passwordRole.test(form.elements.password.value);
        }
        
        confirmPassword = (password, confirmation)=>{
            return password === confirmation;
        }
        onInit = ()=>{
            self.addEvents();
        }
        return self;
    };
    LoginModule().onInit();
})();