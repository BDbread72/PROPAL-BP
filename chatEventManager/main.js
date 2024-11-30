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

/**@type {chatParamBranch} */
const _branchBase = {
  after:"runCommand",
  afterValue: "",
  paramValue: ""
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

      const paramsArticle = document.createElement('article')
      const paramsHeader = document.createElement('header')
      paramsHeader.textContent = 'PARAMS'
      paramsArticle.append(paramsHeader)
      let paramIndex=0;
      for(const pm of d.params){
        const paramArt = document.createElement('article')
        const paramIsEssentialLabel = document.createElement('label')
        paramIsEssentialLabel.textContent = 'Is Essential'
        const paramIsEssential = document.createElement('input')
        paramIsEssential.type = 'checkbox'
        paramIsEssential.checked = pm.essential
        paramIsEssential.setAttribute('index',index)
        paramIsEssential.setAttribute('pindex',paramIndex)
        paramIsEssential.style.marginLeft='6px'
        paramIsEssential.addEventListener('click',()=>{
          this.data[Number(paramIsEssential.getAttribute('index'))].params[Number(paramIsEssential.getAttribute('pindex'))].essential = paramIsEssential.checked;
          this.updateTextOnly()
        })
        const div = document.createElement('div')
        div.style.display='flex'
        div.append(paramIsEssentialLabel,paramIsEssential)

        const paramTypeLabel = document.createElement('label')
        paramTypeLabel.textContent = 'Param Type'
        const paramTypesArr = ['Boolean','Number','String']
        const paramTypeSel = document.createElement('select')
        for(const t of paramTypesArr){
          const paramTypeOpt = document.createElement('option')
          paramTypeOpt.value = t.charAt(0).toUpperCase() + t.slice(1,t.length)
          paramTypeOpt.text = t.charAt(0).toUpperCase() + t.slice(1,t.length)
          paramTypeSel.appendChild(paramTypeOpt)
        }
        paramTypeSel.setAttribute('index',index)
        paramTypeSel.setAttribute('pindex',paramIndex)
        paramTypeSel.onchange = ()=>{this.data[Number(paramTypeSel.getAttribute('index'))].params[Number(paramTypeSel.getAttribute('pindex'))].type = paramTypeSel.value.toLowerCase();this.updateTextOnly()}

        const paramNameLabel = document.createElement('label')
        paramNameLabel.textContent = "Name of Param"
        const paramNameInput = document.createElement('input')
        paramNameInput.setAttribute('index',index)
        paramNameInput.setAttribute('pindex',paramIndex)
        paramNameInput.value = pm.name
        paramNameInput.addEventListener('change',()=>{
          this.data[Number(paramNameInput.getAttribute('index'))].params[Number(paramNameInput.getAttribute('pindex'))].name = paramNameInput.value
          this.updateTextOnly()
        })

        const paramDescLabel = document.createElement('label')
        paramDescLabel.textContent = "Description of Param"
        const paramDescInput = document.createElement('input')
        paramDescInput.setAttribute('index',index)
        paramDescInput.setAttribute('pindex',paramIndex)
        paramDescInput.value = pm.name
        paramDescInput.addEventListener('change',()=>{
          this.data[Number(paramDescInput.getAttribute('index'))].params[Number(paramDescInput.getAttribute('pindex'))].desc = paramDescInput.value
          this.updateTextOnly()
        })

        const paramDelete = document.createElement('button')
        paramDelete.setAttribute('index',index)
        paramDelete.setAttribute('pindex',paramIndex)
        paramDelete.textContent = 'Delete Param'
        paramDelete.style.width = '100%'
        paramDelete.style.backgroundColor = `#f00`
        paramDelete.style.borderColor = `#f00`
        paramDelete.style.color = `#fff`
        paramDelete.addEventListener('click',()=>{
          this.data[Number(paramDelete.getAttribute('index'))].params.splice(Number(paramDelete.getAttribute('pindex')),1)
          this.update()
        })
        paramArt.append(div,paramTypeLabel,paramTypeSel,paramNameLabel,paramNameInput,paramDescLabel,paramDescInput,paramDelete)
        paramsArticle.appendChild(paramArt)
      }
      const paramAdderBtn = document.createElement('button')
      paramAdderBtn.innerText = "ADD PARAM"
      paramAdderBtn.setAttribute('index',index)
      paramAdderBtn.style.width = '100%'
      paramAdderBtn.onclick = ()=>{
        this.data[Number(paramAdderBtn.getAttribute('index'))].params.push({essential:true,name:"",desc:"",type:"string"})
        this.update()
      }
      paramsArticle.append(paramAdderBtn)

      const parambranchArticle = document.createElement('article')
      const paramBranchHeader = document.createElement('header')
      paramBranchHeader.innerText = `PARAM BRANCHES`
      parambranchArticle.append(paramBranchHeader)
      const paramTypeArr = ['string','number','boolean']
      /**@param {chatParamBranch[]} paramBranches @param {Number[]} branchArr @param {chatEvent} owner   */
      function returnPBArticle(paramBranches, branchArr,owner){
        let pbIndex = 0;
        /**@type {HTMLElement[]} */
        let articleArr = []
        for(const pb of paramBranches){
          /**@type {Number[]} */
          let barr = JSON.parse(JSON.stringify(branchArr))
          barr.push(pbIndex)
          const article = document.createElement('article')
          const paramTypeLabel = document.createElement('label')
          paramTypeLabel.textContent = 'Param Type'
          const paramTypeSelect = document.createElement('select')
          for(const pt of paramTypeArr){
            const paramTypeOpt = document.createElement('option')
            paramTypeOpt.value = pt
            paramTypeOpt.text = pt
            paramTypeSelect.appendChild(paramTypeOpt)
          }
          paramTypeSelect.value = typeof pb.paramValue
          paramTypeSelect.setAttribute('index',index)
          paramTypeSelect.setAttribute('pindex',JSON.stringify(barr))
          paramTypeSelect.addEventListener('change',()=>{
            /**@type {Number[]} */
            let pindex = JSON.parse(paramTypeSelect.getAttribute('pindex'))
            const tindex = Number(paramTypeSelect.getAttribute('index'))
            let __ = owner.data[tindex].paramBranches
            let _i = 0;
            for(const i of pindex){
              _i++;
              __ = __[i]
              if(pindex.length != _i) __ = __.afterValue
            }
            if(paramTypeSelect.value == "string"){
              __.paramValue = ""
            }else if(paramTypeSelect.value == "number"){
              __.paramValue = 0
            }else if(paramTypeSelect.value == "boolean"){
              __.paramValue = false
            }
            owner.update()
          })
          const paramValueLabel = document.createElement('label')
          paramValueLabel.textContent = 'Param Value'
          const paramValueInput = document.createElement('input')
          if(typeof pb.paramValue == "string"){
            // paramValueInput.type
            paramValueInput.value = pb.paramValue
          }else if(typeof pb.paramValue == "number"){
            paramValueInput.type = 'number'
            paramValueInput.value = pb.paramValue
          }else{
            paramValueInput.type = 'checkbox'
            paramValueInput.style.width = '100%'
            paramValueInput.checked = pb.paramValue
          }
          paramValueInput.style.height = '3.5rem'
          paramValueInput.setAttribute('index',index)
          paramValueInput.setAttribute('pindex',JSON.stringify(barr))
          paramValueInput.addEventListener('change',()=>{
            /**@type {Number[]} */
            let pindex = JSON.parse(paramValueInput.getAttribute('pindex'))
            const tindex = Number(paramValueInput.getAttribute('index'))
            let __ = owner.data[tindex].paramBranches
            let _i = 0;
            for(const i of pindex){
              _i++;
              __ = __[i]
              if(pindex.length != _i) __ = __.afterValue
            }
            if(typeof pb.paramValue == "string"){
              __.paramValue = paramValueInput.value
            }else if(typeof pb.paramValue == "number"){
              __.paramValue = Number(paramValueInput.value)
            }else{
              __.paramValue = paramValueInput.checked
            }
            owner.updateTextOnly()
          })

          const afterValueTypeLabel = document.createElement('label')
          afterValueTypeLabel.textContent = 'After Value Type'
          const afterValueTypeSelect = document.createElement('select')
          const afterValueTypeArr = ["string","param branch"]
          for(const __a of afterValueTypeArr){
            const __opt = document.createElement('option')
            __opt.value = __a
            __opt.textContent = __a
            afterValueTypeSelect.append(__opt)
          }
          afterValueTypeSelect.setAttribute('index',index)
          afterValueTypeSelect.setAttribute('pindex',JSON.stringify(barr))
          afterValueTypeSelect.addEventListener('change',()=>{
            /**@type {Number[]} */
            let pindex = JSON.parse(afterValueTypeSelect.getAttribute('pindex'))
            const tindex = Number(afterValueTypeSelect.getAttribute('index'))
            let __ = owner.data[tindex].paramBranches
            let _i = 0;
            for(const i of pindex){
              _i++;
              __ = __[i]
              if(pindex.length != _i) __ = __.afterValue
            }
            if(afterValueTypeSelect.value == afterValueTypeArr[0]){__.afterValue = ""}
            else{__.afterValue = []}
            owner.update()
          })
          if(typeof pb.afterValue == "string"){afterValueTypeSelect.value = afterValueTypeArr[0]}
          else {afterValueTypeSelect.value = afterValueTypeArr[1]}
  
          article.append(paramTypeLabel,paramTypeSelect,paramValueLabel,paramValueInput,afterValueTypeLabel,afterValueTypeSelect)
          if(typeof pb.afterValue == "string"){
            //? string input
            const afterValueInput = document.createElement('input')
            afterValueInput.setAttribute('index',index)
            afterValueInput.setAttribute('pindex',JSON.stringify(barr))
            afterValueInput.value = pb.afterValue
            afterValueInput.addEventListener('change',()=>{
              /**@type {Number[]} */
              let pindex = JSON.parse(afterValueInput.getAttribute('pindex'))
              const tindex = Number(afterValueInput.getAttribute('index'))
              let __ = owner.data[tindex].paramBranches
              let _i = 0;
              for(const i of pindex){
                _i++;
                __ = __[i]
                if(pindex.length != _i) __ = __.afterValue
              }
              __.afterValue = afterValueInput.value
              owner.updateTextOnly
            })
            article.append(afterValueInput)
          }else{
            //? branches
            const pbArticle = document.createElement('article')
            const header = document.createElement('header')
            header.textContent = 'Param Branches'
            pbArticle.append(header)
            let __b = JSON.parse(JSON.stringify(branchArr))
            __b.push(pbIndex)
            for(const i of returnPBArticle(pb.afterValue,__b,owner)){
              pbArticle.append(i)
            }
            const pbAdder = document.createElement('button')
            pbAdder.textContent = "ADD PARAM BRANCH"
            pbAdder.style.width = '100%'
            pbAdder.setAttribute('index',index)
            pbAdder.setAttribute('pindex',JSON.stringify(barr))
            pbAdder.addEventListener('click',()=>{
              let pindex = JSON.parse(pbAdder.getAttribute('pindex'))
              const tindex = Number(pbAdder.getAttribute('index'))
              let __ = owner.data[tindex].paramBranches
              let _i = 0;
              for(const i of pindex){
                _i++;
                __ = __[i]
                if(pindex.length != _i) __ = __.afterValue
              }
              __.afterValue.push(JSON.parse(JSON.stringify(_branchBase)))
              owner.update()
            })

            pbArticle.append(pbAdder)
            article.append(pbArticle)
          }
          const deleteParamBranch = document.createElement('button')
          deleteParamBranch.innerText = 'Delete Param Branch'
          deleteParamBranch.style.backgroundColor = '#f00'
          deleteParamBranch.style.borderColor = '#f00'
          deleteParamBranch.style.width = '100%'
          deleteParamBranch.setAttribute('index',index)
          deleteParamBranch.setAttribute('pindex',JSON.stringify(barr))
          deleteParamBranch.addEventListener('click',()=>{
            owner.data[Number(deleteParamBranch.getAttribute('index'))].paramBranches.splice(Number(deleteParamBranch.getAttribute('pindex')),1)
            owner.update()
          })
          article.appendChild(deleteParamBranch)
          articleArr.push(article)
          pbIndex++;
        }
        return articleArr
      }
      for(const a of returnPBArticle(d.paramBranches,[],this)){
        parambranchArticle.appendChild(a)
      }
      
      const paramBranchAdder = document.createElement('button')
      paramBranchAdder.style.width = '100%'
      paramBranchAdder.innerText = 'Add Param Branch'
      paramBranchAdder.setAttribute('index',index)
      paramBranchAdder.addEventListener('click',()=>{
        this.data[Number(paramBranchAdder.getAttribute('index'))].paramBranches.push(JSON.parse(JSON.stringify(_branchBase)))
        this.update();
      })
      parambranchArticle.appendChild(paramBranchAdder)


      //! DEL
      const deleteButton = document.createElement('button')
      deleteButton.style.width = '100%'
      deleteButton.innerText = `DELETE`
      deleteButton.style.backgroundColor=`#f00`
      deleteButton.style.borderColor = `#f00`
      deleteButton.style.color = '#fff'
      deleteButton.setAttribute('index',index)
      deleteButton.addEventListener('click',()=>{this.openDeleteEventModal(deleteButton.getAttribute('index'))})
      chatEvent.append(label1,startsWithInput,label2,typeSelection,div1,conditionsArticle,paramsArticle,parambranchArticle)
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
