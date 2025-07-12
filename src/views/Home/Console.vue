<template>
    <div class="console-container">
        <a-config-provider :locale="zhCN">
            <a-calendar v-model:value="value" @select="onSelect" @panelChange="onPanelChange">
                <template #dateCellRender="{ current }">
                    <ul class="events">
                        <li v-for="item in getListData(current)" :key="item.content">
                            <a-badge :status="item.type" :text="item.content" />
                        </li>
                    </ul>
                </template>
                <template #monthCellRender="{ current }">
                    <div v-if="getMonthData(current)" class="notes-month">
                        <section>{{ getMonthData(current) }}</section>
                        <span>Backlog number</span>
                    </div>
                </template>
            </a-calendar>
        </a-config-provider>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
dayjs.locale('zh-cn')
const value = ref<Dayjs>();

const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
        case 8:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
            ];
            break;
        case 10:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
                { type: 'error', content: 'This is error event.' },
            ];
            break;
        case 15:
            listData = [
                { type: 'warning', content: 'This is warning event' },
                { type: 'success', content: 'This is very long usual event。。....' },
                { type: 'error', content: 'This is error event 1.' },
                { type: 'error', content: 'This is error event 2.' },
                { type: 'error', content: 'This is error event 3.' },
                { type: 'error', content: 'This is error event 4.' },
            ];
            break;
        default:
    }
    return listData || [];
};

const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
        return 1394;
    }
};

type Info = {
    source: 'year' | 'month' | 'date' | 'customize';
};
const onSelect = (date: Dayjs, info: Info) => {
    // function(date: Dayjs, info: { source: 'year' | 'month' | 'date' | 'customize' })
    if (info.source === 'date') {
        console.log('Panel Select:', info.source);
    }
};

const onPanelChange = (date: Dayjs) => {
    // function(date: dayjs | string, mode: string)
    console.log('Panel Change:', date);
}
</script>

<style scoped>
.console-container {
    width: 100%;
    height: 100%;
    overflow: auto;
}

::v-deep(.ant-picker-calendar) {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.events {
    list-style: none;
    margin: 0;
    padding: 0;
}

.events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
}

.notes-month {
    text-align: center;
    font-size: 28px;
}

.notes-month section {
    font-size: 28px;
}
</style>
