declare var require: any

import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import * as CSS from 'csstype';


const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

const sectionHeaderRowStyle: CSS.Properties = {
   lineHeight: '32px', margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px', alignItems: 'center'
};

const sectionNameStyle: CSS.Properties = {
   fontSize: '24px', margin: '0px', padding: '0px' 
};

export const SectionHeader = (props: { name: string }) => (
   <div>
      <Container fluid style={thinStyle}>
         <Row style={sectionHeaderRowStyle}>
            <Col style={thinStyle}>
               <p style={sectionNameStyle}>{props.name}</p>
            </Col>
         </Row>
      </Container>
   </div>
);


