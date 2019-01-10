window.eventHub={
    events:{
        //晚报:[],
        //时报:[]
    },
    once(eventName,callback){
        function arr(...argments){
            callback(...argments)
            window.eventHub.remove(eventName,callback)
        }
        arr.cc=callback
        this.on(eventName,arr)
    },
    remove(eventName,callback){
        if(this.events[eventName]){
            this.events[eventName]=this.events[eventName]
            .filter((fn)=>{
                return fn!=callback&&fn.cc!=callback
            })
        }
    },


    emit(eventName,data){   //发布
        for(let key in this.events){
            if(key === eventName){
                let fnList=this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data)                  
                })
            }
        }
    },
    on(eventName,fn){   //订阅
        if(this.events[eventName]===undefined){
            this.events[eventName]=[]
        }
        this.events[eventName].push(fn)
    }
}