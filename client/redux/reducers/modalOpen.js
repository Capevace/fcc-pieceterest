function modalOpen(state = false, action) {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return action.open;
    default:
      return state;
  }
}

export default modalOpen;
