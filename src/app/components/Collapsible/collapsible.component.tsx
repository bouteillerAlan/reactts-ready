import React, {Component} from "react";
import './collapsible.component.scss';
import Interwave from 'interweave';

interface CollapsibleComponentProps {
    datas: {header: string, text: string}[]
}

interface CollapsibleComponentStates {}

class CollapsibleComponent extends Component<CollapsibleComponentProps, CollapsibleComponentStates> {

    constructor(props: CollapsibleComponentProps) {
        super(props);
        this.state={}
    }

    handle = (e: any) => {
        //arrow
        const target = e.target;
        target.classList.toggle('close');
        //collapsible_body
        target.parentElement.parentElement.lastChild.classList.toggle('close');
        //collapsible_header
        target.parentElement.classList.toggle('close');
    };

    render(): React.ReactElement<any> {
        return (
            <ul className="collapsible">
                {this.props.datas.map((data, index) => (
                    <li key={data.header}>
                        <div className={`collapsible_header ${this.props.datas.length === index+1 ? '' : 'special_border close'}`}>
                            <div className="text">{data.header}</div>
                            <div className="icon close" onClick={(e) => {this.handle(e)}}> </div>
                        </div>
                        <div className={`collapsible_body close ${this.props.datas.length === index+1 ? 'last_border' : ''}`}><span><Interwave content={data.text}/></span></div>
                    </li>
                ))}
            </ul>
        );
    }
}

export default CollapsibleComponent;
