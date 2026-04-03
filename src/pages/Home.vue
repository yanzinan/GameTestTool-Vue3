<template>
  <div class="home">
    <n-grid x-gap="12" :cols="1">
        <n-gi>
            <n-alert title="alert" type="info">
                当前版本号：1.0.0<br>
                若需要重新测试，请点击浏览器的刷新按钮，刷新页面即可重新开始
            </n-alert>
        </n-gi>
    </n-grid>

    <n-space vertical style="margin-top:30px">
        <!-- 获取Slots按钮 -->
        <n-grid x-gap="12" y-gap="12" :cols="4">
            <n-gi>
                <n-card title="" hoverable class="cardHeight">
                    <n-space vertical>
                        <n-input type="text" v-model:value="playerName" placeholder="" clearable :disabled="active"/>
                        <n-select v-model:value="Difficulty" :options="DifficultyOptions" placeholder="选择游戏难度" :disabled="active"/>
                        <n-button type="info" style="width:100%" @click="getSlots" :disabled="slotsDisabled">Slots初始化</n-button>
                        <n-card title="">
                            用来初始化init事件所需的3个剧情倾向关键词
                        </n-card>
                    </n-space>
                </n-card>
            </n-gi>
            <n-gi>
                <n-card title="" hoverable class="cardHeight" v-if="globalStore.slotsInit">
                    <n-space vertical>
                        <n-card title="" class="slotsHeight">
                            event:{{globalStore.slotsInit.event}} <br>
                            tone_bias:{{globalStore.slotsInit.slots.tone_bias}} <br>
                            theme_bias:{{globalStore.slotsInit.slots.theme_bias}} <br>
                            npc_bias:{{globalStore.slotsInit.slots.npc_bias}} <br>
                        </n-card>
                        <n-card title="">
                            event:偏向初始化后的第一个事件建议<br>
                            tone_bias:偏好氛围<br>
                            theme_bias:偏好主题<br>
                            npc_bias:偏好 NPC 原型
                        </n-card>
                        <n-button type="info" style="width:100%" @click="requestInit" :disabled="requestInitDisabled">开局</n-button>
                        <n-card title="" v-if="countShow">
                            倒计时：{{count >= globalStore.hard_limit_seconds ? '0' : globalStore.hard_limit_seconds - count}}秒
                        </n-card>
                        
                    </n-space>
                </n-card>
            </n-gi>
            <n-gi v-for="(item,index) in loopData" :key="item.event.second">
                <n-card title="" hoverable class="cardHeight">
                    <n-space vertical>
                        <n-alert type="info">
                            <template v-if="item.event.type == 'end' ">
                                当前事件类型{{item.event.type}} <br> 
                                该事件请求用时{{item.event.second}}秒 <br>
                                本局loading等待时长{{loadingCount}}秒 <br>
                                {{item.event.endType}}
                            </template>
                            <template v-else>
                                当前事件类型{{item.event.type}}  该事件请求用时{{item.event.second}}秒
                            </template>
                        </n-alert>
                        <n-card
                            title=""
                            content-scrollable
                            :style="{'max-height':item.event.type == 'end' ? '250px' : item.event.type == 'combat' ?'210px' : '150px'}"
                            segmented
                        >
                            事件说明:
                            <!-- title -->
                            <div class="storyTitle">{{item.ai_state.title}}</div>
                            <!-- 故事剧情 -->
                            <template v-if="item.event.type == 'init' ">
                                {{item.ai_state.memory_summary}}<br>
                                {{item.payload.mainline.premise}}<br>
                                {{item.payload.mainline.primary_goal}}<br>
                                {{item.payload.mainline.stakes}}<br>
                                {{item.payload.opening.scene}}<br>
                            </template>
                            <template v-if="item.event.type == 'decision' ">
                                {{item.ai_state.memory_summary}}<br>
                                {{item.payload.result.outcome}}<br>
                                {{item.payload.scene.summary}}<br>
                            </template>
                            <template v-if="item.event.type == 'puzzle' ">
                                {{item.ai_state.memory_summary}}<br>
                                {{item.payload.puzzle ? item.payload.puzzle.riddle : ''}}<br>
                                {{item.payload.puzzle ? item.payload.puzzle.key_fact : ''}}<br>
                                {{item.payload.result.consequence}}<br>
                                {{item.payload.scene.summary}}<br>
                            </template>
                            <template v-if="item.event.type == 'combat' ">
                                {{item.ai_state.memory_summary}}<br>
                                {{item.payload.result.player_action}}<br>
                                {{item.payload.result.enemy_action}}<br>
                                {{item.payload.result.outcome}}<br>
                                {{item.payload.scene.summary}}<br>
                            </template>
                            <template v-if="item.event.type == 'end' ">
                                {{item.payload.novel_summary.story_overview}}<br>
                                {{item.payload.novel_summary.player_journey}}<br>
                                {{item.payload.novel_summary.final_outcome}}<br>
                            </template>
            
                        </n-card>
                        <!-- npc对话 -->
                        <n-card
                            title=""
                            content-scrollable
                            style="max-height: 80px"
                            segmented
                            v-if="item.event.type != 'combat' && item.event.type != 'end'"
                        >
                            NPC讲解：<br>
                            <template v-if="item.event.type == 'init' ">
                                {{item.payload.opening.npc_line}}
                            </template>
                            <template v-if="item.event.type == 'decision' || item.event.type == 'puzzle' ">
                                {{item.payload.scene.npc_line}}
                            </template>
                        </n-card>
                        <n-button :type="items.buttonType" style="width:100%" v-for="items in item.payload.options" :key="items.id" @click="selectOptions(items.id,items.text,item.routing.next_event_type,index,items)" :disabled="items.disabled">
                            {{items.text}}
                        </n-button>
                        <n-button type="info" style="width:100%" v-if="item.event.type == 'end' " @click="GenerateNovel(item.payload.novel_summary)" :disabled="GenerateNovelDisabled">
                            生成微小说
                        </n-button>
                        
                    </n-space>
                </n-card>
            </n-gi>
            <n-gi v-if="novelData.title">
                <n-card :title="novelData.title" hoverable class="cardHeight" content-scrollable>
                    {{novelData.content}}
                </n-card>
            </n-gi>
            
        </n-grid>
        
    </n-space>
    
  </div>

