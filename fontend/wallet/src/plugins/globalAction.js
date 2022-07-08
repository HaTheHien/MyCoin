import EventBus, { ACTIONS } from './eventbus';

export const showSnackbar = message => {
  EventBus.$emit(ACTIONS.SNACKBAR, message);
};