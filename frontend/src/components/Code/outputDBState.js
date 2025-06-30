import React from 'react';
import ChromaState from './DB_States/chromaState';
import PostgresState from './DB_States/postgresState';
import { CSSTransition, SwitchTransition } from "react-transition-group";
import './Code.css';

class OutputDBState extends React.Component {
    constructor(props) {
        super(props);
        this.dbStateRefs = {};
        this.state = {
            isPostgresModalOpen: false,
        }
        this.getDBStateRef = this.getDBStateRef.bind(this);
        this.renderDBState = this.renderDBState.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    getDBStateRef = (dbType) => {
        if (!this.dbStateRefs[dbType]) {
            this.dbStateRefs[dbType] = React.createRef();
        }
        return this.dbStateRefs[dbType];
    };

    renderDBState() {
        const { response, db_state, chosenDB } = this.props;

        switch (chosenDB) {
            case "Chroma":
                return <ChromaState response={response} db_state={db_state} />;
            case "PostgreSQL":
                return <PostgresState response={response} db_state={db_state} open={this.open} close={this.close} isPostgresModalOpen={this.state.isPostgresModalOpen} postgresTableInfo={this.props.postgresTableInfo} userid={this.props.userid}/>;
            default:
                return null;
        }
    }

    render() {
        const { chosenDB } = this.props;
        const nodeRef = this.getDBStateRef(chosenDB);

        return (
            <div>
                <SwitchTransition>
                    <CSSTransition
                        key={chosenDB}
                        timeout={300}
                        classNames="db-state-fade"
                        unmountOnExit
                        nodeRef={nodeRef}
                    >
                        <div ref={nodeRef}>
                            {this.renderDBState()}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        )
    }

    open = () => {
        this.setState({ isPostgresModalOpen: true });
    };

    close = () => {
        this.setState({ isPostgresModalOpen: false });
    }
}

export default OutputDBState;