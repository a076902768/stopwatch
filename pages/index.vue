<template>
  <div class="">
    <a-button @click="showAddModal = true">新增計時器</a-button>

    <div v-if="timerList.length">
      <div v-for="(timer, key) in timerList" :key="key" class="timer-list">
        <timer :timer="timer" />
      </div>
    </div>

    <a-modal
      v-model="showAddModal"
      title="新增計時器"
      @cancel="showAddModal = false"
      @ok="handleOk"
    >
      <a-input-number
        id="inputNumber"
        v-model="addForm.hours"
        :min="0"
        placeholder="時"
        @change="onChange"
      />
      <span>：</span>
      <a-input-number
        id="inputNumber"
        v-model="addForm.minutes"
        :min="0"
        :max="60"
        placeholder="分"
        @change="onChange"
      />
      <span>：</span>
      <a-input-number
        id="inputNumber"
        v-model="addForm.seconds"
        :min="0"
        :max="60"
        placeholder="秒"
        @change="onChange"
      />
    </a-modal>
  </div>
</template>

<script>
import Timer from "@/components/Timer";
export default {
  components: {
    Timer
  },
  data() {
    return {
      timerList: [],
      addForm: {
        hours: null,
        minutes: null,
        seconds: null
      },
      showAddModal: false
    };
  },
  methods: {
    onChange(value) {
      console.log("changed", value);
    },
    handleOk() {
      const vm = this;
      vm.timerList.push({
        ...vm.addForm
      });
      vm.clearAddModal();
      vm.showAddModal = false;
    },
    clearAddModal() {
      const vm = this;
      vm.addForm = {
        hours: null,
        minutes: null,
        seconds: null
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
