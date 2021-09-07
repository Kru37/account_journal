//storage cntrl
const StorageCntrl = (function(){
    return{
     addtoStorage:function(item){
         let items;
         if(localStorage.getItem('items') === null){
             items = []
         }else{
             items = JSON.parse(localStorage.getItem('items'))
         }
         items.push(item)
         localStorage.setItem('items',JSON.stringify(items))
     },
     getfromlocalstrorage:function(){
          let items;
         if(localStorage.getItem('items') === null){
             items = []
         }else{
             items = JSON.parse(localStorage.getItem('items'))
         }
         return items
     },
     clearStorage:function(){
         localStorage.removeItem('items');
     },
     updatestoragedata:function(newitem){
         let items;
         if(localStorage.getItem('items') === null){
             items = []
         }else{
             items = JSON.parse(localStorage.getItem('items'))
         }
         let currIndex
         items.forEach((item,index)=>{
             if(item.id==newitem.id){
                 currIndex = index
             }
         })
         items.splice(currIndex,1,newitem)
         localStorage.setItem('items',JSON.stringify(items))
     },
     deletefromstorage:function(currid){
          items = JSON.parse(localStorage.getItem('items'))
        items.forEach(function(item, index){
        if(currid === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items',JSON.stringify(items))
     }
    }
})()
//item cntrl
const ItemCntrl = (function(){
    const Item = function(date,title,ref,credit,debit,id){
        this.date = date
        this.title = title
        this.ref = ref
        this.debit = debit
        this.credit = credit
        this.id = id
    }
    const data = {
        // items : [
        //     {id:0 , title:'loan ',ref:'87907',credit:800 ,date:'14/06/2021',debit:0},
        //     {id:1 , title:'loan',ref:'87907',credit:800,date:'14/06/2021',debit:0},
        //     {id:2 , title:'loan',debit:800,date:'14/06/2021',credit:0}
        // ],
        items: StorageCntrl.getfromlocalstrorage(),
         currentItem: null,
         totalDebit: 0,
         totalCredit:0
    }
    return{
        getItem:function(){
            return data.items
        },
        logdata:function(){
            return data
        },
        addnewItem:function(date,title,ref,credit,debit){
            let Id;
            if(data.items.length>0){
                Id = data.items[data.items.length-1].id + 1
            }else{
                Id = 0
            }
            credit = parseInt(credit)
            debit = parseInt(debit)
            const newitem = new Item(date,title,ref,credit,debit,Id)
            data.items.push(newitem)
            return newitem
            
        },
        gettotaldebit:function(){
            let totdeb = 0
            let totcre = 0
            data.items.forEach(item=>{
                totdeb += item.debit
                totcre += item.credit
            })
             

    
      
            
           data.totalDebit = totdeb
           data.totalCredit = totcre
           return {
               debit:data.totalDebit,
               credit:data.totalCredit
           }

        },
        getitemtoedit:function(id){
          const dataedit = data.items.find(item=>{
              return item.id === id
          })
          return dataedit
          
        },
        setCurrentItem:function(edititem){
            data.currentItem = edititem
        },
        getcurrentItem:function(){
            return data.currentItem
        },
        updateDataItem:function(title,credit,debit,ref){
          credit = parseInt(credit)
          debit = parseInt(debit)
          let newUpdate = null
          data.items.forEach((item)=>{
              if(item.id === data.currentItem.id){
                  item.title = title
                  item.ref = ref
                  item.credit = credit
                  item.debit = debit
                  newUpdate = item
              }
          })
          return newUpdate
        },
        deleteCurrent:function(id){
            let currIndex = null
            data.items.forEach((item,index)=>{
                if(item.id === id){
                    currIndex = index
                }
            })
            data.items.splice(currIndex,1)
        },
        clearlist:function(){
            data.items = []
        }
    }
})()





//ui cntrl
const UiCntrl = (function(){
  const uiselector ={
       tablebody: '.tablebody',
       submit:'.add-btn',
       title:'#title',
       amount:'#amount',
       ref:'#ref',
       radio:'group1',
       debit:'#totaldebit',
       credit:'#totalcredit',
       table:'.collect',
       card:'.card',
       cardcontent:'.card-content',
       error:'.materialert',
       update:'.update-btn',
       deletebtn: '.delete-btn',
       back:'.back-btn',
       clear:'.clear-btn',
       list:'.tablebody tr',
       line:'.line',
       totalrow:'.showtotal'
  }
    return{
        populateTable:function(items){
            let html =''
            items.forEach((item)=>{
                let debit = item.debit? item.debit: ''
                let credit = item.credit? item.credit: ''
          
                html += `
                 <tr id =${item.id}>
                    <td>${item.date}</td>
                    <td>${item.title}</td>
                    <td>${item.ref? item.ref: ''}</td>
                    <td>${debit }</td>
                    <td>${credit}</td>
                    <td><a href="#" class="secondary-content">
                       <i class="edit-item fa fa-pencil"></i>
                    </a></td>

                </tr>
                 
                
                `
            })
            document.querySelector(uiselector.tablebody).innerHTML = html
        },
        getselectors: function(){
            return uiselector
        },
        getItemInput: function(){
              var rates = document.getElementsByName(uiselector.radio);
             var rate_value;
            for(var i = 0; i < rates.length; i++){
                if(rates[i].checked){
                    rate_value = rates[i].value;
                }
            }
            let debit 
            let credit
            const amount = document.querySelector(uiselector.amount).value
            if(rate_value == 'credit'){
                credit = amount
                debit = 0
            }else{
                debit = amount
                credit = 0
            }
            let day = new Date().getDate()
            day= day>9?day:`0${day}`
            let month = new Date().getMonth() + 1
            month = month>9?month:`0${month}`
            const year = new Date().getFullYear()
            const date = `${day}/${month}/${year}`
            
            
            return{
                date:date,
                title:document.querySelector(uiselector.title).value,
                ref:document.querySelector(uiselector.ref).value,
                debit:debit,
                credit:credit,
                amount:amount
            }
        },
        addlistItem:function(newitem){
            document.querySelector(uiselector.table).style.display = 'inline-table'
            document.querySelector(uiselector.line).style.display = 'block'
            document.querySelector(uiselector.totalrow).style.display = 'block'
            const {id,date,title,ref,credit,debit} = newitem
            const tr = document.createElement('tr')
            tr.id = id
            tr.innerHTML = `
                   <td>${date}</td>
                    <td>${title}</td>
                    <td>${ref? ref: ''}</td>
                    <td>${debit === 0?'':debit }</td>
                    <td>${credit === 0?'':credit}</td>
                    <td><a href="#" class="secondary-content">
                       <i class="edit-item fa fa-pencil"></i>
                    </a></td>
            
            `
           const tab = document.querySelector(uiselector.tablebody)
           tab.appendChild(tr)

        },
        showtotal:function(debit,credit){
           document.querySelector(uiselector.debit).textContent = debit
           document.querySelector(uiselector.credit).textContent = credit
        },
        clearinput:function(){
            document.querySelector(uiselector.title).value = ''
            document.querySelector(uiselector.ref).value = ''
            document.querySelector(uiselector.amount).value = ''
        },
        showError:function(){
            const div = document.createElement('div')
            div.className = 'materialert red lighten-3 '
            div.innerHTML = `<i class="material-icons">warning</i>
			<span class ='errormsg'>Check your input!</span>`
            const card = document.querySelector(uiselector.card)
            const cardcontent = document.querySelector(uiselector.cardcontent)
            card.insertBefore(div,cardcontent)
        },
        removeError:function(){
            document.querySelector(uiselector.error).remove()
        },
        additemtoform:function(){
            const item = ItemCntrl.getcurrentItem()
            const curAmount = item.debit?item.debit:item.credit
            const curRef = item.ref?item.ref:''
            document.querySelector(uiselector.title).value = item.title
            document.querySelector(uiselector.amount).value = curAmount
            document.querySelector(uiselector.ref).value = curRef
            UiCntrl.showEditstate()
        },
        clearUI:function(){
            document.querySelector(uiselector.tablebody).innerHTML = ''
        },
        cleareditstate:function(){
            UiCntrl.clearinput()
           document.querySelector(uiselector.back).style.display = 'none'
           document.querySelector(uiselector.deletebtn).style.display = 'none'
           document.querySelector(uiselector.update).style.display = 'none'
           document.querySelector(uiselector.submit).style.display = 'inline'
        },
        showEditstate:function(){
            document.querySelector(uiselector.back).style.display = 'inline'
           document.querySelector(uiselector.deletebtn).style.display = 'inline'
           document.querySelector(uiselector.update).style.display = 'inline'
           document.querySelector(uiselector.submit).style.display = 'none'
        },
        displayUpdatedList:function(item){
            const {id,date,title,ref,credit,debit} = item
            let list = document.querySelectorAll(uiselector.list)
            list = Array.from(list)
             let curId = id.toString()
            list.forEach((listitem)=>{
                let id = listitem.getAttribute('id')
                if(id === curId){
                   document.getElementById(`${id}`).innerHTML = `
                     <td>${date}</td>
                    <td>${title}</td>
                    <td>${ref? ref: ''}</td>
                    <td>${debit === 0?'':debit }</td>
                    <td>${credit === 0?'':credit}</td>
                    <td><a href="#" class="secondary-content">
                       <i class="edit-item fa fa-pencil"></i>
                    </a></td>
                   
                   `
                }
            })

            //alternate way
            // document.getElementById(`${curId}`).innerHTML = `
            //    <td>${date}</td>
            //         <td>${title}</td>
            //        <td>${ref? ref: ''}</td>
            //        <td>${debit === 0?'':debit }</td>
            //        <td>${credit === 0?'':credit}</td>
            //        <td><a href="#" class="secondary-content">
            //           <i class="edit-item fa fa-pencil"></i>
            //        </a></td>
            
            // `

        
        },
        deleteFromUi:function(curId){
            document.getElementById(`${curId}`).remove()
        },
        hideList:function(){
            document.querySelector(uiselector.table).style.display = 'none'
            document.querySelector(uiselector.line).style.display = 'none'
            document.querySelector(uiselector.totalrow).style.display = 'none'
            
        }
    
    }
})()





//app
const App = (function(ItemCntrl,UiCntrl,StorageCntrl){
   const loadEventlistener = ()=>{
       const selector = UiCntrl.getselectors()
       document.querySelector(selector.submit).addEventListener('click',itemAdd)
       document.querySelector(selector.table).addEventListener('click',checkedit)
       document.querySelector(selector.clear).addEventListener('click',clearAll)
       document.querySelector(selector.update).addEventListener('click',handleUpdate)
       document.querySelector(selector.deletebtn).addEventListener('click',hanldeDelete)
       document.querySelector(selector.back).addEventListener('click',UiCntrl.cleareditstate)

   }
   const itemAdd = (e)=>{

      const input = UiCntrl.getItemInput()
      if(input.title !== '' && input.amount !== ''){
        const newitem = ItemCntrl.addnewItem(input.date,input.title,input.ref,input.credit,input.debit)
        UiCntrl.addlistItem(newitem)
        StorageCntrl.addtoStorage(newitem)
        const {debit,credit} = ItemCntrl.gettotaldebit()
        UiCntrl.showtotal(debit,credit)
        
      }else{
          UiCntrl.showError()
          setTimeout(() => {
              UiCntrl.removeError()
          }, 3000);
      }
      UiCntrl.clearinput()
     
    
   e.preventDefault()
   }
   const checkedit = (e)=>{
      if(e.target.classList.contains('edit-item')){
          const editId = e.target.parentElement.parentElement.parentElement.id
          const id = parseInt(editId)
          const itemtoedit = ItemCntrl.getitemtoedit(id)
          ItemCntrl.setCurrentItem(itemtoedit)
          UiCntrl.additemtoform()
      }
    e.preventDefault()
   }
   const handleUpdate = (e)=>{
    const input = UiCntrl.getItemInput()
    const updatedItem = ItemCntrl.updateDataItem(input.title,input.credit,input.debit,input.ref)

    UiCntrl.displayUpdatedList(updatedItem)
     const {debit,credit} = ItemCntrl.gettotaldebit()
     UiCntrl.showtotal(debit,credit)
     StorageCntrl.updatestoragedata(updatedItem)
     UiCntrl.cleareditstate()
    e.preventDefault()
   }
   const hanldeDelete = (e)=>{
    const currentid = ItemCntrl.getcurrentItem()
    ItemCntrl.deleteCurrent(currentid.id)
    UiCntrl.deleteFromUi(currentid.id)
    const {debit,credit} = ItemCntrl.gettotaldebit()
    UiCntrl.showtotal(debit,credit)
    UiCntrl.cleareditstate()
    StorageCntrl.deletefromstorage(currentid.id)
    e.preventDefault()
   }
   const clearAll = (e)=>{
    ItemCntrl.clearlist()

    const {debit,credit} = ItemCntrl.gettotaldebit()
    UiCntrl.showtotal(debit,credit)
    UiCntrl.clearUI()
    StorageCntrl.clearStorage()
    UiCntrl.hideList()
    e.preventDefault()
   }
    
    return{
        init:function(){
            UiCntrl.cleareditstate()
            const items = ItemCntrl.getItem()
            if(items.length === 0){
                UiCntrl.hideList()
            }else{
              UiCntrl.populateTable(items)
            }
           
            loadEventlistener()
            const {debit,credit} = ItemCntrl.gettotaldebit()
            UiCntrl.showtotal(debit,credit)
        }
    }
})(ItemCntrl,UiCntrl,StorageCntrl)

App.init()