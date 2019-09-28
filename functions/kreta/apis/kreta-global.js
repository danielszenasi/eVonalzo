const { RESTDataSource } = require('apollo-datasource-rest');

class KretaGlobal extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://kretaglobalmobileapi.ekreta.hu/api/v1';
  }

  willSendRequest(request) {
    request.headers.set('apiKey', '7856d350-1fda-45f5-822d-e1a2f3f1acf0');
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
