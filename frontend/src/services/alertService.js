import { reactive } from 'vue';

const state = reactive({
  alerts: [],
});

const addAlert = (message, type = 'success') => {
  const id = Date.now();
  state.alerts.push({ id, message, type });
  setTimeout(() => {
    removeAlert(id);
  }, 3000);
};

const removeAlert = (id) => {
  const index = state.alerts.findIndex(alert => alert.id === id);
  if (index !== -1) {
    state.alerts.splice(index, 1);
  }
};

export default {
  state,
  addAlert,
  removeAlert,
};
