<template>
    <div class="tabs-component">
        <ul role="tablist" class="tabs-component-tabs">
            <li v-for="(tab,index) in tabs" :key="index" :class="{'is-active': tab.id===selectedIndex}" class="tabs-component-tab">
                <a @click="selectTab(tab.id)" class="tabs-component-tab-a">{{tab.name}}</a>
            </li>
            <li class="tabs-component-tab">
                <a @click="addTab()" class="tabs-component-tab-a">+</a>
            </li>
            <li class="tabs-component-tab">
                <a @click="renameTab()" class="tabs-component-tab-a">重新命名</a>
            </li>
        </ul>
        <div class="tab-component-panels">
            <slot />
        </div>
    </div>
</template>
<script>
export default {
    props: ['selectedIndex', 'tabs', 'selectTab', 'addTab', 'renameTab']
}
</script>
<style scoped>
    .tabs-component {
        margin: 4em 0;
    }

    .tabs-component-tabs {
        border: solid 1px #ddd;
        border-radius: 6px;
        list-style: none;
        margin-bottom: 5px;
    }

    @media (min-width: 700px) {
        .tabs-component-tabs {
            border: 0;
            align-items: stretch;
            display: flex;
            justify-content: flex-start;
            margin-bottom: -1px;
        }
    }

    .tabs-component-tab {
        color: #999;
        font-size: 14px;
        font-weight: 600;
        margin-right: 0;
    }

    .tabs-component-tab:not(:last-child) {
        border-bottom: dotted 1px #ddd;
    }

    .tabs-component-tab:hover {
        color: #666;
    }

    .tabs-component-tab.is-active {
        color: #000;
    }

    @media (min-width: 700px) {
        .tabs-component-tab {
            background-color: #fff;
            border: solid 1px #ddd;
            border-radius: 3px 3px 0 0;
            margin-right: .5em;
            transform: translateY(2px);
            transition: transform .3s ease;
        }

        .tabs-component-tab.is-active {
            border-bottom: solid 1px #fff;
            z-index: 2;
            transform: translateY(0);
        }
    }

    .tabs-component-tab-a {
        align-items: center;
        color: inherit;
        display: flex;
        padding: .75em 1em;
        text-decoration: none;
        cursor: pointer;
    }

    .tabs-component-panels {
        padding: 4em 0;
    }

    @media (min-width: 700px) {
        .tabs-component-panels {
            border-top-left-radius: 0;
            background-color: #fff;
            border: solid 1px #ddd;
            border-radius: 0 6px 6px 6px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .05);
            padding: 4em 2em;
        }
    }
</style>