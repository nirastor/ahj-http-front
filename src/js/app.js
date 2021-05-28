import axios from 'axios';
import TicketDialog from './ticketDialog';
import DeleteDialog from './deleteDialog';

class App {
  constructor() {
    this.URL = 'https://ahj-http-backend-nirastor.herokuapp.com';
    this.appEl = document.querySelector('.app');
    this.tickedDialogEl = document.querySelector('.ticket-dialog');
    this.tickedDialog = new TicketDialog(
      this.tickedDialogEl,
      this.URL,
      this.addTicket.bind(this),
      this.editTicket.bind(this),
    );
    this.deleteDialogEl = document.querySelector('.delete-dialog');
    this.deleteDialog = new DeleteDialog(
      this.deleteDialogEl,
      this.removeItemById.bind(this),
    );
    this.colEl = null;
    this.tickets = [];
  }

  init() {
    this.colEl = document.createElement('div');
    this.colEl.classList.add('column');
    this.appEl.appendChild(this.colEl);

    this.colEl.innerHTML = `
      <button type="button" class="add-button">Добавить тикет</button>
      <ul class="list"></ul>
    `;

    this.initListeners();
    this.tickedDialog.init();
    this.deleteDialog.init();
    this.drawTickets();
  }

  initListeners() {
    const button = this.colEl.querySelector('.add-button');
    button.addEventListener('click', () => {
      this.tickedDialog.setAdd();
      this.tickedDialog.show();
    });
  }

  removeItemById(id) {
    axios.delete(`${this.URL}/deleteTicketById?id=${id}`).then(() => {
      this.drawTickets();
    });
  }

  changeStatusById(id) {
    const { status } = this.tickets.find((o) => o.id === id);
    axios.post(`${this.URL}/updateTicket?id=${id}&status=${(!status).toString()}`).then(() => {
      this.drawTickets();
    });
  }

  addTicket({ name, description }) {
    axios.post(`${this.URL}/newPost?name=${name}&description=${description}`).then(() => {
      this.drawTickets();
    });
  }

  editTicket({ id, name, description }) {
    axios.post(`${this.URL}/editTicket?id=${id}&name=${name}&description=${description}`).then(() => {
      this.drawTickets();
    });
  }

  drawTickets() {
    axios.get(`${this.URL}/allTickets`).then((res) => {
      this.tickets = res.data;
      this.drawTicketsHTML();
    });
  }

  drawTicketsHTML() {
    const list = this.colEl.querySelector('.list');
    list.innerHTML = '';
    const taskTemplate = document.querySelector('.task-template');

    this.tickets.forEach((t) => {
      const taskEl = taskTemplate.cloneNode(true);
      taskEl.classList.add('task');
      taskEl.classList.remove('task-template');
      if (t.status) {
        taskEl.querySelector('.task-status').classList.add('task-satus-done');
      }
      taskEl.querySelector('.task-short-name').innerText = t.name;
      taskEl.querySelector('.task-datetime').innerText = (new Date(t.created)).toLocaleDateString();

      taskEl.querySelector('.button-task-edit').addEventListener('click', () => {
        this.tickedDialog.setEdit(t);
        this.tickedDialog.show();
      });

      taskEl.querySelector('.button-task-delete').addEventListener('click', () => {
        this.deleteDialog.setId(t.id);
        this.deleteDialog.show();
      });

      taskEl.querySelector('.task-status').addEventListener('click', () => {
        this.changeStatusById(t.id);
      });

      taskEl.addEventListener('click', (e) => {
        if (Array.from(e.target.classList).includes('task-control')) return;

        const description = taskEl.querySelector('.task-description');
        if (Array.from(description.classList).includes('display-none')) {
          this.showDescription(description, t.id);
        } else {
          description.classList.add('display-none');
        }
      });

      list.appendChild(taskEl);
    });
  }

  showDescription(el, id) {
    axios.get(`${this.URL}/ticketById?id=${id}`).then((res) => {
      // eslint-disable-next-line no-param-reassign
      el.innerText = res.data.description;
      el.classList.remove('display-none');
    });
  }
}

const app = new App();
app.init();
