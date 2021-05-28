export default class DeleteDialog {
  constructor(el, deleteCallback) {
    this.el = el;
    this.deleteCallback = deleteCallback;
    this.id = null;
  }

  init() {
    const cancelButton = this.el.querySelector('.delete-dialog-cancel');
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.hide();
    });

    const deleteButton = this.el.querySelector('.delete-dialog-confirm');
    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.deleteCallback(this.id);
      this.hide();
    });
  }

  setId(id) {
    this.id = id;
  }

  show() {
    this.el.classList.remove('display-none');
  }

  hide() {
    this.el.classList.add('display-none');
  }
}
