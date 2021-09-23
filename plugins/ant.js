import Vue from "vue";
import { Button, InputNumber, Modal, Progress, message, Icon } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.use(Button);
Vue.use(InputNumber);
Vue.use(Modal);
Vue.use(Progress);
Vue.use(Icon);
Vue.prototype.$message = message
