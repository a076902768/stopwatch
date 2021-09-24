<template>
  <div class="timer-container">
    <p
      v-text="
        timer.hours + '小時' + timer.minutes + '分' + timer.seconds + '秒'
      "
    />
    <div class="prograss-container">
      <a-progress
        :percent="prograssPercent"
        :format="() => prograssFormat"
        type="circle"
      />
    </div>
    <div class="button-container">
      <a-button-group>
        <a-button v-if="!countTimer" :size="'small'" @click="startCount">
          <a-icon type="caret-right" />
        </a-button>
        <a-button v-else :size="'small'" @click="clearInterval">
          <a-icon type="stop" />
        </a-button>
        <a-button :size="'small'" @click="reloadCount">
          <a-icon type="reload" />
        </a-button>
        <a-button :size="'small'" @click="deleteTimer">
          <a-icon type="delete" />
        </a-button>
      </a-button-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    timer: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      time: {},
      countTimer: null,
    };
  },
  computed: {
    prograssFormat() {
      return `${
        this.time.hours < 10 ? `0${this.time.hours}` : this.time.hours
      }：${
        this.time.minutes < 10 ? `0${this.time.minutes}` : this.time.minutes
      }：${
        this.time.seconds < 10 ? `0${this.time.seconds}` : this.time.seconds
      }`;
    },
    prograssPercent() {
      return (
        ((this.time.hours * 60 * 60 +
          this.time.minutes * 60 +
          this.time.seconds) /
          (this.timer.hours * 60 * 60 +
            this.timer.minutes * 60 +
            this.timer.seconds)) *
        100
      );
    },
  },
  watch: {
    timer: {
      handler() {
        const vm = this;
        vm.reloadCount();
      },
      immediate: true,
    },
  },
  methods: {
    startCount() {
      const vm = this;
      console.log(vm.time);
      vm.countTimer = setInterval(() => {
        if (vm.time.seconds !== 0) {
          vm.time.seconds -= 1;
        } else if (vm.time.seconds === 0 && vm.time.minutes !== 0) {
          vm.time.seconds = 59;
          vm.time.minutes -= 1;
        } else if (
          vm.time.seconds === 0 &&
          vm.time.minutes !== 0 &&
          vm.time.hours !== 0
        ) {
          vm.time.seconds = 59;
          vm.time.minutes -= 1;
          vm.time.hours -= 1;
        } else if (
          vm.time.seconds === 0 &&
          vm.time.minutes === 0 &&
          vm.time.hours !== 0
        ) {
          vm.time.seconds = 59;
          vm.time.minutes = 59;
          vm.time.hours -= 1;
        } else if (
          vm.time.seconds === 0 &&
          vm.time.minutes === 0 &&
          vm.time.hours === 0
        ) {
          new Notification("時間到!", {
            body: `共${vm.timer.hours}小時${vm.timer.minutes}分鐘${vm.timer.seconds}秒`,
            icon: "/static/icon.png",
          });
          vm.clearInterval();
        }
      }, 1000);
    },
    clearInterval() {
      const vm = this;
      clearInterval(vm.countTimer);
      vm.countTimer = null;
    },
    reloadCount() {
      const vm = this;
      vm.clearInterval();
      vm.time = { ...vm.timer };
    },
    deleteTimer() {
      const vm = this;
      vm.clearInterval();
      vm.$emit("deleteTimer", vm.timer.id);
    },
  },
};
</script>
<style lang="css" scoped>
.timer-container {
  position: relative;
  width: 200px;
  height: 200px;
  box-shadow: 1px 1px 1px 1px #333;
}

.prograss-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.button-container {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