</template>

<script setup>
import { useGlobalStore } from '../store'
import { request } from '../api/request'
import { useDialog } from "naive-ui";
import { ref, onUnmounted } from "vue";

const globalStore = useGlobalStore()

const dialog = useDialog();
// 玩家姓名
const playerName = ref('小燕')
// 游戏难度
const Difficulty = ref(null)
const DifficultyOptions = [
    {
        label: "简单模式",
        value: "EASY"
    },
    {
        label: "普通模式",
        value: "NORMAL"
    },
    {
        label: "困难模式",
        value: "HARD"
    },
]

// 是否禁用
const active = ref(false)

// 游戏计时秒数
const count = ref(0)
// 定时器实例（用于清除）
let timer = null
// 计时停止状态
const isTimerStopped = ref(false)

// LOOP事件数据保存
const loopData = ref([])

// 游戏事件入参暂存
const current_scene_summary = ref('');
const available_options = ref([]);
const state_flags = ref({})
const history_events = ref([])

const novelData = ref({})

const loadingCount = ref(0)

// slots按钮禁用
const slotsDisabled = ref(false)
// 开局按钮禁用
const requestInitDisabled = ref(false)
// 生成微小说按钮禁用
const GenerateNovelDisabled = ref(false)

// 展示倒计时
const countShow = ref(false)
// 生成游戏id
/**
 * 生成8位纯数字随机ID
 * @returns {string} 8位数字字符串（避免前导0，保证8位长度）
 */
const generate8DigitNumberID = () => {
    // 生成 10000000 ~ 99999999 之间的随机整数
    const min = 10000000;
    const max = 99999999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    globalStore.setGameId(randomNum.toString())
}


// 发送请求 获取slots
const getSlots = async () => {
  try {
    const res = await request.post('event-init',{})
    // 存储到全局
    globalStore.setSlots(res.data)
    globalStore.setGameDifficulty(Difficulty.value)
    // 生成游戏id
    generate8DigitNumberID()
    // 按钮设置为不可操作
    active.value = true
    // 按钮禁用
    slotsDisabled.value = true;
  } catch (err) {
    dialog.warning({
        title: "网络错误",
        content: "当前网络拥挤，请求失败，您可以选择重新请求。",
        positiveText: "重新请求",
        negativeText: "关闭",
        draggable: true,
        onPositiveClick: () => {
            getSlots()
        },
        onNegativeClick: () => {
            
        }
    });
  }
}

