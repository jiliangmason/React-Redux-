import React from 'react';
import ReactDOM from 'react-dom';
import './static/css/common.less';
import './static/css/font.css';

/*
* 网页性能检测,生产环境下!!__DEV__为true
* */
if(!!__DEV__) {
    window.Perf = Perf;
}

class MainIndex extends React.Component {

    render() {
        return (
            <div>
                <h1>this is index</h1>
            </div>
        )
    }

}

ReactDOM.render(<MainIndex />, document.getElementById('root'));