const { RESTDataSource } = require('apollo-datasource-rest');

class KretaGlobal extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://kretaglobalmobileapi.ekreta.hu/api/v1';
  }

  willSendRequest(request) {
    request.headers.set('apiKey', process.env.KRETA_API_KEY);
  }

  async getInstitutes(query) {
    const institutes = await this.get(`/Institute`);
    const regex = new RegExp(query, 'i');
    return institutes
      .filter(institute => institute.Name.search(regex) !== -1)
      .slice(0, 50);
  }
}

module.exports = KretaGlobal;
