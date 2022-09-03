<script setup>
  import { ref } from "vue";
  import axios from 'axios'
  import {reactive} from "@vue/reactivity";
  import { HyperFormula } from 'hyperformula';
  const props = defineProps({
    source: Array
  });
  const Table = props.source;
  const Options = reactive([]);
  const extendSetting = reactive([
    {
      show:false,
      name:"計算抵抗"
    },
    {
      show:true,
      name:"計算弱點"
    },
    {
      show:false,
      name:"計算Combo4"
    },
    {
      show:false,
      name:"計算Combo5"
    },
    {
      show:false,
      name:"計算Combo6"
    }
  ]);
  const GetOption = () => {
    if(Options.length == 0 && Table.length > 0)
    {
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
    }
    return Options;
  }
  const GetSelf = () => {
    var result = [];
    if(Table.length > 0)
    {
      for(var row=0; row < 13; row++)
      {
        result.push(row);
      }
    }
    return result;
  }
  const GetEnemy = () => {
    var result = [];
    if(Table.length > 0)
    {
      for(var row=0; row < 6; row++)
      {
        result.push(row);
      }
    }
    return result;
  }
  const ShowReportData = () => {
    var result = [];
    Options.forEach((option, index)=>{
      if(option.show)
      {
      result.push({
        name: option.name,
        index: index
      });
      }
    })
    return result;
  }

  const hfInstance = ref();;
  const CalculatorEvent = ()=>{
    hfInstance.value = HyperFormula.buildFromArray(Table,{
      licenseKey: "gpl-v3"
    });
  };
  const GetValue = (row, col) => {
    if(hfInstance.value == null)
    {
      return 0;
    }
    return hfInstance.value.getCellValue({col: col, row: row, sheet:0});
  }
</script>>

