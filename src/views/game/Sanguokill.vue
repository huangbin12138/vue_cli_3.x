<template>
    <div class="err-code-body pb20 tal">
        <div class="pos t0 w100 search bsb">
            <input v-model="search" type="text" class="gl-input tac w100 bsb" placeholder="关键字搜索"/>
            <div class="flex jcb item title">
                <div class="flex-1 col" v-for="(col, ind) in listLabel" :key="ind">{{col.label}}</div>
            </div>
        </div>
        <div class="err-code">
            <div class="flex jcb item"
                 v-for="item in list" :key="item.code">
                <template v-for="(col, ind) in listLabel">
                    <textarea v-if="col.prop === 'desc'" class="flex-1 col textarea" :key="ind" v-model="item[col.prop]" :placeholder="col.label"></textarea>
                    <input v-else class="flex-1 col" :key="ind" v-model="item[col.prop]" :placeholder="col.label">
                </template>
            </div>
            <div class="flex jcb item">
                <template v-for="(col, ind) in listLabel">
                    <textarea v-if="col.prop === 'desc'" class="flex-1 col textarea" :key="ind" v-model="addItem[col.prop]" :placeholder="col.label"></textarea>
                    <input v-else class="flex-1 col" :key="ind" v-model="addItem[col.prop]" :placeholder="col.label">
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "Sanguokill",
        computed: {
            ...mapGetters(['sanGuoKillList']),
        },
        data() {
            return {
                search: '',
                addItem: {},
                list: [],
                listLabel: [
                    {label: '角色名称', prop: 'pname'},
                    {label: '技能名称', prop: 'name'},
                    {label: '技能说明', prop: 'desc'},
                    {label: '红色链', prop: 'red'},
                    {label: '绿色链', prop: 'green'},
                    {label: '蓝色链', prop: 'blue'},
                    {label: '黄色链', prop: 'yellow'},
                ],
            }
        },
        watch: {
            search(val) {
                if (val) {
                    this.list = this.sanGuoKillList.filter(item => Object.values(item).join(',$,$,').indexOf(val) > -1);
                } else {
                    this.list = [...this.allList];
                }
            },
        },
        created() {
            this.initAdd();
            this.list = [...this.sanGuoKillList];
        },
        methods: {
            ...mapMutations(['setSanGuoKillList']),
            initAdd() {
                let obj = {};
                this.listLabel.map(e => obj[e.label] = '');
                this.addItem = obj;
            },
        },
    }
</script>

<style scoped lang="less">
    .search {
        margin: 2rem 0 0;
        padding: .5rem;
        background-color: rgba(255, 255, 255, .7);
        border-bottom: .06rem #f5f5f5 solid;
    }

    .textarea {
        height: 3.5rem;
        resize: none;
    }

    .err-code {
        padding: .5rem;
        font-size: 1rem;
        line-height: 2;
        box-shadow: .1rem .1rem .2rem #aaa;
    }

    .item {
        align-items: center;
        padding: 0 10px;
        background-color: #fff;

        &:nth-child(2n) {
            background-color: #f5f5f5;
        }
    }
</style>