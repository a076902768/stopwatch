<template>
  <div class="timer-container">
    <div class="prograss-container">
      <a-progress
        :percent="prograssPercent"
        :format="() => prograssFormat"
        type="circle"
      />
      <a-button-group>
        <a-button :size="'small'" @click="startCount">start</a-button>
        <a-button :size="'small'" @click="clearCount">stop</a-button>
        <a-button :size="'small'" @click="reloadCount">reload</a-button>
      </a-button-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    timer: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      time: {},
      countTimer: null
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
    }
  },
  mounted() {
    const vm = this;
    vm.time = { ...vm.timer };
    console.log(vm.time);
    console.log(vm.prograssPercent);
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
          clearInterval(vm.countTimer);
        }
      }, 100);
    },
    clearCount() {
      const vm = this;
      clearInterval(vm.countTimer);
    },
    reloadCount() {
      const vm = this;
      clearInterval(vm.countTimer);
      vm.time = { ...vm.timer };
    }
  }
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
</style>
