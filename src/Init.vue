<script setup>
    import Guid from './lib/Guid.js';
    import { ref,inject } from "vue";
    import {reactive} from "@vue/reactivity";
    import axios from 'axios'
    import App from "./App.vue";
    import tabs from "./components/Tabs.vue";
    import tab from "./components/Tab.vue";
    import Dialog from "./components/TabDialog.vue";
    const $cookies = inject('$cookies');
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
    const getExtendSetting = ()=>{
        return [
            {
                show:false,
                name:"計算抵抗"
            },{
                show:true,
                name:"計算弱點"
            },{
                show:false,
                name:"計算Combo4"
            },{
                show:false,
                name:"計算Combo5"
            },{
                show:false,
                name:"計算Combo6"
            }
        ];
    }
    const GetOption = () => {
        var Options = [];
        var Table = JSON.parse(Source);
        for(var row=14; row < 23; row++)
        {
            var defaultValue = false;
            if(row == 14 || row == 15 || row == 19)
            {
                defaultValue = true;
            }
            Options.push({
                name: Table[row][0],
                show: defaultValue
            });
        }
        return Options;
    }
    const addTabEvent = (name)=>{
        var newID = Guid.GetGuid();
        buildTabEvent({
            id: newID,
            name: name,
            data: JSON.parse(Source),
            extendSetting: getExtendSetting(),
            options: GetOption()
        });
        showDialog.value = false;
    }

    const buildTabEvent = (tabData)=>{
        Apps.push(tabData);
        SelectedIndex.value = tabData.id;
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
    const LoadSource = () =>{
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
            var hasRecord = Load();
            isLoading.value = false;
            if(hasRecord)
            {
                
            }
            else
            {
                addTabEvent("Default");
            }
        });
    }
    const GenSaveData = () => {
        var datas = [];
        Apps.forEach(element => {
            var appData = {};
            appData["id"] = element.id;
            appData["name"] = element.name;
            appData["self"] = [];
            appData["enemy"] = [];
            element.data.forEach((row, index)=>{
                if(index < 7)
                {
                    appData["self"].push(row[1]);
                    appData["enemy"].push(row[3]);
                } else if(index < 13)
                {
                    appData["self"].push(row[1]);
                }
            });
            appData["options"] = element.options;
            appData["extendSetting"] = element.extendSetting;
            datas.push(appData);
        });
        return datas;
    }
    const LoadEvent = (data) => {
        var TempAppsData = JSON.parse(data);
        TempAppsData.forEach(app=>{
            var source = JSON.parse(Source);
            app.self.forEach((row,index)=>{
                source[index][1] = row;
            });
            app.enemy.forEach((row,index)=>{
                source[index][3] = row;
            });
            buildTabEvent({
                id: app.id,
                name: app.name,
                data: source,
                extendSetting: app.extendSetting,
                options: app.options
            })
        });
    }
    const Save = () => {
        $cookies.set("SLIMEData", JSON.stringify(GenSaveData()));
        alert("保存完成!");
    }
    const Load = () => {
        var tempData = $cookies.get("SLIMEData");
        if(tempData == null || tempData == "")
        {
            return false;
        }
        try
        {
            LoadEvent(tempData);
            return true;
        }
        catch
        {
            alert("無法解析暫存資料!");
            return false;
        }
    }
    const SaveFile = ()=>{
        const data = JSON.stringify(GenSaveData())
        const blob = new Blob([data], {type: 'text/plain'})
        var link = document.createElement("a");
        var url = window.URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "史萊姆傷害計算機紀錄.json");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    const LoadFile = (e)=>{
        if(e == null)
        {
            document.getElementById("fileUpload").click()
        }
        else
        {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            let reader = new FileReader();
            reader.onload = e => {
                isLoading.value = true;
                Apps.splice(0);
                setTimeout(()=>{
                    LoadEvent(e.target.result);
                    document.getElementById("fileUpload").value = "";
                    isLoading.value = false;
                    alert("套用成功!");
                }, 1000)
            };
            reader.readAsText(files[0]);
        }
    }
    LoadSource();
</script>
<template>
    <div style="width:1440px">
        <span>
            <button @click="Save()">保存</button>
            <button @click="SaveFile()">下載</button>
            <span>
                <button @click="LoadFile()">上傳</button>
                <input id="fileUpload" ref="file" type="file" accept="application/json" hidden @change="LoadFile" />
            </span>
        </span>
        <Dialog :show="showDialog" :confirm="SaveDialogEvent" :name="DialogName" />
        <loading :active.sync="isLoading"></loading>
        <tabs :selectedIndex="SelectedIndex" :tabs="Apps" :addTab="addTab" :renameTab="renameTab" :selectTab="selectTab">
            <tab v-for="(app, index) in Apps" :key="index">
                <App :source="app.data" :extendsetting="app.extendSetting" :options="app.options" v-if="app.id == SelectedIndex" />
            </tab>
        </tabs>
    </div>
</template>