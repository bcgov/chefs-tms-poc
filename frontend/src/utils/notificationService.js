import { reactive } from 'vue';

const state = reactive({
  notifications: [],
});

/**
 * Adds a new notification to the state.
 * @param {string} message - The message to display in the notification.
 * @param {string} [type='success'] - The type of notification ('success', 'error', 'info', etc.).
 */
const addNotification = (message, type = 'success') => {
  const id = Date.now();
  state.notifications.push({ id, message, type });
  setTimeout(() => {
    removeNotification(id);
  }, 3000);
};

/**
 * Removes a notification from the state by its ID.
 * @param {number} id - The ID of the notification to remove.
 */
const removeNotification = (id) => {
  const index = state.notifications.findIndex(
    (notification) => notification.id === id,
  );
  if (index !== -1) {
    state.notifications.splice(index, 1);
  }
};

export default {
  state,
  addNotification,
  removeNotification,
};
