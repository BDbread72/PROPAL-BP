/**
 * @typedef {"=="|">="|">"|"<="|"<"|"!="} operator
 * 
 * @typedef {Object} chatEventData
 * @property {number} type
 * @property {string} startsWith
 * @property {chatCondition[]} conditions
 * @property {boolean} cancel
 * @property {chatParam[]} params
 * @property {chatParamBranch[]} paramBranches
 * @property {interfacemsg} interfaceMessages
 * 
 * @typedef {object} chatCondition
 * @property {"op"|"score"|"tagInclude"} requires
 * @property {string} name
 * @property {operator} operator
 * @property {string|number|boolean} second
 * 
 * @typedef {object} chatParam
 * @property {string} name
 * @property {string} desc
 * @property {boolean} essential
 * @property {"string"|"boolean"|"number"} type
 * 
 * @typedef {Object} chatParamBranch
 * @property {string|boolean|number} paramValue
 * @property {"branch"|"runCommand"} after
 * @property {chatParamBranch[]|string} afterValue
 * 
 * @typedef {object} interfacemsg
 * @property {string?} overParamMessage
 * @property {string?} lessParamMessage
 */

/**@type {chatEventData} */
const _instanceChatEvent={
  type:0,
  cancel:true,
  conditions:[],
  params:[],
  paramBranches:[],
  startsWith:'!test',
  interfaceMessages:{
    lessParamMessage:'',
    overParamMessage:''
  }
}

/**@type {chatCondition} */
const _instanceChatCondition = {
  name:``,
  operator:"==",
  requires:"op",
  second:true
}

/**@type {HTMLDivElement} */
const workspace = document.getElementById('workSpace')

const dtf = document.getElementById('dataTextField')

