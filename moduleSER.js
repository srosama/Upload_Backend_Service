class ModelSER {
  constructor(client) {
    this.client = client;
  }

  async add_names(name) {
    try {
      // Ensure the client is connected before executing queries
      if (!this.client._connected) {
        await this.client.connect();
      }

      const query = {
        text: 'INSERT INTO user_name (name) VALUES ($1)',
        values: [name]
      };
      const result = await this.client.query(query);
      console.log('Name added successfully:', result);
      return result;
    }

    catch (error) {
      console.error('Error adding name:', error);
    }
  }


  async get_names() {
    try {
      // Ensure the client is connected before executing queries
      if (!this.client._connected) {
        await this.client.connect();
      }

      const query = {
        text: 'SELECT * FROM user_name ORDER BY user_name.idn DESC LIMIT 1;'
      };
      const result = await this.client.query(query);
      console.log('Names retrieved:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error retrieving names:', error);
      throw error; // Rethrow the error to handle it in the server function
    }
  }
}

module.exports = { ModelSER };
