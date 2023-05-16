<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  {{ currentMainOpenId }}
  <div class="menu-bg">
    <!-- 利用vue特性巢狀呼叫自己 -->
    <Menu v-for="item in dataM" :key="item.id" :item="item" />
  </div>
  <select @change="optionOnclick($event, dataM)">
    <option v-for=" data in drapDownData" :key="data.id" :value="data.id">
      {{ data.name }}
    </option>
  </select>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Menu from "@/components/Menu.vue";
import { reactive, ref, provide, computed } from 'vue';
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Menu
  },
  setup(){
    const idSet = ref(new Set())
    const store = useStore()
    provide('currentMainOpenId', idSet)
    const dataMenu = reactive(
      {
        "好喝黑糖": {
          "id": "64f",
          "name": "好喝黑糖",
          "parentId": 'root',
          chil:[
          {
            "id": "445",
            "name": "黑糖鮮奶",
            "parentId": "64f",
            chil:[
            {
              "id": "37a",
              "name": "黑糖珍珠鮮奶",
              "parentId": "445"
            },
            {
              "id": "feb",
              "name": "黑糖芋圓鮮奶",
              "parentId": "445"
            },
            {
              "id": "59c",
              "name": "黑糖蒟蒻鮮奶",
              "parentId": "445"
            }
            ],
          },
          {
            "id": "29e",
            "name": "黑糖冬瓜",
            "parentId": "64f",
            chil:[
            {
              "id": "ac3",
              "name": "黑糖冬瓜牛奶",
              "parentId": "29e"
            },
            {
              "id": "ca0",
              "name": "黑糖冬瓜珍珠",
              "parentId": "29e"
            }
            ],
          }
          ]
        },
        "茶": {
          "id": "6c3",
          "name": "茶",
          "parentId": 'root',
          chil:[
          {
            "id": "5dc",
            "name": "烏龍綠",
            "parentId": "6c3"
          },
          {
            "id": "b5f",
            "name": "綠茶",
            "parentId": "6c3"
          },
          {
            "id": "b09",
            "name": "紅茶",
            "parentId": "6c3"
          },
          {
            "id": "887",
            "name": "青茶",
            "parentId": "6c3"
          }
          ],
          
        },
        "咖啡": {
          "id": "c81",
          "name": "咖啡",
          "parentId": 'root',
          chil:[
          {
            "id": "e02",
            "name": "黑咖啡",
            "parentId": "c81",
            chil:[
            {
              "id": "d20",
              "name": "濃縮咖啡",
              "parentId": "e02"
            },
            {
              "id": "1f8",
              "name": "美式咖啡",
              "parentId": "e02"
            }
            ],
            
          },
          {
            "id": "d7a",
            "name": "牛奶咖啡",
            "parentId": "c81",
            chil:[
            {
              "id": "c09",
              "name": "拿鐵",
              "parentId": "d7a",
              chil:[
              {
                "id": "db2",
                "name": "黑糖拿鐵",
                "parentId": "c09"
              },
              {
                "id": "9f6",
                "name": "榛果拿鐵",
                "parentId": "c09"
              },
              {
                "id": "b61",
                "name": "香草拿鐵",
                "parentId": "c09"
              }
              ],
            },
            {
              "id": "9ac",
              "name": "卡布奇諾",
              "parentId": "d7a"
            },
            {
              "id": "ce8",
              "name": "摩卡",
              "parentId": "d7a"
            }
            ],
          }
          ],
        }
      })
    if(localStorage.getItem('remPath')){
      let temp = JSON.parse(localStorage.getItem('remPath'))
      store.commit('addData', temp)
    }else{
      store.commit('addData', dataMenu)
    }
    
    let drapDownData = ref([])
    const recursiveHandler = (datas)=>{
      for (const element in datas) {
        drapDownData.value.push(datas[element])
        recursiveHandler(datas[element].chil)
      }
    }
    // option 結構產出
    recursiveHandler(store.state.dataM)
    // option 選擇找到對應所需資料與路徑
    let findFlag = false
    let targetObject = null
    let findPath = []
    const selectRecursiveHandler = (datas, targetId, parentId = 'root')=>{
      for (const element in datas) {
        if(datas[element].id == targetId){
          if(datas[element].parentId === 'root'){
            // ＤＦＳ根目路徑必須重置
            findPath = []
          }
          findPath.push(datas[element])
          findFlag = true
          targetObject = datas[element]
          return targetObject
        }
        if(datas[element].chil && !findFlag){
          if(datas[element].parentId === 'root'){
            // ＤＦＳ根目路徑必須重置
            findPath = []
          }
          if(parentId == datas[element].parentId){
            // 檢查是否有一樣的同級分類
            findPath.push(datas[element])
          }
          selectRecursiveHandler(datas[element].chil, targetId, datas[element].id)
        }else{
          if(parentId == datas[element].id){
            findPath.pop()
          }
        }
      }
    }
    const optionOnclick = (event)=>{
      // 初始化
      findFlag = false
      targetObject = null
      findPath = []
      
      selectRecursiveHandler(store.state.dataM, event.target.value)
      let commitData = store.state.dataM
      // 深度優先的控制
      let prelog = 0
      function search (targetId, datas){
        for (const element in datas){
          datas[element].isOpen = false
          datas[element].onSelected = false
          if(datas[element].id == targetId){
            datas[element].isOpen = true
            if(prelog == newArray.length-1){
              // 標示紅色需要另一個條件
              datas[element].onSelected = true
            }
            
            if(datas[element].chil){
              if(prelog + 1 <newArray.length){
                prelog ++
              }
              
              search(newArray[prelog].id, datas[element].chil)
            }
          }
        }
      }
      // 去除重複相同等級分類 只會有正確複層分類
      let map = new Map(); 
      let newArray = new Array();   
      for (let i = 0; i < findPath.length; i++) { 
        if(map .has(findPath[i].parentId)) {   
          map .set(findPath[i].parentId, true);  
          newArray.pop()
          newArray.push(findPath[i])
        } else {  
          // 如果没有该key值 
          map .set(findPath[i].parentId, false);
          newArray.push(findPath[i])   
        } 
      }  
      search(newArray[prelog].id, commitData)
      // 儲存
      store.commit('addData', commitData)
      localStorage.setItem('remPath', JSON.stringify(commitData))
    }
    return{
      optionOnclick,
      drapDownData,
      dataM: computed(()=> store.state.dataM)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
