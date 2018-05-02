((messages)=>{
    var MessageComponent = (msg)=>{
        var self = this;
        self.messages = msg || [];
        createMessages = ()=>{
            var fragment = document.createDocumentFragment();
            self.messages.forEach((item)=>{
                var divFragment = document.createElement('div');
                var classList = item.error ? 'error': '';
                classList = item.info ? 'info': classList;
                classList = item.success ? 'success': classList;
                divFragment.classList.add('message','fadeInUp','animated',classList);
                divFragment.innerText = item.message;
                fragment.appendChild(divFragment);
                var interval = setInterval(()=>{
                    divFragment.classList.remove('fadeInUp');
                    divFragment.classList.add('fadeOutUp');
                    setTimeout(()=>{
                        divFragment.remove();
                    },1000);
                    window.clearInterval(interval);
                },5000);
            });
            self.messages = [];
            document.getElementsByClassName('message-wrapper')[0].appendChild(fragment);
            
        }
        error = (message)=>{
            self.messages.push({error:true,message:message});
            self.createMessages();
        }
        info = (message)=>{
            self.messages.push({info:true,message:message});
            self.createMessages();
        }
        success = (message)=>{
            self.messages.push({success:true,message:message});
            self.createMessages();
        }
        return self;
    };
    var MessageModule = (messageComponent)=>{
        this.messageComponent = messageComponent;
        onInit = ()=>{
            this.messageComponent.createMessages();
            return this;
        }
        return this;
    };
    window.MessageModule = MessageModule(MessageComponent(messages)).onInit();
})(window.messages);