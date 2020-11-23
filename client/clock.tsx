/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import * as CSS from 'csstype';

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const clockRowStyle: CSS.Properties = {
   margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px', alignItems: 'center', lineHeight: '64px'
};

const clockStyle: CSS.Properties = {
   color: 'red', fontFamily: 'Orbitron', fontStyle: 'sans - serif', fontSize: '56px', margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px'
};

export const Clock = (props: { mm: Number, ss: Number }) => (
   <Row style={{clockRowStyle}}>
      <p style={clockStyle}>{("00" + props.mm).slice(-2)}:{("00" + props.ss).slice(-2)}</p>
   </Row>
);

