import React, { Component } from 'react';
import moment from 'moment';

class Countdown extends Component {
    state = {
        days: undefined,
        hours: undefined,
        minutes: undefined,
        seconds: undefined
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            const { timeTillDate, timeFormat } = this.props;
            const then = moment(timeTillDate, timeFormat);
            const now = moment();
            const countdown = moment(then - now);
            const days = countdown.format('D');
            const hours = countdown.format('HH');
            const minutes = countdown.format('mm');
            const seconds = countdown.format('ss');
            this.setState({ days, hours, minutes, seconds });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        const { hours, minutes, seconds } = this.state;
      
        return (
            <div>
                <strong className="white-text">THE NEXT EVENT LAUNCHES IN</strong>
                <h2
                    style = {{
                        fontFamily: "Segment7Standard",
                        color: "#ff0e1e",
                        fontSize:"4em"
                    }}
                >
                    <span>00</span><b style={{fontFamily:"Arial"}}>:</b><span>{minutes}</span><b style={{fontFamily:"Arial"}}>:</b><span>{seconds}</span>
                </h2>
            </div>
        );
    }
}

export default Countdown;