const startTimer = () => {
  // 已经达到300秒 或 已有定时器 → 不执行
  if (isTimerStopped.value || timer) return

  timer = setInterval(() => {
    count.value++
    // 达到300秒销毁
    if (count.value >= globalStore.hard_limit_seconds) {
      clearInterval(timer)
      timer = null
      isTimerStopped.value = true
      console.log('✅ 300秒到，定时器销毁')
      history_events.value.push({
        "event_type": "timeout",
        "scene_summary": "任务时间结束",
        "selected_option_text": "",
        "result_summary": "任务时间结束，任务失败，玩家强制下线(死亡)"
      })
      requestEnd('','','时间到了，游戏结束！',loopData.value.length - 1)
    }
  }, 1000)
}

// 暂停定时器（不清空计数，只暂停）
const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    console.log('⏸ 接口请求中，定时器暂停')
  }
}


// 发起init事件
const requestInit = async () => {
    // 接口等待计时
    let eventCount = 0
    let eventTimer = setInterval(() => {
        eventCount++
    }, 1000) // 1000ms = 1秒
    // 启动游戏计时
    countShow.value = true
    startTimer()
    try{
        let paramIn = {
            "event": {
                "type": "init"
            },
            "session": {
                "session_id": "session_" + globalStore.id,
                "player_count": 1,
                "difficulty": globalStore.difficulty
            },
            "time": {
                "hard_limit_seconds": globalStore.hard_limit_seconds,
                "elapsed_active_seconds": count.value,
                "remaining_seconds": globalStore.hard_limit_seconds - count.value
            },
            "seed": {
                "run_seed": "run_" + globalStore.id
            },
            "constraints": {
                "language": "cn",
                "content_rating": "PG",
                "max_chars_scene": 220,
                "max_chars_option": 14,
                "forbidden_terms": ["骰子", "扑克", "点数", "规则"]
            },
            "slots": {
                "tone_bias": globalStore.slotsInit.slots.tone_bias,
                "theme_bias": globalStore.slotsInit.slots.theme_bias,
                "npc_bias": globalStore.slotsInit.slots.npc_bias
            },
            "client_context": {
                "platform": "miniprogram",
                "locale": "zh-CN"
            },
            "payload": {},
            "context": {}
        }
        // 游戏计时停止
        stopTimer()
        const res = await request.post('invoke',paramIn)
        let data = res.data;
        data.payload.options = data.payload.options.map(item => ({
            ...item,
            disabled: false,
            buttonType:'info'
        }))
        data.event['second'] = eventCount;
        loopData.value.push(data)

        // 接口已返回 恢复游戏计时 销毁事件定时器
        startTimer()
        clearInterval(eventTimer)
        loadingCount.value += eventCount
        // 下一个事件的入参
        current_scene_summary.value = res.data.context.current_scene_summary ?? '';
        available_options.value = res.data.context.available_options ?? [];
        state_flags.value = Object.assign(state_flags.value, res.data.context.state_flags ?? {});
        history_events.value.push({
            "event_type": res.data.event.type,
            "scene_summary": res.data.payload.opening.scene,
            "selected_option_text": "",
            "result_summary": "你决定深入探索。"
        })
        // 按钮禁用
        requestInitDisabled.value = true
    } catch (err) {
        console.log(err)
        startTimer()
        clearInterval(eventTimer)
        dialog.warning({
            title: "网络错误",
            content: "当前网络拥挤，请求失败，您可以选择重新请求。",
            positiveText: "重新请求",
            negativeText: "关闭",
            draggable: true,
            onPositiveClick: () => {
                requestInit()
            },
            onNegativeClick: () => {
                
            }
        });
    }
}

// 选择行动方向
const selectOptions = (selectId,selectText,eventType,clickIndex,items) => {
    dialog.destroyAll()
    items.buttonType = 'primary'
    // 优先判断事件是否超出
    if(history_events.value.length >= globalStore.history_events_limit){
        history_events.value.push({
            "event_type": "enough",
            "scene_summary": "任务结束",
            "selected_option_text": "",
            "result_summary": "玩家在做任务时迷路了，找不到通关路线，强制下线(死亡)"
        })
      requestEnd('','','事件超出，游戏结束！',clickIndex)
      return false
    }
    // 判断接下来该走哪个事件流程
    if(eventType == 'decision'){
        requestDecision(selectId,selectText,eventType,clickIndex)
    }

    // 判断接下来该走哪个事件流程
    if(eventType == 'puzzle'){
        requestPuzzle(selectId,selectText,eventType,clickIndex)
    }

    // 判断接下来该走哪个事件流程
    if(eventType == 'combat'){
        requestCombat(selectId,selectText,eventType,clickIndex)
    }

    // 判断接下来该走哪个事件流程
    if(eventType == 'end'){
        requestEnd(selectId,selectText,'游戏结束！本局游戏结束类型为剧情主导。',clickIndex)
    }
}

