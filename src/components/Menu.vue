<template>
  <div>
    <div class="title-bar" :class="{'on-selected':item.onSelected}" @click.prevent="openHandler(item)">
      <p>
        {{ item.name }}
      </p>
      <a v-if="item.chil && item.chil.length>0" class="toggle-icon" href="#">
        {{ item.isOpen ? "-" : "+" }}
      </a>
      <a v-else>
        (on chil)
      </a>
    </div>
    <template v-if="item.chil && item.chil.length>0">
      <template v-if="item.isOpen">
        <!-- 利用vue特性巢狀呼叫自己 -->
        <Menu
          v-for="item in item.chil"
          :key="item.name"
          :item="item"
          class="sub-menu"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { inject } from 'vue'
import { useStore } from 'vuex'
export default {
  // 加入 name，template 才認得
  name: "MyMenu",
  props: {
    dataMenu: {
      type: Object
    },
    item: {
      type: Object,
    },
  },
  setup( ){
    const store = useStore()
    const currentMainOpenId = inject('currentMainOpenId')
    const openHandler = (item)=>{
      // 判斷是否有在set中
      if(currentMainOpenId.value.has(item.parentId)){
        // 如果有 分成兩個狀態 當前節點有被開過 與沒被開過
        if(item.isOpen){
           //進入遞迴檢查
          recursiveHandler(store.state.dataM, item.id, item)
          //被開過 因此下方會做出關閉動作 因此刪除set
          currentMainOpenId.value.delete(item.parentId)
        }else{
          // 沒被開過 直接進入遞迴檢查
          recursiveHandler(store.state.dataM, item.id, item)
        }
      }else{
        // 如果沒有 直接加上去
        currentMainOpenId.value.add(item.parentId)
        recursiveHandler(store.state.dataM, item.id, item)
      }
      // 上方總體處理完 當前點擊的狀態交換
      item.isOpen = !item.isOpen
      item.onSelected = !item.onSelected
      localStorage.setItem('remPath', JSON.stringify(store.state.dataM))
    }
     // 檢查是否為跟節點與不是 loop檢查
     // 如果是跟節點 關閉所有 自己以外的節點
     // 如果不是跟節點 用reRoot 記住你的父節點 做遞迴檢查 關閉非有層代關係的節點

    const recursiveHandler = (datas, currentClickID, currentItem, reRoot = 'root')=>{
      for (const element in datas) {
        datas[element].onSelected = false
        if( currentItem && currentItem.parentId !== 'root') {
          //非root節點
          reRoot = currentItem.parentId
          if( datas[element].id !== currentItem.id  &&  datas[element].parentId !=="root" && datas[element].parentId == reRoot){
          datas[element].isOpen = false;
          }else{
            // console.log('reRoot',reRoot)
          }
          if(datas[element].chil){
            recursiveHandler(datas[element].chil, currentClickID, currentItem, reRoot)
          }else{
            // console.log('end')
          }
        }else{
          if( datas[element].id !== currentClickID){
          datas[element].isOpen = false;
          }else{
            console.log('idinincvdi3')
          }
          if(datas[element].chil){
            recursiveHandler(datas[element].chil, currentClickID, currentItem, reRoot)
          }else{
            // console.log('end')
          }
        }
       
      }
      
      // store.commit('addData', {})
    }
    return{
      openHandler,
      recursiveHandler,
      currentMainOpenId,
    }
  },
};
</script>

<style scoped>
.sub-menu {
  margin-left: 30px;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
}
.on-selected{
  background-color: red;
}

.toggle-icon {
  color: grey;
  text-decoration: none;
}
</style>