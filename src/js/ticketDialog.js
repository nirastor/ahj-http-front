import axios from 'axios';

export default class ticketDialog {
  constructor(el, url, addCallback, editCallback) {
    this.el = el;
    this.URL = url;
    this.add = addCallback;
    this.edit = editCallback;
    this.action = 'edit';
    this.id = null;
  }

  setEdit({ id, name }) {
    axios.get(`${this.URL}/ticketById?id=${id}`).then((res) => {
      this.action = 'edit';
      this.id = id;
      this.el.querySelector('#short-description').value = name;
      this.el.querySelector('#description').value = res.data.description;
    });
  }

  setAdd() {
    this.action = 'add';
  }

  init() {
    const cancelButton = this.el.querySelector('.ticked-dialog-cancel');
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.hide();
    });

    const confirmButton = this.el.querySelector('.ticked-dialog-confirm');
    confirmButton.addEventListener('click', (e) => {
      e.preventDefault();
      const name = this.el.querySelector('#short-description').value.trim();
      const description = this.el.querySelector('#description').value.trim();
      if (!name || !description) return;
      const newTicket = {
        id: this.id,
        name,
        description,
      };
      this[this.action](newTicket);
      this.el.querySelector('#short-description').value = '';
      this.el.querySelector('#description').value = '';
      this.hide();
    });
  }

  show() {
    this.el.classList.remove('display-none');
  }

  hide() {
    this.el.classList.add('display-none');
  }
}