<template>
  <div class="wrapper">
    <div class="self">
      <p>己方數值</p>
      <p v-for="(data, index) in GetSelf()" :key="index">
        {{Table[data][0]}}<input type="number" v-model="Table[data][1]" />
      </p>
      <table class="fl-table">
        <thead>
          <th></th>
          <th>抵抗</th>
          <th>常態</th>
          <th>弱點</th>
        </thead>
        <tbody>
          <td>技能直傷</td>
          <td>{{GetValue(12, 3)}}</td>
          <td>{{GetValue(12, 4)}}</td>
          <td>{{GetValue(12, 5)}}</td>
        </tbody>
      </table>

    </div>
    <div class="enemy">
      <p>敵方數值</p>
      <p v-for="(data, index) in GetEnemy()" :key="index">
        {{Table[data][2]}}<input type="number" v-model="Table[data][3]" />
      </p>
      <span><button @click="CalculatorEvent()">計算</button></span>
    </div>
    <div class="options">
        <p v-for="(item, index) in extendSetting" :key="index">
          <input type="checkbox" v-model="item.show" :id="item.name" /><label :for="item.name">{{item.name}}</label>
        </p>
        <p v-for="(item, index) in GetOption()" :key="index">
          <input type="checkbox" v-model="item.show" :id="item.name" /><label :for="item.name">{{item.name}}</label>
        </p>
    </div>
    <div class="report">
      <table class="fl-table">
        <thead>
          <th width="133px">傷害類型</th>
          <th v-if="extendSetting[0].show">普攻傷害(抵抗)</th>
          <th>普攻傷害</th>
          <th v-if="extendSetting[1].show">普攻傷害(弱點)</th>
          <th v-if="extendSetting[0].show">奧義傷害(抵抗)</th>
          <th>奧義傷害</th>
          <th v-if="extendSetting[1].show">奧義傷害(弱點)</th>
          <th v-if="extendSetting[0].show && extendSetting[2].show">4C傷害(抵抗)</th>
          <th v-if="extendSetting[2].show">4C傷害</th>
          <th v-if="extendSetting[1].show && extendSetting[2].show">4C傷害(弱點)</th>
          <th v-if="extendSetting[0].show && extendSetting[3].show">5C傷害(抵抗)</th>
          <th v-if="extendSetting[3].show">5C傷害</th>
          <th v-if="extendSetting[1].show && extendSetting[3].show">5C傷害(弱點)</th>
          <th v-if="extendSetting[0].show && extendSetting[4].show">6C傷害(抵抗)</th>
          <th v-if="extendSetting[4].show">6C傷害</th>
          <th v-if="extendSetting[1].show && extendSetting[4].show">6C傷害(弱點)</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in ShowReportData()" :key="index" >
            <td>{{item.name}}</td>
            <td v-if="extendSetting[0].show">{{GetValue(item.index+14, 1)}}</td>
            <td>{{GetValue(item.index + 14, 2)}}</td>
            <td v-if="extendSetting[1].show">{{GetValue(item.index + 14, 3)}}</td>
            <td v-if="extendSetting[0].show">{{GetValue(item.index + 14, 4)}}</td>
            <td>{{GetValue(item.index + 14, 5)}}</td>
            <td v-if="extendSetting[1].show">{{GetValue(item.index + 14, 6)}}</td>
            <td v-if="extendSetting[0].show && extendSetting[2].show">{{GetValue(item.index + 14, 7)}}</td>
            <td v-if="extendSetting[2].show">{{GetValue(item.index + 14, 8)}}</td>
            <td v-if="extendSetting[1].show && extendSetting[2].show">{{GetValue(item.index + 14, 9)}}</td>
            <td v-if="extendSetting[0].show && extendSetting[3].show">{{GetValue(item.index + 14, 10)}}</td>
            <td v-if="extendSetting[3].show">{{GetValue(item.index + 14, 11)}}</td>
            <td v-if="extendSetting[1].show && extendSetting[3].show">{{GetValue(item.index + 14, 12)}}</td>
            <td v-if="extendSetting[0].show && extendSetting[4].show">{{GetValue(item.index + 14, 13)}}</td>
            <td v-if="extendSetting[4].show">{{GetValue(item.index + 14, 14)}}</td>
            <td v-if="extendSetting[1].show && extendSetting[4].show">{{GetValue(item.index + 14, 15)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
  div{
    text-align: left;
    overflow-y: auto;
  }

  .wrapper {
    width: 1400px;
    height: 800px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
  }
  .self{
    grid-column: 1;
    grid-row: 1;
  }
  .enemy{
    grid-column: 2;
    grid-row: 1;
  }
  
  .options{
    grid-column: 3;
    grid-row: 1;
  }
  .report{
    grid-column: 1 / 4;
    grid-row: 2;
  }
    
  .fl-table {
      border-radius: 5px;
      font-size: 12px;
      font-weight: normal;
      border: none;
      border-collapse: collapse;
      width: 100%;
      max-width: 100%;
      white-space: nowrap;
      background-color: white;
  }

  .fl-table td, .fl-table th {
      text-align: center;
      padding: 8px;
  }

  .fl-table td {
      border-right: 1px solid #f8f8f8;
      font-size: 12px;
  }

  .fl-table thead th {
      color: #ffffff;
      background: #4FC3A1;
  }


  .fl-table thead th:nth-child(odd) {
      color: #ffffff;
      background: #324960;
  }

  .fl-table tr:nth-child(even) {
      background: #F8F8F8;
  }

  /* Responsive */

  @media (max-width: 767px) {
    .fl-table {
        display: block;
        width: 100%;
    }
    .table-wrapper:before{
        content: "Scroll horizontally >";
        display: block;
        text-align: right;
        font-size: 11px;
        color: white;
        padding: 0 0 10px;
    }
    .fl-table thead, .fl-table tbody, .fl-table thead th {
        display: block;
    }
    .fl-table thead th:last-child{
        border-bottom: none;
    }
    .fl-table thead {
        float: left;
    }
    .fl-table tbody {
        width: auto;
        position: relative;
        overflow-x: auto;
    }
    .fl-table td, .fl-table th {
        padding: 20px .625em .625em .625em;
        height: 60px;
        vertical-align: middle;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        width: 120px;
        font-size: 13px;
        text-overflow: ellipsis;
    }
    .fl-table thead th {
        text-align: left;
        border-bottom: 1px solid #f7f7f9;
    }
    .fl-table tbody tr {
        display: table-cell;
    }
    .fl-table tbody tr:nth-child(odd) {
        background: none;
    }
    .fl-table tr:nth-child(even) {
        background: transparent;
    }
    .fl-table tr td:nth-child(odd) {
        background: #F8F8F8;
        border-right: 1px solid #E6E4E4;
    }
    .fl-table tr td:nth-child(even) {
        border-right: 1px solid #E6E4E4;
    }
    .fl-table tbody td {
        display: block;
        text-align: center;
    }
  }

</style>
