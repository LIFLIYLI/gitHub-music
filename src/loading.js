{
    let view={
        el:'#siteloading',
        show(){
            $(this.el).addClass('active')
            console.log('开始渲染')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let controller={
        init(){
            this.view=view
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('beforUpload',()=>{
                this.view.show()
                console.log('收到事件通知渲染')
            })
            window.eventHub.on('afterUpload',()=>{
                this.view.hide()
            })
        }
    }
    controller.init(view)
}