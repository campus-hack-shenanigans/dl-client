import React from 'react';

import { SERVER_URL } from './config';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import InputRange, { Range } from 'react-input-range';

import 'react-input-range/lib/css/index.css';

interface State {
  showLyrics: boolean;
  poems: String[][];
  seedWord: string;
  temperature: number | Range;
  poemCount: number | null;
  style: Number;
}

export default class Main extends React.Component<{}, State> {

  constructor(props: React.Props<{}>) {
    super(props);

    this.state = {
      showLyrics: false,
      poems: [],
      seedWord: '',
      temperature: 50,
      poemCount: 1,
      style: 0,
    };

    this.changeSeedWord = this.changeSeedWord.bind(this);
    this.changePoemCount = this.changePoemCount.bind(this);
    this.fetchPoems = this.fetchPoems.bind(this);
    this.renderPoems = this.renderPoems.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.selectDropdownTitle = this.selectDropdownTitle.bind(this);
  }

  changeSeedWord(event: any) {
    this.setState({
      seedWord: event.currentTarget.value.toLowerCase(),
    });
  }

  changePoemCount(event: any) {
    const poemCount: string = event.currentTarget.value;
    if (!isNaN(parseInt(poemCount))) {
      this.setState({
        poemCount: parseInt(poemCount),
      });
    } else if (poemCount === '') {
      this.setState({
        poemCount: null,
      })
    }
  }

  fetchPoems(event: any) {
    event.preventDefault();

    let { poemCount, seedWord, temperature, style } = this.state;
    if(!poemCount) {
      poemCount = 1;
    }
    temperature = Number(temperature) / 10;
    console.log(poemCount, seedWord, temperature);
    fetch(`${SERVER_URL}/lyrics`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        poems_counts: poemCount,
        temp: temperature,
        word: seedWord,
        style: style,
      }), 
    })
    .then(res => {
      console.log(res);
      return res;
    })
    .then(jsonPoems => jsonPoems.json())
    .then(poems => {
      this.setState({
        poems,
        showLyrics: true,
      })
    })
    .catch(err => console.log(err));
  }

  renderPoems(): React.ReactNode {
    return (
      <div>
        <Button
          onClick={() => this.setState({ showLyrics: false })} 
        >
          Back
        </Button>
        {
          this.state.poems.map((poem: String[], index: number) => (
            <div style={{ textAlign: "center" }} className="poem" key={`poem-${index}`}>
              {
                poem.map((verse: String, index: number) => (
                  <div className="verse" key={`verse-${index}`}>
                    { verse }
                  </div>
                ))
              }
              <br />
              <br />
            </div>
          ))
        }
      </div>
    );
  }

  selectDropdownTitle(): string {
    switch(this.state.style) {
      case 0:
        return 'Kanye';
      case 1:
        return 'Shakespeare';
      case 2:
        return 'Kanye + Shakespeare';
    }
    return 'Select a style!';
  }

  renderForm(): React.ReactNode {
    return (
      <Form
          onSubmit={this.fetchPoems}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Seed word</Form.Label>
          <Form.Control 
            type="text" 
            value={this.state.seedWord}
            onChange={this.changeSeedWord}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Poem count</Form.Label>
          <Form.Control 
            type="text" 
            value={(this.state.poemCount || 0).toString()}
            onChange={this.changePoemCount}
          />
        </Form.Group>
        
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Randomness level</Form.Label>
          <InputRange
            maxValue={100}
            minValue={0}
            step={1}
            value={this.state.temperature}
            onChange={temperature => this.setState({ temperature })} />
        </Form.Group>

        <Form.Group controlId="styleSelect">
          <Form.Label>Lyrical Style</Form.Label>
          <DropdownButton
            id="basic-dropdown"
            title={this.selectDropdownTitle()}
          >
            <Dropdown.Item
              onClick={() => this.setState({ style: 0 })}
            >
              Kanye
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ style: 1 })}
            >
              Shakespeare
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ style: 2 })}
            >
              Kanye + Shakespeare
            </Dropdown.Item>
          </DropdownButton>
        </Form.Group>

        <br />
        <Button 
          variant="primary" 
          type="submit">
          Get me some dope bars!
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <Jumbotron>
        {
          this.state.showLyrics ?
            this.renderPoems() :
            this.renderForm()
        }
      </Jumbotron>
    );
  }
}
