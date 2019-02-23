import React from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

import InputRange, { Range } from 'react-input-range';

import 'react-input-range/lib/css/index.css';

interface State {
  showLyrics: boolean;
  seedWord: string;
  temperature: number | Range;
  poemCount: number | null;
}

export default class Main extends React.Component<{}, State> {

  constructor(props: React.Props<{}>) {
    super(props);

    this.state = {
      showLyrics: false,
      seedWord: '',
      temperature: 50,
      poemCount: 1,
    };

    this.changeSeedWord = this.changeSeedWord.bind(this);
    this.changePoemCount = this.changePoemCount.bind(this);
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

  render() {
    console.log(this.state.seedWord);
    return (
      <Jumbotron>
        <Form>
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

          <br />
          <Button style={{ textAlign: 'center' }} variant="primary" type="submit">
            Get me some dope bars!
          </Button>
        </Form>
      </Jumbotron>
    );
  }
}