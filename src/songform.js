{
    let view={
        el:'.page>main',
        init(){
            this.$el=$(this.el)
        },
        template:`
            <form class="form">
               <div class="row ">
                   <label for="">歌名</label>
                    <input name="name" type="text" value="__name__">
               </div> 
               <div class="row">
                    <label for="">歌手</label>
                     <input type="text" name="singer" value="__singer__">
                </div> 
                <div class="row">
                        <label for="">外链</label>
                         <input name="url" type="text" value="__url__">
                </div>
                <div class="row">
                        <label for="">封面</label>
                         <input name="cover" type="text" value="__cover__">
                </div>
                 <div class="row">
                        <label for="">歌词</label>
                        <textarea cols=100 rows=10 name="lyrics">__lyrics__</textarea>
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>  
            </form>
        `,
        render(data = {}){
            let placeholders=['name','singer','url','id','cover','lyrics']
            let html=this.template
            placeholders.map((string)=>{
                html=html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</hi>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</hi>')
            }
        },
        reset(){
            this.render({})
        }
    }
    let model={
        data:{
            name:'',singer:'',url:'',id:'',cover:'',lyrics:''
        },
        update(data){//更改歌曲信息
            var song= AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover',data.cover);
            song.set('lyrics',data.lyrics); 
            // 保存到云端
            return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            });   
        },
        create(data){
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name',data.name);
            song.set('singer',data.singer);
            song.set('url',data.url);    
            song.set('cover',data.cover); 
            song.set('lyrics',data.lyrics);       
            return song.save().then( (newSong)=> {
              let{id,attributes}=newSong
              Object.assign(this.data,{id,...attributes})
            },(error)=> {
              console.error(error);
            });
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.view.render(this.model.data)
            this.bindEvents()

            window.eventHub.on('select',(data)=>{
                this.model.data=data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data={
                        name:'',url:'',singer:'',id:'',lyrics:''
                    }
                }else{
                    Object.assign(this.model.data,data)
                }
            this.view.render(this.model.data)    
            })
        },
        create(){
            let needs='name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string]=this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
            .then(()=>{
                this.view.reset()
                let string=JSON.stringify(this.model.data)
                let object=JSON.parse(string)
                window.eventHub.emit('create',object)
            })
        },
        update(){
            let needs='name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string]=this.view.$el.find(`[name="${string}"]`).val()
            }) 
            this.model.update(data)
            .then(()=>{
                window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    this.update()    
                }else{
                    this.create()
                }          
            })
        }
    }
    controller.init(view,model)
}