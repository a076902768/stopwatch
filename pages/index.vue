<template>
  <div class="">
    <a-button type="primary" @click="showAddModal = true">新增計時器</a-button>

    <div v-if="timerList.length" class="timer-list">
      <div v-for="(timer, key) in timerList" :key="key">
        <timer :timer="timer" @deleteTimer="deleteTimer" />
      </div>
    </div>

    <a-modal
      v-model="showAddModal"
      title="新增計時器"
      centered
      @cancel="showAddModal = false"
      @ok="handleOk"
    >
      <a-input-number
        id="inputNumber"
        v-model="addForm.hours"
        :min="0"
        placeholder="時"
      />
      <span>：</span>
      <a-input-number
        id="inputNumber"
        v-model="addForm.minutes"
        :min="0"
        :max="60"
        placeholder="分"
      />
      <span>：</span>
      <a-input-number
        id="inputNumber"
        v-model="addForm.seconds"
        :min="0"
        :max="60"
        placeholder="秒"
      />
    </a-modal>
  </div>
</template>

<script>
import Timer from "@/components/Timer";
export default {
  components: {
    Timer,
  },
  data() {
    return {
      timerList: [],
      addForm: {
        id: null,
        hours: null,
        minutes: null,
        seconds: null,
      },
      showAddModal: false,
    };
  },
  mounted() {
    const vm = this;
    vm.getLocalTimerList();
  },
  methods: {
    getLocalTimerList() {
      const vm = this;
      const timerList = JSON.parse(window.localStorage.getItem("timerList"));
      if (!timerList) return;
      if (timerList.length) {
        vm.timerList = [...timerList];
      }
    },
    handleOk() {
      const vm = this;
      if (Object.keys(vm.addForm).every((key) => !vm.addForm[key])) {
        vm.$message.warning("請輸入時間");
        return;
      }
      const timerList = JSON.parse(window.localStorage.getItem("timerList"));
      if (timerList && timerList.length === 6) {
        vm.$message.warning("最多新增6個碼表");
        return;
      }
      Object.keys(vm.addForm).forEach((key) => {
        if (vm.addForm[key] === null && key !== "id") {
          vm.addForm[key] = 0;
        }
        if (key === "id") {
          vm.addForm[key] = new Date().getTime();
        }
      });
      vm.timerList.push({
        ...vm.addForm,
      });
      vm.clearAddModal();
      window.localStorage.setItem("timerList", JSON.stringify(vm.timerList));
      vm.showAddModal = false;
    },
    clearAddModal() {
      const vm = this;
      vm.addForm = {
        id: null,
        hours: null,
        minutes: null,
        seconds: null,
      };
    },
    deleteTimer(id) {
      console.log(id);
      const vm = this;
      vm.timerList = vm.timerList.filter((e) => e.id !== id);
      window.localStorage.setItem("timerList", JSON.stringify(vm.timerList));
    },
  },
};
</script>

<style lang="css" scoped>
.timer-list {
  display: grid;
  grid-template-columns: 200px 200px 200px;
  gap: 30px 30px;
  justify-content: center;
  margin-top: 30px;
}
</style>
