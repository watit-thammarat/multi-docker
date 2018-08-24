import React, { Component } from 'react';
import axios from 'axios';

export default class Fib extends Component {
  state = {
    seeIndexes: [],
    values: {},
    index: ''
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const { data } = await axios.get('/api/values/current');
    this.setState({ values: data });
  }

  async fetchIndexes() {
    const { data } = await axios.get('/api/values/all');
    this.setState({ seeIndexes: data });
  }

  onSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/values', { index: this.state.index });
    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    return this.state.seeIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key}, I calculated {this.state.values[key]}
        </div>
      );
    }
    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label>Enter your index:</label>
          <input
            type="text"
            value={this.state.index}
            onChange={e => this.setState({ index: e.target.value })}
          />
          <button>Submit</button>
        </form>
        <h3>Indexes I hanve seen:</h3>
        {this.renderSeenIndexes()}
        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}
