const { RESTDataSource } = require('apollo-datasource-rest');

class Kreta extends RESTDataSource {
  constructor() {
    super();
  }

  get baseURL() {
    return `https://${this.context.instituteCode}.e-kreta.hu/mapi/api/v1`;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token);
  }

  async getStudent() {
    return this.get(`/Student`);
  }

  async getExams() {
    return this.get(`/BejelentettSzamonkeres`);
  }

  async getLessons() {
    return this.get(`/Lesson`, { fromDate: '2018-09-09', toDate: '2018-09-10' });
  }

  async getHomework(homeworkId) {
    return this.get(`/HaziFeladat/TanarHaziFeladat/${homeworkId}`);
  }

  async getStudentHomework(homeworkId) {
    return this.get(`/HaziFeladat/TanuloHaziFeladatLista/${homeworkId}`);
  }
}

module.exports = Kreta;