// decision事件
const requestDecision = async (selectId,selectText,eventType,clickIndex) => {
    // 接口等待计时
    let eventCount = 0
    let eventTimer = setInterval(() => {
        eventCount++
    }, 1000) // 1000ms = 1秒
    try{
        let paramIn = {
            "event": {
                "type": "decision"
            },
            "session": {
                "session_id": "session_" + globalStore.id,
                "player_count": 1,
                "difficulty": globalStore.difficulty
            },
            "time": {
                "hard_limit_seconds": globalStore.hard_limit_seconds,
                "elapsed_active_seconds": count.value,
                "remaining_seconds": globalStore.hard_limit_seconds - count.value
            },
            "seed": {
                "run_seed": "run_" + globalStore.id
            },
            "constraints": {
                "language": "cn",
                "content_rating": "PG",
                "max_chars_scene": 220,
                "max_chars_option": 14,
                "forbidden_terms": ["骰子", "扑克", "点数", "规则"]
            },
            "slots": {
                "tone_bias": globalStore.slotsInit.slots.tone_bias,
                "theme_bias": globalStore.slotsInit.slots.theme_bias,
                "npc_bias": globalStore.slotsInit.slots.npc_bias
            },
            "client_context": {
                "platform": "miniprogram",
                "locale": "zh-CN"
            },
            "payload": {
                "selected_option_id": selectId
            },
            "context": {
                "current_scene_summary":current_scene_summary.value,
                "available_options":available_options.value,
                "state_flags":state_flags.value
            }
        }
        // 游戏计时停止
        stopTimer()
        const res = await request.post('invoke',paramIn)
        let data = res.data;
        data.payload.options = data.payload.options.map(item => ({
            ...item,
            disabled: false,
            buttonType:'info'
        }))
        data.event['second'] = eventCount;
        loopData.value.push(data)

        // 把上一个事件按钮禁掉
        loopData.value[clickIndex].payload.options = loopData.value[clickIndex].payload.options.map(item => ({
            ...item,
            disabled: true
        }))

        // 接口已返回 恢复游戏计时 销毁事件定时器
        startTimer()
        clearInterval(eventTimer)
        loadingCount.value += eventCount
        // 下一个事件的入参
        current_scene_summary.value = res.data.context.current_scene_summary ?? '';
        available_options.value = res.data.context.available_options ?? [];
        state_flags.value = Object.assign(state_flags.value, res.data.context.state_flags ?? {});
        history_events.value.push({
            "event_type": res.data.event.type,
            "scene_summary": res.data.payload.scene.summary,
            "selected_option_text": res.data.payload.decision.selected_option_text,
            "result_summary": res.data.payload.result.outcome
        })
    } catch (err) {
        console.log(err)
        startTimer()
        clearInterval(eventTimer)
        dialog.warning({
            title: "网络错误",
            content: "当前网络拥挤，请求失败，您可以选择重新请求。",
            positiveText: "重新请求",
            negativeText: "关闭",
            draggable: true,
            onPositiveClick: () => {
                requestDecision(selectId,selectText,eventType,clickIndex)
            },
            onNegativeClick: () => {
                
            }
        });
    }
}

