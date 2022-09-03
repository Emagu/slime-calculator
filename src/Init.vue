<script setup>
    import Guid from './lib/Guid.js';
    import { ref } from "vue";
    import {reactive} from "@vue/reactivity";
    import axios from 'axios'
    import App from "./App.vue";
    import tabs from "./components/Tabs.vue";
    import tab from "./components/Tab.vue";
    import Dialog from "./components/TabDialog.vue";
    const isLoading = ref(false);
    let Source = "";
    const Apps = reactive([]);
    const SelectedIndex = ref();
    const showDialog = ref(false);
    const DialogName = ref("");
    let DialogSaveEvent;
    let DialogSaveId;
    const GetTab = ()=>{
        for(var i=0;i<Apps.length;i++)
        {
            if(Apps[i].id==SelectedIndex.value)
            {
                return Apps[i];
            }
        }
    }
    const GetTabData = ()=>{
        for(var i=0;i<Apps.length;i++)
        {
            if(Apps[i].id==SelectedIndex.value)
            {
                return Apps[i].data;
            }
        }
    }
    const SaveDialogEvent = (name)=>{
        DialogSaveEvent(name);
    }
    const addTabEvent = (name)=>{
        var newID = Guid.GetGuid();
        Apps.push({
            id: newID,
            name: name,
            data: JSON.parse(Source)
        });
        SelectedIndex.value = newID;
        showDialog.value = false;
    }

    const addTab = ()=>{
        showDialog.value = true;
        DialogName.value = "";
        DialogSaveEvent = addTabEvent;
    }
    const renameTabEvent = (name)=>{
        for(var i=0;i<Apps.length;i++)
        {
            if(Apps[i].id == DialogSaveId)
            {
                Apps[i].name = name;
            }
        }
        showDialog.value = false;
    }

    const renameTab = ()=>{
        showDialog.value = true;
        DialogName.value = GetTab().name;
        DialogSaveId = SelectedIndex.value;
        DialogSaveEvent = renameTabEvent;
    }
    const selectTab = (id)=>{
        SelectedIndex.value = id;
    }
    const LoadSource = (id) =>{
        let dataRequest = new FormData();
        dataRequest.append("Action", "read");
        dataRequest.append("Data", JSON.stringify({Id: "1jy6LWVGohjxMR2igSuXHID_6MoGaiHZUElQ6hsBII54", sheet: "新版公式", getFormulas: true, colStart:1,rowStart:1, colEnd: 16}));
        isLoading.value = true;
        axios({
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            url: 'https://script.google.com/macros/s/AKfycbxuaHQf3AuYpCnN1NjjJqoaiMpKr8ug_O0JocLGCz4godRowCbdm4TJkI-B8C6a3ql4tw/exec',
            data: dataRequest
        })
        .then((res) => {
            if(res.data.status)
            {
                var response= JSON.parse(res.data.data);
                Source = response.data;
            }
            isLoading.value = false;
            if(id == null)
            {
                addTabEvent("Default");
            }
            else
            {

            }
        });
    }
    LoadSource();
</script>
<template>
    <div style="width:1440px">
        <span>
            <button>保存</button>
            <button>下載</button>
            <button>上傳</button>
        </span>
        <Dialog :show="showDialog" :confirm="SaveDialogEvent" :name="DialogName" />
        <loading :active.sync="isLoading"></loading>
        <tabs :selectedIndex="SelectedIndex" :tabs="Apps" :addTab="addTab" :renameTab="renameTab" :selectTab="selectTab">
            <tab v-for="(app, index) in Apps" :key="index">
                <App :source="app.data" v-if="app.id == SelectedIndex" />
            </tab>
        </tabs>
    </div>
</template>