class chatEvent{
  constructor() {
    /**@type {chatEventData[]}*/
    this.data = []
  }
  returnAsString(){
    return JSON.stringify(this.data)
  }
  updateTextOnly(){
    dtf.innerText = this.returnAsString()
  }
  update(){
    workspace.innerHTML = ''
    this.updateTextOnly()
    let index=0;
    for(const d of this.data){
      const chatEvent = document.createElement('article')
      const startsWithInput = document.createElement('input')
      const label1 = document.createElement('label')
      label1.textContent = 'startsWith'
      startsWithInput.value = d.startsWith
      startsWithInput.setAttribute('index',index)
      startsWithInput.addEventListener('change',()=>{
        this.data[Number(startsWithInput.getAttribute('index'))].startsWith = startsWithInput.value
        this.updateTextOnly()
      })

      const label2 = document.createElement('label')
      label2.textContent = 'type'
      const typeSelection = document.createElement('select')
      typeSelection.setAttribute('index',index)
      const options = ["custom","normalChat"]
      for(let i=0;i<options.length;i++){
        const _a = document.createElement('option')
        _a.value=''+i
        _a.text=options[i]
        typeSelection.appendChild(_a)
      }
      typeSelection.value = d.type
      typeSelection.addEventListener('change',()=>{
        this.data[Number(typeSelection.getAttribute('index'))].type = Number(typeSelection.value)
        this.updateTextOnly()
      })
      
      
      const cancelCheckbox = document.createElement('input')
      const label3 = document.createElement('label')
      label3.textContent = 'Cancel Message'
      cancelCheckbox.type = 'checkbox'
      cancelCheckbox.style.marginLeft = '6px'
      cancelCheckbox.setAttribute('index',index)
      cancelCheckbox.checked = d.cancel
      cancelCheckbox.addEventListener('change',()=>{this.data[Number(cancelCheckbox.getAttribute('index'))].cancel = cancelCheckbox.checked;this.updateTextOnly()})
      const div1 = document.createElement('div')
      div1.style.display = 'flex'
      div1.append(label3, cancelCheckbox)

      const interfaceMessagesArticle= document.createElement('article')
      const header1 = document.createElement('header')
      header1.innerText = 'Interface Messages'
      const label4 = document.createElement('label')
      label4.textContent = 'LessParamMessage'
      const input1 = document.createElement('input')
      input1.placeholder = 'If param is leaked, this message sent. (essential only)'
      input1.value = d.interfaceMessages.lessParamMessage
      input1.setAttribute('index',index)
      input1.addEventListener('change',()=>{
        this.data[Number(input1.getAttribute('index'))].interfaceMessages.lessParamMessage = input1.value
        this.updateTextOnly()
      })
      const label5 = document.createElement('label')
      label5.textContent = 'OverParamMessage'
      const input2 = document.createElement('input')
      input2.placeholder = 'If param is overflows, this message sent. (essential only)'
      input2.value = d.interfaceMessages.overParamMessage
      input2.setAttribute('index',index)
      input2.addEventListener('change',()=>{
        this.data[Number(input2.getAttribute('index'))].interfaceMessages.overParamMessage = input2.value
        this.updateTextOnly()
      })
      interfaceMessagesArticle.append(header1,label4,input1,label5,input2)

      const conditionsArticle = document.createElement('article')
      const header2 = document.createElement('header')
      header2.innerText = 'CONDTIONS'
      let conditionIndex = 0;
      conditionsArticle.append(header2)
      for(const condition of d.conditions){
        const conditionSelfArticle = document.createElement('article')
        const label_name = document.createElement('label')
        label_name.textContent = `Name`
        const input_name = document.createElement('input')
        input_name.placeholder = 'name of condition'
        input_name.value = condition.name
        input_name.setAttribute('index',index);
        input_name.setAttribute('c_index',conditionIndex);
        input_name.addEventListener('change',()=>{
          this.data[Number(input_name.getAttribute('index'))].conditions[Number(input_name.getAttribute('c_index'))].name = input_name.value
          this.updateTextOnly()
        })

        const reqArr = ["op","score","tagInclude"]
        const req_label = document.createElement('label')
        req_label.textContent = 'Requires'
        const req_select = document.createElement('select')
        req_select.setAttribute('index',index)
        req_select.setAttribute('c_index',conditionIndex)
        for(const _a of reqArr){
          const instanceOption = document.createElement('option')
          instanceOption.value = _a
          instanceOption.text = _a
          req_select.appendChild(instanceOption)
        }
        req_select.value = condition.requires
        req_select.addEventListener('change',()=>{
          this.data[Number(req_select.getAttribute('index'))].conditions[Number(req_select.getAttribute('c_index'))].requires = req_select.value
          this.update();
        })

        const operations = ["==",">=",">","<=","<","!="]
        const operator_label = document.createElement('label')
        operator_label.textContent = 'Operation'
        const operator_select = document.createElement('select')
        operator_select.setAttribute('index',index)
        operator_select.setAttribute('c_index',conditionIndex)
        for(const _a of operations){
          const instanceOption = document.createElement('option')
          instanceOption.value = _a
          instanceOption.text = _a
          operator_select.appendChild(instanceOption)
        }
        operator_select.value = condition.operator
        operator_select.addEventListener('change',()=>{
          this.data[Number(operator_select.getAttribute('index'))].conditions[Number(operator_select.getAttribute('c_index'))].operator = operator_select.value
          this.update();
        })

        const label_second = document.createElement('label')
        label_second.textContent = 'Second (operation value)'
        const changeSecondToNextTypeButton = document.createElement('button')
        changeSecondToNextTypeButton.textContent = 'Second to next type'
        changeSecondToNextTypeButton.setAttribute('index',index)
        changeSecondToNextTypeButton.setAttribute('c_index',conditionIndex)
        const input_second = document.createElement('input')
        input_second.setAttribute('index',index)
        input_second.setAttribute('c_index',conditionIndex)
        if(typeof condition.second == "string"){
          //? string
          input_second.value = condition.second
          changeSecondToNextTypeButton.addEventListener('click',()=>{this.data[Number(changeSecondToNextTypeButton.getAttribute('index'))].conditions[Number(changeSecondToNextTypeButton.getAttribute('c_index'))].second=true;this.update()})
          input_second.type = 'text'
          input_second.addEventListener('change',()=>{
            this.data[Number(input_second.getAttribute('index'))].conditions[Number(input_second.getAttribute('c_index'))].second = input_second.value
            this.update()
          })
        }else if(typeof condition.second == "boolean"){
          //? boolean
          input_second.checked = Boolean(condition.second)
          input_second.style.width = '100%'
          input_second.style.height = '4rem'
          changeSecondToNextTypeButton.addEventListener('click',()=>{this.data[Number(changeSecondToNextTypeButton.getAttribute('index'))].conditions[Number(changeSecondToNextTypeButton.getAttribute('c_index'))].second=0;this.update()})
          input_second.type = 'checkbox'
          input_second.addEventListener('change',()=>{
            this.data[Number(input_second.getAttribute('index'))].conditions[Number(input_second.getAttribute('c_index'))].second = Boolean(input_second.checked)
            this.update()
          })
        }else if(typeof condition.second == "number"){
          //? number
          input_second.value = Number(condition.second)
          changeSecondToNextTypeButton.addEventListener('click',()=>{this.data[Number(changeSecondToNextTypeButton.getAttribute('index'))].conditions[Number(changeSecondToNextTypeButton.getAttribute('c_index'))].second="";this.update()})
          input_second.type = 'number'
          input_second.addEventListener('change',()=>{
            this.data[Number(input_second.getAttribute('index'))].conditions[Number(input_second.getAttribute('c_index'))].second = Number(input_second.value)
            this.update()
          })
        }

        const removeCondtionButton = document.createElement('button')
        removeCondtionButton.setAttribute('index',index)
        removeCondtionButton.setAttribute('c_index',conditionIndex)
        removeCondtionButton.textContent = 'Delete Condition'
        removeCondtionButton.style.width = '100%'
        removeCondtionButton.addEventListener('click',()=>{
          this.data[Number(removeCondtionButton.getAttribute('index'))].conditions.splice(Number(removeCondtionButton.getAttribute('c_index')),1)
          this.update();
        })
        removeCondtionButton.style.color = "#fff"
        removeCondtionButton.style.backgroundColor = '#f00'
        removeCondtionButton.style.borderColor = '#f00'

        const __insD = document.createElement('div')
        __insD.style.height = "12px"
        

        conditionSelfArticle.append(label_name,input_name,req_label,req_select,operator_label,operator_select,label_second,input_second,changeSecondToNextTypeButton,__insD,removeCondtionButton)
        conditionsArticle.appendChild(conditionSelfArticle)
        conditionIndex++
      }
      const addCondtionButton = document.createElement('button')
      addCondtionButton.textContent = `Add Condition`
      addCondtionButton.setAttribute('index',index)
      addCondtionButton.style.width = "100%"
      addCondtionButton.addEventListener('click',()=>{
        this.data[Number(addCondtionButton.getAttribute('index'))].conditions.push(JSON.parse(JSON.stringify(_instanceChatCondition)))
        this.update()
      })
      conditionsArticle.append(addCondtionButton)


      //! DEL
      const deleteButton = document.createElement('button')
      deleteButton.style.width = '100%'
      deleteButton.innerText = `DELETE`
      deleteButton.style.backgroundColor=`#f00`
      deleteButton.style.borderColor = `#f00`
      deleteButton.style.color = '#fff'
      deleteButton.setAttribute('index',index)
      deleteButton.addEventListener('click',()=>{this.openDeleteEventModal(deleteButton.getAttribute('index'))})
      chatEvent.append(label1,startsWithInput,label2,typeSelection,div1,conditionsArticle)
      chatEvent.append(interfaceMessagesArticle,deleteButton)
      workspace.appendChild(chatEvent)
      index++;
    }


    const addChatEventBtn = document.createElement('button')
    addChatEventBtn.classList.add('addChatEvent')
    addChatEventBtn.style.width = '100%'
    addChatEventBtn.innerText = `+ ADD CHAT EVENT +`
    workspace.appendChild(addChatEventBtn)
    for(const _a of document.querySelectorAll('.addChatEvent')){
      _a.addEventListener('click',()=>{
        //? On click 'addChatEvent' btn
        this.data.push(JSON.parse(JSON.stringify(_instanceChatEvent)));
        this.update();
      })
    }
  }
  /**@param {number} index   */
  openDeleteEventModal(index){
    const dialog = document.createElement('dialog')
    const article = document.createElement('article')
    const header = document.createElement('header')
    header.innerText = 'DELETE ALERT'
    const p = document.createElement('p')
    p.innerHTML = `Are you really delete this Chat Event?`
    const buttonYes = document.createElement('button')
    buttonYes.innerText = `YES`
    buttonYes.style.margin= "3px"
    buttonYes.classList.add('contrast')
    buttonYes.addEventListener('click',()=>{
      this.data.splice(index,1)
      this.update()
      dialog.remove();
    })
    const buttonNo = document.createElement('button')
    buttonNo.innerText = 'NO'
    buttonNo.style.margin= "3px"
    buttonNo.classList.add('secondary')
    buttonNo.addEventListener('click',()=>{
      dialog.remove()
    })

    article.append(header,p,buttonYes,buttonNo)
    dialog.appendChild(article)
    dialog.open = true
    document.body.appendChild(dialog)
  }
}
let CHATDATA = new chatEvent()


const resetDataBtn = document.getElementById('resetData')
resetDataBtn.addEventListener('click',()=>{
  CHATDATA.data = [];
  CHATDATA.update();
})
const copyDataBtn = document.getElementById('copyData')
copyDataBtn.addEventListener('click',()=>{
  navigator.clipboard.writeText(CHATDATA.returnAsString())
  copyDataBtn.innerText = 'Copied!'
  setTimeout(()=>{
    copyDataBtn.innerHTML = 'Copy to Clipboard'
  },3 * 1000)
})
const pasteDataBtn = document.getElementById('pasteData')
pasteDataBtn.addEventListener('click',async ()=>{
  const clipboard = navigator.clipboard.readText().then((readData)=>{
    CHATDATA.data = JSON.parse(readData)
    CHATDATA.update()
    pasteDataBtn.innerText = 'Pasted!'
    setTimeout(()=>{
      pasteDataBtn.innerHTML = 'Paste from Clipboard'
    },3 * 1000)
  })
})

CHATDATA.update()