// puzzle事件
const requestPuzzle = async (selectId,selectText,eventType,clickIndex) => {
    // 接口等待计时
    let eventCount = 0
    let eventTimer = setInterval(() => {
        eventCount++
    }, 1000) // 1000ms = 1秒
    try{
        let paramIn = {
            "event": {
                "type": "puzzle"
            },
            "session": {
                "session_id": "session_" + globalStore.id,
                "player_count": 1,
                "difficulty": globalStore.difficulty
            },
            "time": {
                "hard_limit_seconds": globalStore.hard_limit_seconds,
                "elapsed_active_seconds": count.value,
                "remaining_seconds": globalStore.hard_limit_seconds - count.value
            },
            "seed": {
                "run_seed": "run_" + globalStore.id
            },
            "constraints": {
                "language": "cn",
                "content_rating": "PG",
                "max_chars_scene": 220,
                "max_chars_option": 14,
                "forbidden_terms": ["骰子", "扑克", "点数", "规则"]
            },
            "slots": {
                "tone_bias": globalStore.slotsInit.slots.tone_bias,
                "theme_bias": globalStore.slotsInit.slots.theme_bias,
                "npc_bias": globalStore.slotsInit.slots.npc_bias
            },
            "client_context": {
                "platform": "miniprogram",
                "locale": "zh-CN"
            },
            "payload": {
                "selected_option_id": selectId
            },
            "context": {
                "current_scene_summary":current_scene_summary.value,
                "available_options":available_options.value,
                "state_flags":state_flags.value
            }
        }
        // 游戏计时停止
        stopTimer()
        const res = await request.post('invoke',paramIn)
        let data = res.data;
        data.payload.options = data.payload.options.map(item => ({
            ...item,
            disabled: false,
            buttonType:'info'
        }))
        data.event['second'] = eventCount;
        loopData.value.push(data)

        // 把上一个事件按钮禁掉
        loopData.value[clickIndex].payload.options = loopData.value[clickIndex].payload.options.map(item => ({
            ...item,
            disabled: true
        }))

        // 接口已返回 恢复游戏计时 销毁事件定时器
        startTimer()
        clearInterval(eventTimer)
        loadingCount.value += eventCount
        // 下一个事件的入参
        current_scene_summary.value = res.data.context.current_scene_summary ?? '';
        available_options.value = res.data.context.available_options ?? [];
        state_flags.value = Object.assign(state_flags.value, res.data.context.state_flags ?? {});
        history_events.value.push({
            "event_type": res.data.event.type,
            "scene_summary": res.data.payload.scene.summary,
            "selected_option_text": res.data.payload.attempt.selected_option_text,
            "result_summary": res.data.payload.result.consequence
        })
    } catch (err) {
        console.log(err)
        startTimer()
        clearInterval(eventTimer)
        dialog.warning({
            title: "网络错误",
            content: "当前网络拥挤，请求失败，您可以选择重新请求。",
            positiveText: "重新请求",
            negativeText: "关闭",
            draggable: true,
            onPositiveClick: () => {
                requestPuzzle(selectId,selectText,eventType,clickIndex)
            },
            onNegativeClick: () => {
                
            }
        });
    }
}

// combat事件
const requestCombat = async (selectId,selectText,eventType,clickIndex) => {
    // 接口等待计时
    let eventCount = 0
    let eventTimer = setInterval(() => {
        eventCount++
    }, 1000) // 1000ms = 1秒
    try{
        let paramIn = {
            "event": {
                "type": "combat"
            },
            "session": {
                "session_id": "session_" + globalStore.id,
                "player_count": 1,
                "difficulty": globalStore.difficulty
            },
            "time": {
                "hard_limit_seconds": globalStore.hard_limit_seconds,
                "elapsed_active_seconds": count.value,
                "remaining_seconds": globalStore.hard_limit_seconds - count.value
            },
            "seed": {
                "run_seed": "run_" + globalStore.id
            },
            "constraints": {
                "language": "cn",
                "content_rating": "PG",
                "max_chars_scene": 220,
                "max_chars_option": 14,
                "forbidden_terms": ["骰子", "扑克", "点数", "规则"]
            },
            "slots": {
                "tone_bias": globalStore.slotsInit.slots.tone_bias,
                "theme_bias": globalStore.slotsInit.slots.theme_bias,
                "npc_bias": globalStore.slotsInit.slots.npc_bias
            },
            "client_context": {
                "platform": "miniprogram",
                "locale": "zh-CN"
            },
            "payload": {
                "selected_option_id": selectId
            },
            "context": {
                "current_scene_summary":current_scene_summary.value,
                "available_options":available_options.value,
                "state_flags":state_flags.value
            }
        }
        // 游戏计时停止
        stopTimer()
        const res = await request.post('invoke',paramIn)
        let data = res.data;
        data.payload.options = data.payload.options.map(item => ({
            ...item,
            disabled: false,
            buttonType:'info'
        }))
        data.event['second'] = eventCount;
        loopData.value.push(data)

        // 把上一个事件按钮禁掉
        loopData.value[clickIndex].payload.options = loopData.value[clickIndex].payload.options.map(item => ({
            ...item,
            disabled: true
        }))

        // 接口已返回 恢复游戏计时 销毁事件定时器
        startTimer()
        clearInterval(eventTimer)
        loadingCount.value += eventCount
        // 下一个事件的入参
        current_scene_summary.value = res.data.context.current_scene_summary ?? '';
        available_options.value = res.data.context.available_options ?? [];
        state_flags.value = Object.assign(state_flags.value, res.data.context.state_flags ?? {});
        history_events.value.push({
            "event_type": res.data.event.type,
            "scene_summary": res.data.payload.scene.summary,
            "selected_option_text": selectText,
            "result_summary": res.data.payload.result.outcome
        })
    } catch (err) {
        console.log(err)
        startTimer()
        clearInterval(eventTimer)
        dialog.warning({
            title: "网络错误",
            content: "当前网络拥挤，请求失败，您可以选择重新请求。",
            positiveText: "重新请求",
            negativeText: "关闭",
            draggable: true,
            onPositiveClick: () => {
                requestCombat(selectId,selectText,eventType,clickIndex)
            },
            onNegativeClick: () => {
                
            }
        });
    }
}

