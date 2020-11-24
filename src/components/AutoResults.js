import React, {Component} from 'react';
import {Form} from 'react-bootstrap';
import './AutoResults.css';

class AutoResults extends Component{

    constructor(props) {
      super(props);
      this.handleSuggestions = this.handleSuggestions.bind(this);
    }

    handleSuggestions(){
        if (this.props.suggestions == null){
            return;
        }
        else{
            return(
                this.props.suggestions.map(address =>(
                    <Form style={{backgroundColor:"white"}} key={address}>
                        <Form.Control className="result" plaintext readOnly defaultValue= {address.combined_string} key= {address.id} onClick = {() => {this.props.selectCallback(address.combined_string)}}></Form.Control>
                    </Form>
                ))
            );
        }
    }

    render(){
        return(
            <>
                {this.handleSuggestions()}
            </>
        );
    }
}

export default AutoResults;