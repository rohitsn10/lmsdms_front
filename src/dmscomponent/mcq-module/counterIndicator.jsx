import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function CounterIndicator({ counter, setCounter, timerLimit }) {
    const buttonStyles = {
        width: '100px',
        height: '36px',
        borderRadius: '7px',
        backgroundColor: counter > timerLimit ? 'red' : "white",
        color: 'black',
        fontSize: '24px',
        fontWeight: 'semibold',
        textAlign: 'center',
        lineHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const headTitle = {
        fontSize: '13px'
    };

    const ItemCtn = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1px'
    };

    useEffect(() => {
        let timer = setInterval(() => {
            setCounter((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [setCounter]);

    const formatTime = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    };

    return (
        <div style={ItemCtn}>
            <p style={headTitle}>Time Remaining</p>
            <div style={buttonStyles}>{formatTime(counter)}</div>
        </div>
    );
}

CounterIndicator.propTypes = {
    counter: PropTypes.number.isRequired,
    setCounter: PropTypes.func.isRequired,
    timerLimit: PropTypes.number.isRequired,
};

export default CounterIndicator;