// end事件
const requestEnd = async (selectId,selectText,endType,clickIndex) => {
    // 接口等待计时
    let eventCount = 0
    let eventTimer = setInterval(() => {
        eventCount++
    }, 1000) // 1000ms = 1秒
    try{
        let paramIn = {
            "event": {
                "type": "end"
            },
            "session": {
                "session_id": "session_" + globalStore.id,
                "player_count": 1,
                "difficulty": globalStore.difficulty
            },
            "time": {
                "hard_limit_seconds": globalStore.hard_limit_seconds,
                "elapsed_active_seconds": count.value,
                "remaining_seconds": globalStore.hard_limit_seconds - count.value
            },
            "seed": {
                "run_seed": "run_" + globalStore.id
            },
            "constraints": {
                "language": "cn",
                "content_rating": "PG",
                "max_chars_scene": 220,
                "max_chars_option": 14,
                "forbidden_terms": ["骰子", "扑克", "点数", "规则"]
            },
            "slots": {
                "tone_bias": globalStore.slotsInit.slots.tone_bias,
                "theme_bias": globalStore.slotsInit.slots.theme_bias,
                "npc_bias": globalStore.slotsInit.slots.npc_bias
            },
            "client_context": {
                "platform": "miniprogram",
                "locale": "zh-CN"
            },
            "payload": {
                
            },
            "context": {
                "current_scene_summary":current_scene_summary.value,
                "state_flags":state_flags.value,
                "history_events":history_events.value
            }
        }
        // 游戏计时停止
        stopTimer()
        const res = await request.post('invoke',paramIn)
        let data = res.data;
        data.event['second'] = eventCount;
        data.event['endType'] = endType;
        loopData.value.push(data)

        // 接口已返回销毁事件定时器
        clearInterval(eventTimer)
        loadingCount.value += eventCount

        // 把上一个事件按钮禁掉
        loopData.value[clickIndex].payload.options = loopData.value[clickIndex].payload.options.map(item => ({
            ...item,
            disabled: true
        }))
        
    } catch (err) {
        console.log(err)
        clearInterval(eventTimer)
        dialog.warning({
            title: "网络错误",
            content: "当前网络拥挤，请求失败，您可以选择重新请求。",
            positiveText: "重新请求",
            negativeText: "关闭",
            draggable: true,
            onPositiveClick: () => {
                requestEnd(selectId,selectText,endType,clickIndex)
            },
            onNegativeClick: () => {
                
            }
        });
    }
}

// 生成微小说
const GenerateNovel = async(novel_summary) => {
    // 接口等待计时
    let eventCount = 0
    let eventTimer = setInterval(() => {
        eventCount++
    }, 1000) // 1000ms = 1秒
    try{
        let paramIn = {
            "player_name": playerName.value,
            "novel_summary": novel_summary
        }
        const res = await request.post('novel',paramIn)
        let data = res.data;
        data['second'] = eventCount;
        novelData.value = data;

        // 接口已返回 销毁事件定时器
        clearInterval(eventTimer)

        GenerateNovelDisabled.value = true
        
    } catch (err) {
        console.log(err)
        clearInterval(eventTimer)
        dialog.warning({
            title: "网络错误",
            content: "当前网络拥挤，请求失败，您可以选择重新请求。",
            positiveText: "重新请求",
            negativeText: "关闭",
            draggable: true,
            onPositiveClick: () => {
                GenerateNovel(novel_summary)
            },
            onNegativeClick: () => {
                
            }
        });
    }
}

// 组件卸载时清除定时器（防止内存泄漏）
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
    .home{
        padding: 20px;
    }

    .cardHeight{
        height: 500px;
    }

    .storyTitle{
        font-size: 14px;
        margin: 6px 0;
        font-weight: 600;
    }
</style>