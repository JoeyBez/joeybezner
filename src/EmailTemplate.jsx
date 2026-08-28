import * as React from 'react';

export default function EmailTemplate(props) {
    const { firstName } = props;

    return (
    <div>
        <h3>Thanks, {firstName}!</h3>
    </div>
    );
}